"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { DownloadButton } from "@/components/ui/download-button"
import { BookOpen, CheckCircle, Clock, FileText, Plus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Sample quiz data
const sampleQuizzes = [
  {
    id: "quiz-1",
    title: "Psychology Fundamentals",
    description: "Test your knowledge of basic psychological concepts",
    questionCount: 15,
    timeEstimate: "15 min",
    lastAttempt: "2 days ago",
    score: 85,
  },
  {
    id: "quiz-2",
    title: "Learning Theories",
    description: "Questions about classical and operant conditioning",
    questionCount: 10,
    timeEstimate: "10 min",
    lastAttempt: "1 week ago",
    score: 70,
  },
  {
    id: "quiz-3",
    title: "Cognitive Psychology",
    description: "Memory, attention, and perception concepts",
    questionCount: 20,
    timeEstimate: "20 min",
    lastAttempt: null,
    score: null,
  },
]

export default function QuizzesPage() {
  const [activeTab, setActiveTab] = useState("my-quizzes")
  const { toast } = useToast()

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      toast({
        title: "Quiz imported",
        description: `Successfully imported quiz from ${files[0].name}`,
      })
    }
  }

  const handleCreateQuiz = () => {
    toast({
      title: "Create quiz",
      description: "This feature is coming soon. Please check back later.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <div className="flex gap-2">
          <FileUpload buttonText="Import Quiz" variant="outline" onUploadComplete={handleFileUpload} />
          <Button className="flex items-center gap-2" onClick={handleCreateQuiz}>
            <Plus size={18} />
            Create Quiz
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-quizzes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
          <TabsTrigger value="generated">Generated Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="my-quizzes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleQuizzes.map((quiz) => (
              <Card key={quiz.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{quiz.questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeEstimate}</span>
                    </div>
                  </div>

                  {quiz.lastAttempt && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last attempt: {quiz.lastAttempt}</span>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{quiz.score}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href={`/quizzes/${quiz.id}`}>
                    <Button>Take Quiz</Button>
                  </Link>
                  <DownloadButton
                    data={quiz}
                    filename={`quiz-${quiz.title.toLowerCase().replace(/\s+/g, "-")}`}
                    formats={["json", "pdf"]}
                    variant="outline"
                    size="sm"
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <div className="text-center py-12 bg-muted rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No generated quizzes yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upload a document to automatically generate quizzes based on its content.
            </p>
            <FileUpload
              buttonText="Upload Document"
              variant="default"
              onUploadComplete={(files) => {
                if (files.length > 0) {
                  toast({
                    title: "Document uploaded",
                    description: "Generating quizzes from your document...",
                  })

                  // In a real app, we would process the document here
                  setTimeout(() => {
                    toast({
                      title: "Quizzes generated",
                      description: "Successfully created 3 quizzes from your document.",
                    })
                    setActiveTab("my-quizzes")
                  }, 2000)
                }
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
