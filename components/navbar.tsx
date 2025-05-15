"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { Brain, BookOpen, Lightbulb, MessageSquare, FileText, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/", icon: Brain },
    { name: "Flashcards", href: "/flashcards", icon: BookOpen },
    { name: "Concepts", href: "/concepts", icon: Lightbulb },
    { name: "Quizzes", href: "/quiz", icon: ClipboardList },
    { name: "Documents", href: "/document-analysis", icon: FileText },
    { name: "Chat", href: "/chat", icon: MessageSquare },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">StuddyBuddy</span>
        </Link>
        <div className="flex items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-1.5",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            )
          })}
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
