import type { Deck, Flashcard } from "./types"

// Local storage keys
const DECKS_KEY = "flashcards-decks"
const getCardsKey = (deckId: string) => `flashcards-cards-${deckId}`

// Load all decks from localStorage
export function loadDecks(): Deck[] {
  if (typeof window === "undefined") return []

  const decksJson = localStorage.getItem(DECKS_KEY)
  if (!decksJson) return []

  try {
    return JSON.parse(decksJson)
  } catch (error) {
    console.error("Failed to parse decks from localStorage:", error)
    return []
  }
}

// Load a specific deck by ID
export function loadDeck(deckId: string): Deck | null {
  const decks = loadDecks()
  return decks.find((deck) => deck.id === deckId) || null
}

// Create a new deck and save it to localStorage
export function createDeck(title: string, cardCount = 0): string {
  const decks = loadDecks()

  const newDeck: Deck = {
    id: crypto.randomUUID(),
    title,
    cardCount,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  localStorage.setItem(DECKS_KEY, JSON.stringify([...decks, newDeck]))

  // Trigger storage event for other tabs
  window.dispatchEvent(new Event("storage"))

  return newDeck.id
}

// Save an existing deck to localStorage
export function saveDeck(deck: Deck): void {
  const decks = loadDecks()
  const index = decks.findIndex((d) => d.id === deck.id)

  if (index !== -1) {
    decks[index] = deck
  } else {
    decks.push(deck)
  }

  localStorage.setItem(DECKS_KEY, JSON.stringify(decks))

  // Trigger storage event for other tabs
  window.dispatchEvent(new Event("storage"))
}

// Delete a deck from localStorage
export function deleteDeck(deckId: string): void {
  const decks = loadDecks()
  const updatedDecks = decks.filter((deck) => deck.id !== deckId)

  localStorage.setItem(DECKS_KEY, JSON.stringify(updatedDecks))
  localStorage.removeItem(getCardsKey(deckId))

  // Trigger storage event for other tabs
  window.dispatchEvent(new Event("storage"))
}

// Load cards for a specific deck
export function loadCards(deckId: string): Flashcard[] {
  if (typeof window === "undefined") return []

  const cardsJson = localStorage.getItem(getCardsKey(deckId))
  if (!cardsJson) return []

  try {
    return JSON.parse(cardsJson)
  } catch (error) {
    console.error("Failed to parse cards from localStorage:", error)
    return []
  }
}

// Save cards for a specific deck
export function saveCards(deckId: string, cards: Flashcard[]): void {
  localStorage.setItem(getCardsKey(deckId), JSON.stringify(cards))

  // Update the card count in the deck
  const deck = loadDeck(deckId)
  if (deck) {
    saveDeck({
      ...deck,
      cardCount: cards.length,
      updatedAt: new Date().toISOString(),
    })
  }

  // Trigger storage event for other tabs
  window.dispatchEvent(new Event("storage"))
}
