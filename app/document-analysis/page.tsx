"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { DownloadButton } from "@/components/ui/download-button"
import { FileText, BookOpen, Lightbulb, MessageSquare, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function DocumentAnalysisPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0])
    }
  }

  const handleProcessDocument = () => {
    if (!uploadedFile) return

    setIsProcessing(true)

    // Simulate document processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsProcessed(true)

      toast({
        title: "Document processed",
        description: `Successfully analyzed ${uploadedFile.name}`,
      })
    }, 2000)
  }

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  // Sample generated data
  const sampleData = {
    flashcards: [
      {
        front: "What is Classical Conditioning?",
        back: "A learning process that occurs through associations between environmental stimuli and naturally occurring stimuli.",
      },
      { front: "Who developed Operant Conditioning?", back: "B.F. Skinner" },
      {
        front: "What is Cognitive Dissonance?",
        back: "The mental discomfort that results from holding two conflicting beliefs, values, or attitudes.",
      },
    ],
    concepts: [
      { title: "Classical Conditioning", description: "A learning process discovered by Ivan Pavlov..." },
      { title: "Operant Conditioning", description: "A method of learning that employs rewards and punishments..." },
      { title: "Cognitive Dissonance", description: "The mental discomfort experienced when beliefs conflict..." },
    ],
    summary:
      "This document covers key psychological concepts including classical conditioning, operant conditioning, and cognitive dissonance...",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Document Analysis</h1>
      <p className="text-muted-foreground mb-8">Upload and analyze documents to generate study materials</p>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="upload">Upload & Process</TabsTrigger>
          <TabsTrigger value="results" disabled={!isProcessed}>
            Results & Downloads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload a document to analyze and generate study materials</CardDescription>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div className="flex justify-center">
                  <FileUpload
                    buttonText="Select Document"
                    variant="outline"
                    size="lg"
                    onUploadComplete={handleUploadComplete}
                    acceptedFileTypes=".pdf,.docx,.txt,.md"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type || "Unknown type"}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setUploadedFile(null)} disabled={isProcessing}>
                      Change
                    </Button>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">What we'll generate:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span>Flashcards for key concepts and facts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <span>Concept map with relationships</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>Document summary and key points</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleProcessDocument}
                disabled={!uploadedFile || isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? "Processing..." : "Process Document"}
                {!isProcessing && <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Flashcards
                </CardTitle>
                <CardDescription>{sampleData.flashcards.length} flashcards generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleData.flashcards.slice(0, 2).map((card, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <p className="font-medium text-sm">{card.front}</p>
                      <p className="text-xs text-muted-foreground mt-1">{card.back.substring(0, 60)}...</p>
                    </div>
                  ))}
                  {sampleData.flashcards.length > 2 && (
                    <p className="text-xs text-center text-muted-foreground">
                      +{sampleData.flashcards.length - 2} more flashcards
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleNavigate("/flashcards")}>
                  View All
                </Button>
                <DownloadButton data={sampleData.flashcards} filename="flashcards" formats={["json", "csv"]} />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Concepts
                </CardTitle>
                <CardDescription>{sampleData.concepts.length} key concepts identified</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleData.concepts.slice(0, 2).map((concept, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <p className="font-medium text-sm">{concept.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{concept.description.substring(0, 60)}...</p>
                    </div>
                  ))}
                  {sampleData.concepts.length > 2 && (
                    <p className="text-xs text-center text-muted-foreground">
                      +{sampleData.concepts.length - 2} more concepts
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleNavigate("/concepts")}>
                  Explore
                </Button>
                <DownloadButton data={sampleData.concepts} filename="concepts" formats={["json", "txt"]} />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Summary
                </CardTitle>
                <CardDescription>Document overview and key points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">{sampleData.summary.substring(0, 150)}...</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleNavigate("/chat")}>
                  Ask Questions
                </Button>
                <DownloadButton data={sampleData.summary} filename="document-summary" formats={["txt", "pdf"]} />
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What would you like to do next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => handleNavigate("/flashcards")}
                >
                  <BookOpen className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Study Flashcards</p>
                    <p className="text-xs text-muted-foreground">Review generated flashcards</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => handleNavigate("/concepts")}
                >
                  <Lightbulb className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Explore Concepts</p>
                    <p className="text-xs text-muted-foreground">Visualize concept relationships</p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => handleNavigate("/chat")}
                >
                  <MessageSquare className="h-6 w-6" />
                  <div className="text-center">
                    <p className="font-medium">Ask Questions</p>
                    <p className="text-xs text-muted-foreground">Chat with AI about the document</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
