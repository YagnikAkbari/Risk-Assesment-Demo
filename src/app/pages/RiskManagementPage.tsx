import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import {
  Shield,
  Download,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Share2,
  FileText,
  ClipboardCheck,
  Server,
  Globe,
  ArrowRight,
} from "lucide-react";
import jsPDF from "jspdf";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

// Mock data updated to match the screenshot context
const MOCK_DATA = {
  overallPercentage: 88,
  breakdown: [
    { label: "Policies", score: 68, color: "#3b82f6", icon: FileText },
    {
      label: "Evidence Task",
      score: 91,
      color: "#10b981",
      icon: ClipboardCheck,
    },
    { label: "Automated Tests", score: 85, color: "#10b981", icon: Server },
  ],
  clusterScores: [
    { name: "Access Control", score: 85, fill: "#10b981" },
    { name: "Data Protection", score: 72, fill: "#eab308" },
    { name: "Asset Management", score: 90, fill: "#10b981" },
    { name: "Incident Response", score: 65, fill: "#eab308" },
    { name: "Compliance", score: 95, fill: "#10b981" },
  ],
};

// Helper component for circular progress
const CircularProgress = ({
  value,
  color,
  size = 160,
  strokeWidth = 10,
  showIcon_Icon: IconComponent = null,
  label = "",
  subLabel = "",
}: {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  showIcon_Icon?: any;
  label?: string;
  subLabel?: string;
}) => {
  const data = [
    { name: "Completed", value: value, fill: color },
    { name: "Remaining", value: 100 - value, fill: "#f3f4f6" },
  ];

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size / 2 - strokeWidth}
              outerRadius={size / 2}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {IconComponent ? (
            <div
              className={`p-2 rounded-full mb-1 ${value >= 90 ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
          ) : (
            <span className="text-3xl font-bold text-gray-900">{value}%</span>
          )}
          {subLabel && (
            <span className="text-xs text-gray-500 font-medium">
              {subLabel}
            </span>
          )}
        </div>
      </div>
      {label && (
        <div className="mt-2 text-center text-sm font-medium text-gray-600">
          {label}
        </div>
      )}
      {/* If it's the main large chart, show extra text below */}
      {!IconComponent && !label && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4 text-sm font-medium text-gray-500">
          Compliant
        </div>
      )}
    </div>
  );
};

export function RiskManagementPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(MOCK_DATA.overallPercentage);

  const handleStartAssessment = () => {
    navigate("/assessment");
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const downloadPDF = () => {
    try {
      setLoading(true);
      const doc = new jsPDF();
      const margin = 20;
      let yPos = 20;

      // Header
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 150, 243);
      doc.text("Risk Assessment Report", margin, yPos);

      yPos += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        margin,
        yPos,
      );

      // Score Section
      yPos += 20;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Overall Security Score", margin, yPos);

      yPos += 15;
      doc.setFontSize(40);
      doc.setTextColor(16, 185, 129);
      doc.text(`${score}%`, margin, yPos);

      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);
      doc.text(`Risk Level: ${score >= 75 ? "Low" : "Moderate"}`, margin, yPos);

      // Detailed Breakdown
      yPos += 25;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Category Breakdown", margin, yPos);

      yPos += 15;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      MOCK_DATA.clusterScores.forEach((cluster) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(`${cluster.name}:`, margin, yPos);
        doc.text(`${cluster.score}%`, margin + 50, yPos);

        doc.setDrawColor(200, 200, 200);
        doc.rect(margin + 70, yPos - 3, 50, 3);
        doc.setFillColor(
          cluster.score >= 75 ? 16 : 234,
          cluster.score >= 75 ? 185 : 179,
          cluster.score >= 75 ? 129 : 8,
        );
        doc.rect(margin + 70, yPos - 3, 50 * (cluster.score / 100), 3);

        yPos += 10;
      });

      doc.save("risk-assessment-report.pdf");
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              RiskGuard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              className="w-full text-lg h-10 group"
              onClick={handleStartAssessment}
            >
              Give Risk Assessment
              <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Your Risk Management Overview
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View your current security standing, identify critical gaps, and
            download comprehensive reports to guide your compliance journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Score Card (ISO 27001 Style) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="h-full border border-gray-200 shadow-xl bg-white rounded-2xl overflow-visible">
              <CardHeader className="flex flex-row items-center gap-3 pb-2 pt-6 px-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">ISO 27001</h3>
                  <p className="text-xs text-gray-500">Compliance Framework</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-8">
                {/* Main Large Gauge */}
                <div className="mt-4 mb-8">
                  <CircularProgress
                    value={score}
                    color="#10b981"
                    size={200}
                    strokeWidth={12}
                  />
                </div>

                {/* Sub Gauges Row */}
                <div className="grid grid-cols-3 gap-4 w-full px-2">
                  {MOCK_DATA.breakdown.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <CircularProgress
                        value={item.score}
                        color={item.color}
                        size={60}
                        strokeWidth={6}
                        showIcon_Icon={item.icon}
                      />
                      <div className="text-center mt-2">
                        <div className="font-bold text-gray-900 text-sm">
                          {item.score}%
                        </div>
                        <div className="text-xs text-gray-500 leading-tight">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-100 transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 text-lg">
                      Download Report
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Get detailed insights & analysis
                    </p>
                  </div>
                  <Button
                    onClick={downloadPDF}
                    variant="ghost"
                    className="bg-white/80 hover:bg-white text-blue-700 rounded-full h-12 w-12 p-0 flex items-center justify-center border border-blue-200"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-purple-50 border-purple-100 transition-shadow hover:shadow-md cursor-pointer">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-purple-900 text-lg">
                      Share Results
                    </h3>
                    <p className="text-purple-700 text-sm mt-1">
                      Collaborate with your team
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="bg-white/80 hover:bg-white text-purple-700 rounded-full h-12 w-12 p-0 flex items-center justify-center border border-purple-200"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>
                  Breakdown by key security domains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {MOCK_DATA.clusterScores.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {item.score >= 80 ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className="font-medium text-gray-700">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.fill }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity / Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-gray-500" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500" />
                    <span>
                      Your <strong>Access Control</strong> score is top tier,
                      placing you in the top 10% of your industry.
                    </span>
                  </li>
                  <li className="flex gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-yellow-500" />
                    <span>
                      <strong>Incident Response</strong> needs attention.
                      Updating your protocols could improve your score by 15
                      points.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
