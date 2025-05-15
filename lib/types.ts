export interface Deck {
  id: string
  title: string
  cardCount: number
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  deckId: string
  front: string
  back: string
  createdAt: string
  updatedAt: string
}
