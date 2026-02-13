import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { supabase } from '../utils/supabase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Shield, FileSearch, BarChart3, Download, ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../components/ui/input-otp';

const steps = [
  {
    icon: FileSearch,
    title: "Answer Questions",
    description: "Complete our comprehensive ISO 27001 assessment questionnaire",
  },
  {
    icon: BarChart3,
    title: "Analyze Results",
    description: "Our system evaluates your responses against ISO 27001 standards",
  },
  {
    icon: Shield,
    title: "Identify Gaps",
    description: "Discover security gaps and areas for improvement",
  },
  {
    icon: Download,
    title: "Get Report",
    description: "Download your detailed risk assessment report",
  },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [otpValue, setOtpValue] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    location: '',
  });

  // Animate through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('Signed in successfully!');
      setShowSignIn(false);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-351c7044/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            companyName: formData.companyName,
            location: formData.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Store temporary user ID and demo OTP
      setTempUserId(data.tempUserId);
      setDemoOtp(data.otp); // For demo purposes only
      
      toast.success(`Verification code sent to ${formData.email}! (Demo OTP: ${data.otp})`, {
        duration: 10000,
      });
      
      setShowSignUp(false);
      setShowOtpVerify(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-351c7044/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            tempUserId,
            otp: otpValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      toast.success('Account verified successfully! Please sign in.');
      setShowOtpVerify(false);
      setShowSignIn(true);
      setFormData({ email: '', password: '', name: '', companyName: '', location: '' });
      setOtpValue('');
      setTempUserId('');
      setDemoOtp('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAssessment = () => {
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="size-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ISO 27001 Assessment</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Sign In
            </Button>
            <Button onClick={() => setShowSignUp(true)}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Animated Steps */}
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Identify Security Gaps in
              <span className="text-blue-600"> 4 Simple Steps</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 mb-12"
            >
              Complete our comprehensive ISO 27001 risk assessment and discover vulnerabilities in your security protocols.
            </motion.p>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                const isPast = index < activeStep;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex gap-4 p-4 rounded-lg transition-all duration-500 ${
                      isActive ? 'bg-blue-50 border-2 border-blue-600 shadow-lg' : 'bg-white border-2 border-transparent'
                    }`}
                  >
                    {/* Step Number/Icon */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isActive ? '#2563eb' : isPast ? '#10b981' : '#e5e7eb',
                      }}
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive ? 'text-white' : isPast ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 className="size-6" />
                      ) : (
                        <Icon className="size-6" />
                      )}
                    </motion.div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg mb-1 ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm ${isActive ? 'text-blue-700' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-2 top-1/2 -translate-y-1/2"
                      >
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Step {activeStep + 1} of {steps.length}
              </p>
            </div>
          </div>

          {/* Right Side - CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Shield className="size-10 text-blue-600" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              
              <p className="text-gray-600 mb-8 text-lg">
                Take the first step towards ISO 27001 compliance. Our comprehensive assessment will help you identify security gaps and receive actionable recommendations.
              </p>

              <Button 
                size="lg" 
                className="w-full text-lg h-14 group"
                onClick={handleStartAssessment}
              >
                Give Risk Assessment
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">25+</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">15min</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Sign In Dialog */}
      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Sign in to access the dashboard and view assessment results.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowSignIn(false);
                  setShowSignUp(true);
                }}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>
              Sign up to access the dashboard and manage assessments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="signup-company">Company Name</Label>
              <Input
                id="signup-company"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="signup-location">Location</Label>
              <Input
                id="signup-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setShowSignUp(false);
                  setShowSignIn(true);
                }}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpVerify} onOpenChange={setShowOtpVerify}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a verification code to your email. Please enter it below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                <Mail className="size-8 text-blue-600" />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="font-medium text-gray-900">{formData.email}</p>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {demoOtp && (
                <div className="text-xs text-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800">
                    <strong>Demo Mode:</strong> Your verification code is <strong>{demoOtp}</strong>
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowOtpVerify(false);
                  setShowSignUp(true);
                  setOtpValue('');
                }}
                className="text-sm text-blue-600 hover:underline"
                disabled={isLoading}
              >
                Back to sign up
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
