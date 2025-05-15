"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Shuffle, RotateCcw, Home } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Deck, Flashcard } from "@/lib/types"
import { loadDeck, loadCards } from "@/lib/storage"
import { cn } from "@/lib/utils"
import { DownloadButton } from "@/components/ui/download-button"

export default function StudyDeck({ params }: { params: { deckId: string } }) {
  const { deckId } = params
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadedDeck = loadDeck(deckId)
    if (!loadedDeck) {
      toast({
        title: "Deck not found",
        description: "The requested deck could not be found.",
        variant: "destructive",
      })
      router.push("/flashcards")
      return
    }

    setDeck(loadedDeck)
    const loadedCards = loadCards(deckId)

    if (loadedCards.length === 0) {
      toast({
        title: "Empty deck",
        description: "This deck doesn't have any cards to study.",
        variant: "destructive",
      })
      router.push("/flashcards")
      return
    }

    setCards(loadedCards)
  }, [deckId, router, toast])

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setIsShuffled(true)

    toast({
      title: "Cards shuffled",
      description: "The order of cards has been randomized.",
    })
  }

  const resetCards = () => {
    if (isShuffled) {
      const loadedCards = loadCards(deckId)
      setCards(loadedCards)
      setIsShuffled(false)
    }

    setCurrentCardIndex(0)
    setIsFlipped(false)

    toast({
      title: "Study session reset",
      description: "Starting from the first card again.",
    })
  }

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      toast({
        title: "End of deck",
        description: "You've reached the last card in this deck.",
      })
    }
  }

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    } else {
      toast({
        title: "Start of deck",
        description: "You're already at the first card in this deck.",
      })
    }
  }

  if (!deck || cards.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/flashcards")} className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-2xl font-bold">{deck.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {cards.length}
          </div>

          <DownloadButton
            data={cards}
            filename={`${deck.title.toLowerCase().replace(/\s+/g, "-")}-flashcards`}
            formats={["json", "csv"]}
            variant="outline"
            size="sm"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-8">
        <div
          className="w-full max-w-2xl h-64 md:h-80 perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={cn(
              "relative w-full h-full transition-transform duration-500 transform-style-3d",
              isFlipped ? "rotate-y-180" : "",
            )}
          >
            <Card className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 text-center text-lg">
              <div>{currentCard.front}</div>
            </Card>

            <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-8 text-center text-lg bg-muted">
              <div>{currentCard.back}</div>
            </Card>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">Click the card to flip it</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={goToPrevCard}
          disabled={currentCardIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Previous
        </Button>

        <Button
          onClick={goToNextCard}
          disabled={currentCardIndex === cards.length - 1}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={shuffleCards} className="flex items-center gap-2">
          <Shuffle size={16} />
          Shuffle
        </Button>

        <Button variant="outline" onClick={resetCards} className="flex items-center gap-2">
          <RotateCcw size={16} />
          Reset
        </Button>

        <Button variant="outline" onClick={() => router.push("/flashcards")} className="flex items-center gap-2">
          <Home size={16} />
          Home
        </Button>
      </div>
    </div>
  )
}
