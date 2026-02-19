import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "@/lib/supabaseInfo";
import {
  getAssessmentFramework,
  getFrameworkMetadata,
} from "@/redux/actions/assessmentAction/assessmentAction";
import { RootState } from "@/redux";

interface Answer {
  questionId: string;
  value: string;
  score: number;
}

export function AssessmentPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { framework, metadata, isLoading } = useSelector(
    (state: RootState) => state.assessment,
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showUserInfoDialog, setShowUserInfoDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    companyName: "",
    location: "",
  });


  useEffect(() => {
    (dispatch as any)(
      getFrameworkMetadata({
        slug: "iso-27001",
        onError: (err: any) => {
          toast.error(err);
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (currentStep) {
      (dispatch as any)(
        getAssessmentFramework({
          slug: "iso-27001",
          step: currentStep,
          onError: (err: any) => {
            toast.error(err);
          },
        }),
      );
    }
  }, [dispatch, currentStep]);


  const questions = framework?.questions || [];

  const handleAnswerChange = (
    questionId: string,
    value: string,
    score: number,
  ) => {
    setAnswers({
      ...answers,
      [questionId]: { questionId, value, score },
    });
  };

  const handleNext = () => {
    // Validate all questions in the current step
    const allAnswered = questions.every((q) => answers[q.id]);
    if (!allAnswered) {
      toast.error("Please answer all questions in this step before proceeding");
      return;
    }

    if (currentStep < (metadata?.totalSteps || 0)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowUserInfoDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const totalScore = Object.values(answers).reduce(
        (sum, a) => sum + a.score,
        0,
      );
      const maxTotalScore = questions.reduce(
        (sum, q) => sum + parseFloat(q.maxScore),
        0,
      );
      const overallPercentage = Math.round((totalScore / maxTotalScore) * 100);

      // Submit assessment to backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-351c7044/submit-assessment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            userInfo,
            answers: Object.values(answers),
            totalScore,
            maxTotalScore,
            overallPercentage,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit assessment");
      }

      toast.success("Assessment submitted successfully!");
      router.push(`/report/${data.assessmentId}`);
    } catch (error: any) {
      console.error("Error submitting assessment:", error);
      toast.error(error.message || "Failed to submit assessment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6 max-w-6xl">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {metadata?.name || "Assessment"}
              </h1>
              <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                {metadata?.description ||
                  "Information Security Management System standard"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="hover:bg-gray-50"
            >
              Exit
            </Button>
          </div>

          {/* Step Navigation Bar */}
          {metadata && metadata.totalSteps > 0 && (
            <div className="group">
              <div className="flex gap-1.5 px-1">
                {Array.from(
                  { length: metadata.totalSteps },
                  (_, i) => i + 1,
                ).map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`flex-1 h-2.5 rounded-full transition-all duration-300 relative ${
                      currentStep === step
                        ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        : currentStep > step
                          ? "bg-blue-400"
                          : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    title={`Step ${step}`}
                  >
                    {currentStep === step && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute inset-0 bg-white/30 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="size-10 animate-spin text-blue-600" />
            <p className="text-gray-400 font-medium">Fetching step data...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-gray-400 italic">
              No questions available for this step.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {questions.map((question) => (
                  <Card
                    key={question.id}
                    className="border-none shadow-lg shadow-blue-900/5 rounded-3xl overflow-hidden"
                  >
                    <CardContent className="p-8 md:p-10 space-y-8">
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xs border border-blue-100 shadow-sm">
                          {question.controlReference}
                        </div>
                        <Label className="text-xl font-semibold text-gray-900 leading-snug pt-1 flex-1">
                          {question.questionText}
                        </Label>
                      </div>

                      <RadioGroup
                        value={answers[question.id]?.value || ""}
                        onValueChange={(value) => {
                          const option = question.options.find(
                            (opt) => opt.id === value,
                          );
                          if (option) {
                            handleAnswerChange(
                              question.id,
                              value,
                              parseFloat(option.scoreValue || "0"),
                            );
                          }
                        }}
                        className="flex flex-row gap-3 bg-gray-50/50 p-2 rounded-3xl border border-gray-100"
                      >
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`flex-1 flex flex-col items-center justify-center p-5 rounded-2xl transition-all cursor-pointer text-center gap-2 border-2 ${
                              answers[question.id]?.value === option.id
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white text-gray-600 border-transparent hover:border-gray-200"
                            }`}
                            onClick={() => {
                              const radioItem = document.getElementById(
                                `${question.id}-${option.id}`,
                              );
                              radioItem?.click();
                            }}
                          >
                            <RadioGroupItem
                              value={option.id}
                              id={`${question.id}-${option.id}`}
                              className="sr-only"
                            />
                            <span className="text-sm font-bold leading-tight">
                              {option.optionText}
                            </span>
                            {answers[question.id]?.value === option.id ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="size-1.5 bg-white rounded-full shadow-sm"
                              />
                            ) : (
                              <div className="size-1.5 bg-gray-200 rounded-full" />
                            )}
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 px-4 pb-10">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-3 text-gray-500 hover:text-gray-900 transition-colors py-6 px-8 rounded-2xl"
              >
                <ArrowLeft className="size-5" />
                <span className="font-bold">Previous Step</span>
              </Button>

              <Button
                onClick={handleNext}
                className="gap-3 py-6 px-12 rounded-2xl shadow-xl shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 transition-all active:scale-95"
              >
                <span className="font-bold ml-1">
                  {currentStep === metadata?.totalSteps
                    ? "Complete Assessment"
                    : "Next Step"}
                </span>
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        )}
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
                onChange={(e) =>
                  setUserInfo({ ...userInfo, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={userInfo.companyName}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, companyName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={userInfo.location}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, location: e.target.value })
                }
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
