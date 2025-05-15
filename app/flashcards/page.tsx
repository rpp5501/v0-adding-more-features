import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import DeckList from "@/components/deck-list"
import { FileUpload } from "@/components/ui/file-upload"

export default function FlashcardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Flashcard Decks</h1>
        <div className="flex gap-2">
          <FileUpload
            buttonText="Import from Document"
            variant="outline"
            onUploadComplete={(files) => {
              console.log("Uploaded files:", files)
              // In a real app, we would process the files here
            }}
          />
          <Link href="/create-deck">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              Create Deck
            </Button>
          </Link>
        </div>
      </div>

      <DeckList />
    </div>
  )
}
