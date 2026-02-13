import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Download, ArrowLeft, Shield, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import jsPDF from 'jspdf';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { assessmentClusters } from '../data/questions';

interface ClusterScore {
  clusterId: string;
  clusterTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
}

interface AssessmentData {
  id: string;
  userName: string;
  userEmail: string;
  companyName: string;
  location: string;
  overallPercentage: number;
  totalScore: number;
  maxTotalScore: number;
  clusterScores: ClusterScore[];
  submittedAt: string;
}

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-351c7044/assessment/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch assessment');
      }

      setAssessment(data);
    } catch (error: any) {
      console.error('Error fetching assessment:', error);
      toast.error(error.message || 'Failed to load assessment');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!assessment) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('ISO 27001 Risk Assessment Report', margin, yPos);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPos);

    // User Information
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Information', margin, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${assessment.userName}`, margin, yPos);
    yPos += 7;
    doc.text(`Email: ${assessment.userEmail}`, margin, yPos);
    yPos += 7;
    doc.text(`Company: ${assessment.companyName}`, margin, yPos);
    yPos += 7;
    doc.text(`Location: ${assessment.location}`, margin, yPos);
    yPos += 7;
    doc.text(`Submission Date: ${new Date(assessment.submittedAt).toLocaleDateString()}`, margin, yPos);

    // Overall Score
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Assessment Score', margin, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`${assessment.overallPercentage}% (${assessment.totalScore}/${assessment.maxTotalScore} points)`, margin, yPos);

    // Status
    yPos += 10;
    doc.setFontSize(10);
    const status = assessment.overallPercentage >= 75 ? 'Good' : assessment.overallPercentage >= 50 ? 'Moderate' : 'Needs Improvement';
    doc.text(`Status: ${status}`, margin, yPos);

    // Category Breakdown
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Category Breakdown', margin, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    assessment.clusterScores.forEach((cluster) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${cluster.clusterTitle}: ${cluster.percentage}%`, margin, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text(`Score: ${cluster.score}/${cluster.maxScore}`, margin + 5, yPos);
      yPos += 10;
    });

    // Recommendations
    if (yPos > 200) {
      doc.addPage();
      yPos = 20;
    }

    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations', margin, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const recommendations = [
      'Review and update information security policies regularly',
      'Implement multi-factor authentication for all users',
      'Conduct regular security awareness training',
      'Perform periodic access rights reviews',
      'Establish incident response procedures',
      'Test business continuity and disaster recovery plans',
      'Maintain an up-to-date asset inventory',
      'Implement encryption for sensitive data',
    ];

    // Filter recommendations based on low-scoring categories
    const lowScoringCategories = assessment.clusterScores
      .filter(c => c.percentage < 75)
      .map(c => c.clusterTitle);

    recommendations.forEach((rec) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      const lines = doc.splitTextToSize(`• ${rec}`, pageWidth - 2 * margin);
      doc.text(lines, margin, yPos);
      yPos += lines.length * 7;
    });

    // Save PDF
    doc.save(`ISO27001-Assessment-Report-${assessment.companyName.replace(/\s+/g, '-')}.pdf`);
    toast.success('Report downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 75) return <CheckCircle2 className="size-8 text-green-600" />;
    if (percentage >= 50) return <AlertTriangle className="size-8 text-yellow-600" />;
    return <AlertCircle className="size-8 text-red-600" />;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = (percentage: number) => {
    if (percentage >= 75) return 'bg-green-50';
    if (percentage >= 50) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="size-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Assessment Report</h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="size-4 mr-2" />
                Back to Home
              </Button>
              <Button onClick={downloadPDF}>
                <Download className="size-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* User Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assessment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-semibold">{assessment.userName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-semibold">{assessment.userEmail}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Company</div>
                <div className="font-semibold">{assessment.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-semibold">{assessment.location}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Submission Date</div>
                <div className="font-semibold">
                  {new Date(assessment.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overall Score Card */}
        <Card className={`mb-6 ${getStatusBg(assessment.overallPercentage)}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(assessment.overallPercentage)}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Overall Assessment Score</div>
                  <div className={`text-4xl font-bold ${getStatusColor(assessment.overallPercentage)}`}>
                    {assessment.overallPercentage}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {assessment.totalScore} out of {assessment.maxTotalScore} points
                  </div>
                </div>
              </div>
              <Badge 
                variant={assessment.overallPercentage >= 75 ? 'default' : assessment.overallPercentage >= 50 ? 'secondary' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {assessment.overallPercentage >= 75 ? 'Good' : assessment.overallPercentage >= 50 ? 'Moderate' : 'Needs Improvement'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {assessment.clusterScores.map((cluster) => (
                <div key={cluster.clusterId}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-semibold">{cluster.clusterTitle}</div>
                      <div className="text-sm text-gray-600">
                        {cluster.score} / {cluster.maxScore} points
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-bold ${getStatusColor(cluster.percentage)}`}>
                        {cluster.percentage}%
                      </span>
                      <Badge
                        variant={cluster.percentage >= 75 ? 'default' : cluster.percentage >= 50 ? 'secondary' : 'destructive'}
                      >
                        {cluster.percentage >= 75 ? 'Good' : cluster.percentage >= 50 ? 'Moderate' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={cluster.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assessment.clusterScores
                .filter(c => c.percentage < 75)
                .map((cluster) => {
                  const clusterData = assessmentClusters.find(ac => ac.id === cluster.clusterId);
                  return (
                    <div key={cluster.clusterId} className="border-l-4 border-yellow-500 pl-4 py-2">
                      <div className="font-semibold text-gray-900">{cluster.clusterTitle}</div>
                      <p className="text-sm text-gray-600 mt-1">
                        {clusterData?.description || 'Focus on improving controls in this area to enhance your security posture.'}
                      </p>
                    </div>
                  );
                })}
              
              {assessment.clusterScores.every(c => c.percentage >= 75) && (
                <div className="text-center py-8">
                  <CheckCircle2 className="size-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Great job! All categories are performing well. Continue to maintain and improve your security controls.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
