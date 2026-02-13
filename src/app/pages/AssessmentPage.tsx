import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { assessmentClusters } from '../data/questions';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Answer {
  questionId: string;
  value: string;
  score: number;
}

export function AssessmentPage() {
  const navigate = useNavigate();
  const [currentClusterIndex, setCurrentClusterIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    companyName: '',
    location: '',
  });

  const currentCluster = assessmentClusters[currentClusterIndex];
  const totalClusters = assessmentClusters.length;
  const progress = ((currentClusterIndex + 1) / totalClusters) * 100;

  // Check if all questions in current cluster are answered
  const allQuestionsAnswered = currentCluster.questions.every(
    (q) => answers[q.id]
  );

  const handleAnswerChange = (questionId: string, value: string, score: number) => {
    setAnswers({
      ...answers,
      [questionId]: { questionId, value, score },
    });
  };

  const handleNext = () => {
    if (!allQuestionsAnswered) {
      toast.error('Please answer all questions before proceeding');
      return;
    }

    if (currentClusterIndex < totalClusters - 1) {
      setCurrentClusterIndex(currentClusterIndex + 1);
    } else {
      // Show user info dialog before submission
      setShowUserInfoDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentClusterIndex > 0) {
      setCurrentClusterIndex(currentClusterIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Calculate scores by cluster
      const clusterScores = assessmentClusters.map((cluster) => {
        const clusterAnswers = cluster.questions.map((q) => answers[q.id]);
        const totalScore = clusterAnswers.reduce((sum, a) => sum + a.score, 0);
        const maxScore = cluster.questions.length * 4;
        const percentage = (totalScore / maxScore) * 100;

        return {
          clusterId: cluster.id,
          clusterTitle: cluster.title,
          score: totalScore,
          maxScore,
          percentage: Math.round(percentage),
        };
      });

      const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
      const maxTotalScore = assessmentClusters.reduce(
        (sum, cluster) => sum + cluster.questions.length * 4,
        0
      );
      const overallPercentage = Math.round((totalScore / maxTotalScore) * 100);

      // Submit assessment to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-351c7044/submit-assessment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userInfo,
            answers: Object.values(answers),
            clusterScores,
            totalScore,
            maxTotalScore,
            overallPercentage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit assessment');
      }

      toast.success('Assessment submitted successfully!');
      navigate(`/report/${data.assessmentId}`);
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      toast.error(error.message || 'Failed to submit assessment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">ISO 27001 Assessment</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              Exit
            </Button>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Cluster {currentClusterIndex + 1} of {totalClusters}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentClusterIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">{currentCluster.title}</CardTitle>
                <CardDescription className="text-base">
                  {currentCluster.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {currentCluster.questions.map((question, index) => (
                  <div key={question.id} className="pb-6 border-b last:border-b-0">
                    <div className="flex gap-3 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {index + 1}
                      </div>
                      <Label className="text-lg font-medium leading-tight flex-1">
                        {question.text}
                      </Label>
                    </div>

                    <RadioGroup
                      value={answers[question.id]?.value || ''}
                      onValueChange={(value) => {
                        const option = question.options.find((opt) => opt.value === value);
                        if (option) {
                          handleAnswerChange(question.id, value, option.score);
                        }
                      }}
                      className="space-y-3 ml-11"
                    >
                      {question.options.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                            answers[question.id]?.value === option.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                          <Label
                            htmlFor={`${question.id}-${option.value}`}
                            className="flex-1 cursor-pointer font-normal"
                          >
                            {option.label}
                          </Label>
                          {answers[question.id]?.value === option.value && (
                            <CheckCircle className="size-5 text-blue-600" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentClusterIndex === 0}
                className="gap-2"
              >
                <ArrowLeft className="size-4" />
                Previous
              </Button>

              <div className="text-sm text-gray-600">
                {currentCluster.questions.filter((q) => answers[q.id]).length} of{' '}
                {currentCluster.questions.length} answered
              </div>

              <Button
                onClick={handleNext}
                disabled={!allQuestionsAnswered}
                className="gap-2"
              >
                {currentClusterIndex === totalClusters - 1 ? 'Complete' : 'Next'}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* User Info Dialog */}
      <Dialog open={showUserInfoDialog} onOpenChange={setShowUserInfoDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Assessment</DialogTitle>
            <DialogDescription>
              Please provide your information to receive your assessment report.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={userInfo.companyName}
                onChange={(e) => setUserInfo({ ...userInfo, companyName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={userInfo.location}
                onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Assessment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
