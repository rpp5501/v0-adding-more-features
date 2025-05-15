"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, BookOpen, Edit } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Deck } from "@/lib/types"
import { loadDecks, deleteDeck } from "@/lib/storage"
import { DownloadButton } from "@/components/ui/download-button"

export default function DeckList() {
  const [decks, setDecks] = useState<Deck[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchDecks = () => {
      const loadedDecks = loadDecks()
      setDecks(loadedDecks)
    }

    fetchDecks()

    // Listen for storage changes from other tabs
    window.addEventListener("storage", fetchDecks)

    return () => {
      window.removeEventListener("storage", fetchDecks)
    }
  }, [])

  const handleDeleteDeck = (deckId: string) => {
    deleteDeck(deckId)
    setDecks(decks.filter((deck) => deck.id !== deckId))
    toast({
      title: "Deck deleted",
      description: "The deck has been permanently deleted.",
    })
  }

  if (decks.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">You don't have any flashcard decks yet</h2>
        <p className="text-muted-foreground mb-6">Create your first deck to get started!</p>
        <Link href="/create-deck">
          <Button>Create Your First Deck</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <Card key={deck.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-start">
              <span className="truncate">{deck.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {deck.cardCount} {deck.cardCount === 1 ? "card" : "cards"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between mt-auto">
            <div className="flex gap-2">
              <Link href={`/decks/${deck.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              </Link>
              <Link href={`/decks/${deck.id}/study`}>
                <Button size="sm">
                  <BookOpen size={16} className="mr-1" />
                  Study
                </Button>
              </Link>
            </div>

            <div className="flex gap-2">
              <DownloadButton
                data={{ deck }}
                filename={`deck-${deck.title.toLowerCase().replace(/\s+/g, "-")}`}
                formats={["json"]}
                variant="ghost"
                size="icon"
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Deck</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this deck? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteDeck(deck.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
