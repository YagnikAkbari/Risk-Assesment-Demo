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
  saveAssessmentDraft,
} from "@/redux/actions/assessmentAction/assessmentAction";
import { RootState } from "@/redux";
import { AssessmentAnswer } from "@/redux/actions/assessmentAction/assessmentActionInterface";

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

  // Auto-save logic
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const answersArray: AssessmentAnswer[] = Object.values(answers).map((ans) => ({
        questionVersionId: ans.questionId,
        selectedOptionVersionIds: [ans.value],
        isApplicable: true,
        status: "DRAFT",
      }));

      console.log("answersArray", answersArray);
      

      if (answersArray.length > 0) {
        (dispatch as any)(
          saveAssessmentDraft({
            assessmentId: framework?.id || "550e8400-e29b-41d4-a716-446655440000",
            answers: answersArray,
            onSuccess: () => {
              console.log("Draft saved successfully");
            },
            onError: (err: any) => {
              console.error("Failed to save draft:", err);
            },
          }),
        );
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [dispatch, answers, framework?.id]);


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
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1.5">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {metadata?.name || "Assessment"}
              </h1>
              <p className="text-slate-500 font-medium text-base max-w-2xl">
                {metadata?.description ||
                  "Information Security Management System standard"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900 transition-all px-6"
            >
              Exit
            </Button>
          </div>

          {/* Step Navigation Bar */}
          {metadata && metadata.totalSteps > 0 && (
            <div className="group px-1">
              <div className="flex gap-2.5">
                {Array.from(
                  { length: metadata.totalSteps },
                  (_, i) => i + 1,
                ).map((step) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(step)}
                    className={`flex-1 h-3 rounded-full transition-all duration-500 relative ${
                      currentStep === step
                        ? "bg-slate-900"
                        : currentStep > step
                          ? "bg-slate-400"
                          : "bg-slate-200 hover:bg-slate-300"
                    }`}
                    title={`Step ${step}`}
                  >
                    {currentStep === step && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute inset-0 bg-white/20 rounded-full"
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
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="size-10 animate-spin text-slate-400" />
            <p className="text-slate-400 font-medium">Fetching step data...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 rounded-[2.5rem]">
            <p className="text-slate-400 italic">
              No questions available for this step.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-10"
              >
                {questions.map((question) => (
                  <Card
                    key={question.id}
                    className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2.5rem] overflow-hidden"
                  >
                    <CardContent className="p-10 md:p-5 space-y-6">
                      <div className="flex gap-6 items-start">
                        <div className="flex-shrink-0 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg font-bold text-[10px] uppercase tracking-wider border border-slate-200/50">
                          {question.controlReference}
                        </div>
                        <Label className="text-md font-bold text-slate-900 leading-[1.2] flex-1">
                          {question.questionText}
                        </Label>
                      </div>

                      <div className="relative">
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
                          className="flex flex-row gap-0.5 bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200/50"
                        >
                          {question.options.map((option) => (
                            <div
                              key={option.id}
                              className={`flex-1 relative group cursor-pointer`}
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
                              <div
                                className={`flex flex-col items-center justify-center py-6 px-4 rounded-[1.5rem] transition-all duration-300 relative z-10 ${
                                  answers[question.id]?.value === option.id
                                    ? "text-white"
                                    : "text-slate-500 hover:text-slate-900"
                                }`}
                              >
                                {answers[question.id]?.value === option.id && (
                                  <motion.div
                                    layoutId={`active-option-${question.id}`}
                                    className="absolute inset-0 bg-slate-900 rounded-[1.5rem] shadow-xl shadow-slate-200"
                                    transition={{
                                      type: "spring",
                                      bounce: 0.2,
                                      duration: 0.6,
                                    }}
                                  />
                                )}
                                <span className="relative z-20 text-sm font-bold tracking-tight">
                                  {option.optionText}
                                </span>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-16 px-4 pb-16">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="gap-3 text-slate-400 hover:text-slate-900 transition-all py-8 px-10 rounded-2xl hover:bg-slate-100 font-bold text-lg"
              >
                <ArrowLeft className="size-6" />
                <span>Previous Step</span>
              </Button>

              <Button
                onClick={handleNext}
                className="gap-4 py-8 px-14 rounded-3xl shadow-2xl shadow-slate-200 bg-slate-900 hover:bg-slate-800 transition-all active:scale-[0.98] text-lg font-bold"
              >
                <span>
                  {currentStep === metadata?.totalSteps
                    ? "Complete Assessment"
                    : "Next Step"}
                </span>
                <ArrowRight className="size-6" />
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
