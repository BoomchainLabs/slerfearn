import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Coins, Timer, Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DAILY_TRIVIA_QUESTIONS, WEEKLY_TRIVIA_CHALLENGES, type TriviaQuestion } from "@shared/trivia-questions";
import { LERF_TOKEN_CONFIG } from "@shared/token-config";

interface TriviaSession {
  id: string;
  questions: TriviaQuestion[];
  currentQuestion: number;
  answers: number[];
  score: number;
  timeRemaining: number;
  completed: boolean;
}

export default function Trivia() {
  const [currentSession, setCurrentSession] = useState<TriviaSession | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const queryClient = useQueryClient();

  // Get user's trivia stats
  const { data: triviaStats } = useQuery({
    queryKey: ["/api/trivia/stats"],
    retry: false,
  });

  // Start daily trivia
  const startDailyTrivia = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/trivia/daily/start", "POST");
    },
    onSuccess: (data) => {
      const questions = DAILY_TRIVIA_QUESTIONS.slice(0, 3);
      setCurrentSession({
        id: data.sessionId,
        questions,
        currentQuestion: 0,
        answers: [],
        score: 0,
        timeRemaining: 300, // 5 minutes
        completed: false
      });
    },
  });

  // Submit trivia answer
  const submitAnswer = useMutation({
    mutationFn: async ({ sessionId, questionId, answer }: { sessionId: string; questionId: string; answer: number }) => {
      return apiRequest("/api/trivia/answer", "POST", { sessionId, questionId, answer });
    },
    onSuccess: () => {
      if (currentSession) {
        const newAnswers = [...currentSession.answers, selectedAnswer!];
        const currentQ = currentSession.questions[currentSession.currentQuestion];
        const isCorrect = selectedAnswer === currentQ.correctAnswer;
        
        if (currentSession.currentQuestion < currentSession.questions.length - 1) {
          setCurrentSession({
            ...currentSession,
            currentQuestion: currentSession.currentQuestion + 1,
            answers: newAnswers,
            score: currentSession.score + (isCorrect ? currentQ.reward : 0)
          });
          setSelectedAnswer(null);
          setShowResult(false);
        } else {
          // Complete session
          completeTriviaSession.mutate({
            sessionId: currentSession.id,
            answers: newAnswers,
            score: currentSession.score + (isCorrect ? currentQ.reward : 0)
          });
        }
      }
    },
  });

  // Complete trivia session
  const completeTriviaSession = useMutation({
    mutationFn: async ({ sessionId, answers, score }: { sessionId: string; answers: number[]; score: number }) => {
      return apiRequest("/api/trivia/complete", "POST", { sessionId, answers, score });
    },
    onSuccess: (data) => {
      if (currentSession) {
        setCurrentSession({
          ...currentSession,
          completed: true,
          score: data.totalReward
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/trivia/stats"] });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (currentSession && !currentSession.completed && currentSession.timeRemaining > 0) {
      const timer = setInterval(() => {
        setCurrentSession(prev => 
          prev ? { ...prev, timeRemaining: prev.timeRemaining - 1 } : null
        );
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentSession]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentSession && selectedAnswer !== null) {
      submitAnswer.mutate({
        sessionId: currentSession.id,
        questionId: currentSession.questions[currentSession.currentQuestion].id,
        answer: selectedAnswer
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTokenAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return amount.toString();
  };

  if (currentSession?.completed) {
    const correctAnswers = currentSession.answers.filter((answer, index) => 
      answer === currentSession.questions[index].correctAnswer
    ).length;

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Trivia Complete!</CardTitle>
            <CardDescription>You earned {formatTokenAmount(currentSession.score)} $LERF tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{currentSession.questions.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{formatTokenAmount(currentSession.score)}</div>
                <div className="text-sm text-muted-foreground">$LERF Earned</div>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentSession(null)} 
              className="w-full"
            >
              Play Again Tomorrow
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentSession) {
    const question = currentSession.questions[currentSession.currentQuestion];
    const progress = ((currentSession.currentQuestion + 1) / currentSession.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Question {currentSession.currentQuestion + 1} of {currentSession.questions.length}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4" />
                {formatTime(currentSession.timeRemaining)}
              </div>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Badge className="mb-3" variant="secondary">
                {question.category.toUpperCase()} • {question.difficulty} • {formatTokenAmount(question.reward)} $LERF
              </Badge>
              <h3 className="text-lg font-semibold">{question.question}</h3>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-4 ${
                    showResult && index === question.correctAnswer
                      ? "bg-green-500/20 border-green-500"
                      : showResult && selectedAnswer === index && index !== question.correctAnswer
                      ? "bg-red-500/20 border-red-500"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <span className="mr-3 font-mono">{String.fromCharCode(65 + index)}</span>
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="space-y-4">
                {question.explanation && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{question.explanation}</p>
                  </div>
                )}
                <Button onClick={handleNextQuestion} className="w-full">
                  {currentSession.currentQuestion < currentSession.questions.length - 1 ? "Next Question" : "Complete Trivia"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Daily Trivia Challenge</h1>
        <p className="text-muted-foreground">
          Test your knowledge and earn {LERF_TOKEN_CONFIG.symbol} tokens! Answer questions about crypto, DeFi, and blockchain.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Daily Trivia
            </CardTitle>
            <CardDescription>
              Answer 3 random questions to earn up to 2.5M $LERF tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Reward Range:</span>
                <span className="font-semibold">500K - 2.5M $LERF</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Time Limit:</span>
                <span className="font-semibold">5 minutes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Perfect Score Bonus:</span>
                <span className="font-semibold">+2M $LERF</span>
              </div>
              <Button 
                onClick={() => startDailyTrivia.mutate()}
                disabled={startDailyTrivia.isPending}
                className="w-full"
              >
                Start Daily Trivia
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Weekly Challenge
            </CardTitle>
            <CardDescription>
              Advanced questions with higher rewards - coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Reward Range:</span>
                <span className="font-semibold">2M - 5M $LERF</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Questions:</span>
                <span className="font-semibold">5 advanced</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Resets:</span>
                <span className="font-semibold">Every Monday</span>
              </div>
              <Button disabled className="w-full">
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {triviaStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Your Trivia Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{triviaStats.totalCorrect}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{triviaStats.totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {((triviaStats.totalCorrect / triviaStats.totalQuestions) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {formatTokenAmount(triviaStats.totalEarned)}
                </div>
                <div className="text-sm text-muted-foreground">$LERF Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}