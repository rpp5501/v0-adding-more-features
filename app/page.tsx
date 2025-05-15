import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Lightbulb, MessageSquare, FileText, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  const features = [
    {
      title: "Flashcards",
      description: "Create and study flashcards with spaced repetition",
      icon: BookOpen,
      href: "/flashcards",
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Concept Explorer",
      description: "Visualize and explore concepts with mind maps",
      icon: Lightbulb,
      href: "/concepts",
      color: "bg-amber-100 dark:bg-amber-900",
      textColor: "text-amber-700 dark:text-amber-300",
    },
    {
      title: "Quizzes",
      description: "Test your knowledge with interactive quizzes",
      icon: ClipboardList,
      href: "/quiz",
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Document Analysis",
      description: "Generate study materials from documents",
      icon: FileText,
      href: "/document-analysis",
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "AI Chat",
      description: "Get answers from our AI learning assistant",
      icon: MessageSquare,
      href: "/chat",
      color: "bg-rose-100 dark:bg-rose-900",
      textColor: "text-rose-700 dark:text-rose-300",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">StuddyBuddy</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Your AI-powered learning companion for smarter studying
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className="block">
            <Card className="h-full hover:shadow-md transition-shadow border-2 hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-2", feature.color)}>
                  <feature.icon className={cn("h-5 w-5", feature.textColor)} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/flashcards">Get Started</Link>
        </Button>
      </div>
    </div>
  )
}
