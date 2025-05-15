"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/ui/file-upload"
import { DownloadButton } from "@/components/ui/download-button"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [documentContext, setDocumentContext] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const topic = searchParams.get("topic")
  const { toast } = useToast()

  useEffect(() => {
    // If a topic is provided, add an initial message
    if (topic) {
      const initialMessages: Message[] = [
        {
          id: "welcome",
          role: "assistant",
          content: `Hello! I'm your StuddyBuddy AI assistant. How can I help you understand ${topic}?`,
          timestamp: new Date(),
        },
      ]
      setMessages(initialMessages)
      setInput(`Explain ${topic} in simple terms`)
    } else {
      const initialMessages: Message[] = [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your StuddyBuddy AI assistant. Ask me anything about your studies, or upload a document to chat about its contents.",
          timestamp: new Date(),
        },
      ]
      setMessages(initialMessages)
    }
  }, [topic])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let responseContent = ""

      // Generate different responses based on the query
      if (input.toLowerCase().includes("classical conditioning")) {
        responseContent =
          "Classical conditioning is a learning process discovered by Ivan Pavlov where a neutral stimulus becomes associated with a meaningful stimulus and eventually triggers a similar response. The classic example is Pavlov's dogs, who learned to salivate at the sound of a bell that had been paired with food. This type of learning is fundamental to many human behaviors and emotional responses."
      } else if (input.toLowerCase().includes("operant conditioning")) {
        responseContent =
          "Operant conditioning, developed by B.F. Skinner, is a method of learning where behaviors are modified through rewards and punishments. Unlike classical conditioning, which focuses on involuntary responses, operant conditioning deals with voluntary behaviors. For example, if a student is praised for good work (positive reinforcement), they're more likely to repeat that behavior in the future."
      } else if (input.toLowerCase().includes("cognitive dissonance")) {
        responseContent =
          "Cognitive dissonance is the mental discomfort that occurs when a person holds contradictory beliefs or when new information conflicts with existing beliefs. To reduce this discomfort, people often change their beliefs or rationalize their behaviors. For instance, someone who smokes despite knowing it's unhealthy might downplay the health risks or emphasize the stress-relief benefits to justify their habit."
      } else if (input.toLowerCase().includes("maslow")) {
        responseContent =
          "Maslow's Hierarchy of Needs is a motivational theory proposed by Abraham Maslow. It suggests that human needs form a hierarchy, with basic physiological needs at the bottom, followed by safety, love/belonging, esteem, and self-actualization at the top. According to this theory, people are motivated to fulfill basic needs before pursuing higher-level needs. This framework helps explain why certain needs take precedence over others in different situations."
      } else if (documentContext) {
        responseContent = `Based on the document you uploaded, I can tell you that psychology encompasses various theoretical approaches including behaviorism, cognitive psychology, and humanistic psychology. The document specifically mentions ${topic || "several key concepts"} which are fundamental to understanding human behavior and mental processes.`
      } else {
        responseContent =
          "That's an interesting question! In psychology, understanding concepts requires looking at both theoretical frameworks and empirical evidence. Would you like me to explain this concept in more detail, provide some examples, or relate it to other psychological theories?"
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0]

      // Add a system message about the uploaded document
      const systemMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `I've received your document "${file.name}". I'll analyze it and use its contents to help answer your questions.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, systemMessage])

      // In a real app, we would process the document here
      setDocumentContext(`Content from ${file.name}`)

      toast({
        title: "Document uploaded",
        description: "Your document has been processed and is ready for reference.",
      })
    }
  }

  const handleDownloadChat = () => {
    // Format the chat for download
    const chatText = messages
      .map((msg) => {
        const role = msg.role === "assistant" ? "StuddyBuddy AI" : "You"
        const time = msg.timestamp.toLocaleTimeString()
        return `[${time}] ${role}: ${msg.content}`
      })
      .join("\n\n")

    return chatText
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="h-[calc(100vh-8rem)]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            StuddyBuddy AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <FileUpload buttonText="Upload Document" variant="outline" size="sm" onUploadComplete={handleFileUpload} />
            <DownloadButton
              data={handleDownloadChat()}
              filename="chat-history"
              formats={["txt", "json"]}
              variant="outline"
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-5rem)]">
          <div className="flex-1 overflow-y-auto mb-4 pr-2">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-3",
                    message.role === "assistant" ? "bg-muted" : "bg-primary/10",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {message.role === "assistant" ? "StuddyBuddy AI" : "You"}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-3 rounded-lg p-3 bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">StuddyBuddy AI</div>
                    <div className="text-sm">Thinking...</div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="relative">
            <Input
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Suggested questions:</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "What is classical conditioning?",
                "Explain working memory",
                "How does cognitive dissonance work?",
                "Summarize Maslow's hierarchy of needs",
              ].map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 flex items-center gap-1"
                  onClick={() => {
                    setInput(question)
                  }}
                >
                  <Lightbulb className="h-3 w-3" />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
