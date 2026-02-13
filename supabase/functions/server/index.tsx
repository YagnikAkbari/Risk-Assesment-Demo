import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-351c7044/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-351c7044/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, companyName, location } = body;

    if (!email || !password || !name || !companyName || !location) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        companyName, 
        location 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true,
      user: data.user 
    });
  } catch (error: any) {
    console.log('Signup error:', error);
    return c.json({ error: error.message || 'Failed to sign up' }, 500);
  }
});

// Submit assessment endpoint
app.post("/make-server-351c7044/submit-assessment", async (c) => {
  try {
    const body = await c.req.json();
    const { userInfo, answers, clusterScores, totalScore, maxTotalScore, overallPercentage } = body;

    if (!userInfo || !answers || !clusterScores) {
      return c.json({ error: 'Invalid assessment data' }, 400);
    }

    const assessmentId = crypto.randomUUID();
    const assessment = {
      id: assessmentId,
      userName: userInfo.name,
      userEmail: userInfo.email,
      companyName: userInfo.companyName,
      location: userInfo.location,
      answers,
      clusterScores,
      totalScore,
      maxTotalScore,
      overallPercentage,
      submittedAt: new Date().toISOString(),
    };

    // Store assessment in KV store
    await kv.set(`assessment:${assessmentId}`, assessment);

    // Add to assessments list
    const existingAssessments = await kv.get('assessments:list') || [];
    existingAssessments.push(assessmentId);
    await kv.set('assessments:list', existingAssessments);

    return c.json({ 
      success: true,
      assessmentId 
    });
  } catch (error: any) {
    console.log('Submit assessment error:', error);
    return c.json({ error: error.message || 'Failed to submit assessment' }, 500);
  }
});

// Get all assessments endpoint (requires auth)
app.get("/make-server-351c7044/assessments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all assessment IDs
    const assessmentIds = await kv.get('assessments:list') || [];
    
    // Fetch all assessments
    const assessments = [];
    for (const id of assessmentIds) {
      const assessment = await kv.get(`assessment:${id}`);
      if (assessment) {
        assessments.push(assessment);
      }
    }

    return c.json({ assessments });
  } catch (error: any) {
    console.log('Get assessments error:', error);
    return c.json({ error: error.message || 'Failed to fetch assessments' }, 500);
  }
});

// Get single assessment endpoint
app.get("/make-server-351c7044/assessment/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!id) {
      return c.json({ error: 'Assessment ID is required' }, 400);
    }

    const assessment = await kv.get(`assessment:${id}`);
    
    if (!assessment) {
      return c.json({ error: 'Assessment not found' }, 404);
    }

    return c.json(assessment);
  } catch (error: any) {
    console.log('Get assessment error:', error);
    return c.json({ error: error.message || 'Failed to fetch assessment' }, 500);
  }
});

Deno.serve(app.fetch);