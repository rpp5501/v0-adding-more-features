"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import ConceptsList from "@/components/concepts/concepts-list"
import MindMap from "@/components/concepts/mind-map"
import Summary from "@/components/concepts/summary"
import { FileUpload } from "@/components/ui/file-upload"
import { DownloadButton } from "@/components/ui/download-button"
import { useToast } from "@/hooks/use-toast"

export default function ConceptsPage() {
  const [activeTab, setActiveTab] = useState("concepts")
  const [searchQuery, setSearchQuery] = useState("")
  const [documentTitle, setDocumentTitle] = useState("Introduction to Psychology")
  const { toast } = useToast()

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setDocumentTitle(files[0].name.replace(/\.[^/.]+$/, ""))
      toast({
        title: "Document uploaded",
        description: `Analyzing ${files[0].name}...`,
      })

      // In a real app, we would process the document here
      setTimeout(() => {
        toast({
          title: "Analysis complete",
          description: "Document has been processed and concepts extracted.",
        })
      }, 2000)
    }
  }

  const handleNewDocument = () => {
    toast({
      title: "New document",
      description: "This feature is coming soon. Please check back later.",
    })
  }

  // Sample data for download
  const conceptsData = {
    title: documentTitle,
    concepts: [
      {
        title: "Classical Conditioning",
        description:
          "A learning process that occurs through associations between environmental stimuli and naturally occurring stimuli.",
        details: "Classical conditioning is a learning process first discovered by Ivan Pavlov...",
        examples: ["Pavlov's dogs experiment", "Fear of dentists after painful experiences"],
        relatedConcepts: ["Operant Conditioning", "Behaviorism", "Extinction"],
      },
      {
        title: "Operant Conditioning",
        description: "A method of learning that employs rewards and punishments for behavior.",
        details: "Operant conditioning, developed by B.F. Skinner...",
        examples: ["Training pets with treats", "Token economy systems in classrooms"],
        relatedConcepts: ["Classical Conditioning", "Reinforcement Schedules", "Behaviorism"],
      },
      // More concepts would be here
    ],
    relationships: [
      { source: "Classical Conditioning", target: "Operant Conditioning", type: "related" },
      { source: "Classical Conditioning", target: "Behaviorism", type: "parent" },
      // More relationships would be here
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{documentTitle}</h1>
          <p className="text-muted-foreground">Explore concepts, visualize connections, and understand key ideas</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search concepts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <FileUpload
            variant="outline"
            size="icon"
            showIcon={false}
            buttonText={<Plus className="h-4 w-4" />}
            onUploadComplete={handleFileUpload}
          />
          <DownloadButton
            data={conceptsData}
            filename={documentTitle.toLowerCase().replace(/\s+/g, "-")}
            formats={["json", "pdf"]}
            variant="outline"
            size="icon"
          />
        </div>
      </div>

      <Tabs defaultValue="concepts" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
          <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="concepts" className="mt-0">
          <ConceptsList searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="mindmap" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mind Map</CardTitle>
                <CardDescription>Visual representation of concepts and their relationships</CardDescription>
              </div>
              <DownloadButton
                data={conceptsData}
                filename="mind-map"
                formats={["png", "pdf"]}
                variant="outline"
                size="sm"
              />
            </CardHeader>
            <CardContent>
              <MindMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Document Summary</CardTitle>
                <CardDescription>AI-generated overview of key themes and conclusions</CardDescription>
              </div>
              <DownloadButton
                data={"# Introduction to Psychology\n\nPsychology is the scientific study of the mind and behavior..."}
                filename="document-summary"
                formats={["txt", "pdf"]}
                variant="outline"
                size="sm"
              />
            </CardHeader>
            <CardContent>
              <Summary />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
