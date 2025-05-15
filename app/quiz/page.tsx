"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/ui/file-upload"
import { DownloadButton } from "@/components/ui/download-button"

// Sample quiz data
const sampleQuiz = {
  title: "Psychology Fundamentals",
  questions: [
    {
      id: "q1",
      text: "Who is known for classical conditioning experiments with dogs?",
      options: [
        { id: "a", text: "B.F. Skinner" },
        { id: "b", text: "Ivan Pavlov" },
        { id: "c", text: "Sigmund Freud" },
        { id: "d", text: "Carl Jung" },
      ],
      correctAnswer: "b",
    },
    {
      id: "q2",
      text: "Which of the following is NOT a component of working memory according to Baddeley and Hitch?",
      options: [
        { id: "a", text: "Phonological loop" },
        { id: "b", text: "Visuospatial sketchpad" },
        { id: "c", text: "Semantic analyzer" },
        { id: "d", text: "Central executive" },
      ],
      correctAnswer: "c",
    },
    {
      id: "q3",
      text: "Cognitive dissonance refers to:",
      options: [
        { id: "a", text: "The inability to focus on multiple tasks" },
        { id: "b", text: "Mental discomfort from conflicting beliefs" },
        { id: "c", text: "A learning disability affecting cognition" },
        { id: "d", text: "The process of forgetting information" },
      ],
      correctAnswer: "b",
    },
    {
      id: "q4",
      text: "Which level is at the top of Maslow's Hierarchy of Needs?",
      options: [
        { id: "a", text: "Safety needs" },
        { id: "b", text: "Esteem needs" },
        { id: "c", text: "Self-actualization" },
        { id: "d", text: "Physiological needs" },
      ],
      correctAnswer: "c",
    },
    {
      id: "q5",
      text: "Operant conditioning involves learning through:",
      options: [
        { id: "a", text: "Association of stimuli" },
        { id: "b", text: "Rewards and punishments" },
        { id: "c", text: "Observation of others" },
        { id: "d", text: "Unconscious processes" },
      ],
      correctAnswer: "b",
    },
  ],
}

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const { toast } = useToast()

  const currentQuestion = sampleQuiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / sampleQuiz.questions.length) * 100

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: value,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Calculate score
      let correctAnswers = 0
      sampleQuiz.questions.forEach((question) => {
        if (selectedAnswers[question.id] === question.correctAnswer) {
          correctAnswers++
        }
      })

      const finalScore = Math.round((correctAnswers / sampleQuiz.questions.length) * 100)
      setScore(finalScore)
      setQuizCompleted(true)

      toast({
        title: "Quiz completed!",
        description: `Your score: ${finalScore}%`,
      })
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setScore(0)
  }

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      toast({
        title: "Quiz imported",
        description: "Custom quiz loaded successfully.",
      })
    }
  }

  // Prepare quiz results for download
  const quizResults = {
    title: sampleQuiz.title,
    totalQuestions: sampleQuiz.questions.length,
    score: score,
    answers: Object.entries(selectedAnswers).map(([questionId, answer]) => {
      const question = sampleQuiz.questions.find((q) => q.id === questionId)
      return {
        question: question?.text,
        selectedAnswer: question?.options.find((o) => o.id === answer)?.text,
        correctAnswer: question?.options.find((o) => o.id === question?.correctAnswer)?.text,
        isCorrect: answer === question?.correctAnswer,
      }
    }),
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{sampleQuiz.title}</h1>
        <div className="flex gap-2">
          <FileUpload buttonText="Import Quiz" variant="outline" size="sm" onUploadComplete={handleFileUpload} />
          {quizCompleted && (
            <DownloadButton
              data={quizResults}
              filename="quiz-results"
              formats={["json", "pdf"]}
              variant="outline"
              size="sm"
            />
          )}
        </div>
      </div>

      {!quizCompleted ? (
        <>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Question {currentQuestionIndex + 1} of {sampleQuiz.questions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedAnswers[currentQuestion.id] || ""} onValueChange={handleAnswerSelect}>
                <div className="space-y-4">
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNextQuestion} disabled={!selectedAnswers[currentQuestion.id]}>
                {currentQuestionIndex === sampleQuiz.questions.length - 1 ? "Finish" : "Next"}{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{score}%</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">
                You answered {sampleQuiz.questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length} out
                of {sampleQuiz.questions.length} questions correctly.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Question Summary:</h3>
              {sampleQuiz.questions.map((question, index) => {
                const isCorrect = selectedAnswers[question.id] === question.correctAnswer
                return (
                  <div
                    key={question.id}
                    className={cn(
                      "p-4 rounded-md",
                      isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "mt-0.5 rounded-full p-1",
                          isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                        )}
                      >
                        {isCorrect ? <CheckCircle className="h-4 w-4" /> : <span className="text-sm font-bold">✗</span>}
                      </div>
                      <div>
                        <p className="font-medium">Question {index + 1}:</p>
                        <p className="text-sm">{question.text}</p>
                        <div className="mt-2 text-sm">
                          <p
                            className={
                              isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            }
                          >
                            Your answer: {question.options.find((o) => o.id === selectedAnswers[question.id])?.text}
                          </p>
                          {!isCorrect && (
                            <p className="text-green-600 dark:text-green-400">
                              Correct answer: {question.options.find((o) => o.id === question.correctAnswer)?.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleRestartQuiz} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> Restart Quiz
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
