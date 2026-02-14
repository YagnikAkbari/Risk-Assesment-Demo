import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { supabase } from "../utils/supabase";
import { toast } from "sonner";
import { Search, LogOut, FileText, ArrowUpDown, Shield } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Assessment {
  id: string;
  userName: string;
  userEmail: string;
  companyName: string;
  location: string;
  overallPercentage: number;
  totalScore: number;
  maxTotalScore: number;
  submittedAt: string;
}

// Demo data for when no real assessments exist
const DEMO_ASSESSMENTS: Assessment[] = [
  {
    id: "demo-1",
    userName: "John Smith",
    userEmail: "john.smith@techcorp.com",
    companyName: "TechCorp Inc.",
    location: "San Francisco, CA",
    overallPercentage: 78,
    totalScore: 195,
    maxTotalScore: 250,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "demo-2",
    userName: "Sarah Johnson",
    userEmail: "sarah.j@innovatelab.com",
    companyName: "Innovate Labs",
    location: "New York, NY",
    overallPercentage: 65,
    totalScore: 162,
    maxTotalScore: 250,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "demo-3",
    userName: "Michael Chen",
    userEmail: "mchen@securedata.io",
    companyName: "SecureData Solutions",
    location: "Austin, TX",
    overallPercentage: 45,
    totalScore: 112,
    maxTotalScore: 250,
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "demo-4",
    userName: "Emily Rodriguez",
    userEmail: "emily.r@cloudtech.com",
    companyName: "CloudTech Systems",
    location: "Seattle, WA",
    overallPercentage: 82,
    totalScore: 205,
    maxTotalScore: 250,
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: "demo-5",
    userName: "David Park",
    userEmail: "dpark@cyberguard.net",
    companyName: "CyberGuard Security",
    location: "Boston, MA",
    overallPercentage: 91,
    totalScore: 227,
    maxTotalScore: 250,
    submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "score" | "company">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchAssessments();
  }, []);

  useEffect(() => {
    filterAndSortAssessments();
  }, [assessments, searchQuery, sortBy, sortOrder]);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to access the dashboard");
      navigate("/");
    }
  };

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-351c7044/assessments`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch assessments");
      }

      // If no real assessments, use demo data
      if (data.assessments.length === 0) {
        setAssessments(DEMO_ASSESSMENTS);
        setIsDemoData(true);
      } else {
        setAssessments(data.assessments);
        setIsDemoData(false);
      }
    } catch (error: any) {
      console.error("Error fetching assessments:", error);
      toast.error(error.message || "Failed to load assessments");
      // Use demo data if real data fails to load
      setAssessments(DEMO_ASSESSMENTS);
      setIsDemoData(true);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAssessments = () => {
    let filtered = [...assessments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assessment) =>
          assessment.userName.toLowerCase().includes(query) ||
          assessment.userEmail.toLowerCase().includes(query) ||
          assessment.companyName.toLowerCase().includes(query) ||
          assessment.location.toLowerCase().includes(query),
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          comparison =
            new Date(a.submittedAt).getTime() -
            new Date(b.submittedAt).getTime();
          break;
        case "score":
          comparison = a.overallPercentage - b.overallPercentage;
          break;
        case "company":
          comparison = a.companyName.localeCompare(b.companyName);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredAssessments(filtered);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const getScoreBadgeVariant = (
    percentage: number,
  ): "default" | "secondary" | "destructive" => {
    if (percentage >= 75) return "default";
    if (percentage >= 50) return "secondary";
    return "destructive";
  };

  const getScoreLabel = (percentage: number): string => {
    if (percentage >= 75) return "Good";
    if (percentage >= 50) return "Moderate";
    return "Needs Improvement";
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="size-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Assessment Dashboard
              </h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="size-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">
                  Assessment Submissions
                </CardTitle>
                {isDemoData && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 border-amber-300"
                  >
                    Demo Data
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email, company, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2">
                  <Select
                    value={sortBy}
                    onValueChange={(value: any) => setSortBy(value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="score">Score</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSortOrder}
                    title={sortOrder === "asc" ? "Ascending" : "Descending"}
                  >
                    <ArrowUpDown className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading assessments...</p>
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="size-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {searchQuery
                    ? "No assessments found matching your search."
                    : "No assessments submitted yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">
                          {assessment.userName}
                        </TableCell>
                        <TableCell>{assessment.userEmail}</TableCell>
                        <TableCell>{assessment.companyName}</TableCell>
                        <TableCell>{assessment.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">
                              {assessment.overallPercentage}%
                            </div>
                            <div className="text-xs text-gray-500">
                              ({assessment.totalScore}/
                              {assessment.maxTotalScore})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getScoreBadgeVariant(
                              assessment.overallPercentage,
                            )}
                          >
                            {getScoreLabel(assessment.overallPercentage)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(assessment.submittedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/report/${assessment.id}`)}
                          >
                            <FileText className="size-4 mr-2" />
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Summary Stats */}
            {!loading && filteredAssessments.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredAssessments.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {searchQuery ? "Filtered Results" : "Total Assessments"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {
                        filteredAssessments.filter(
                          (a) => a.overallPercentage >= 75,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Good Scores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {
                        filteredAssessments.filter(
                          (a) =>
                            a.overallPercentage >= 50 &&
                            a.overallPercentage < 75,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Moderate Scores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {
                        filteredAssessments.filter(
                          (a) => a.overallPercentage < 50,
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">
                      Needs Improvement
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
