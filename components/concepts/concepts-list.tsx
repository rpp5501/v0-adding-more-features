"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { DownloadButton } from "@/components/ui/download-button"

// Sample data - in a real app, this would come from an API or database
const sampleConcepts = [
  {
    id: "concept-1",
    title: "Classical Conditioning",
    description:
      "A learning process that occurs through associations between environmental stimuli and naturally occurring stimuli.",
    details:
      "Classical conditioning is a learning process first discovered by Ivan Pavlov. It involves creating an association between a neutral stimulus and a stimulus that naturally evokes a response. Through repeated pairings, the neutral stimulus alone can come to elicit the response. This form of learning plays a significant role in both human and animal behavior.",
    examples: [
      "Pavlov's dogs experiment",
      "Fear of dentists after painful experiences",
      "Marketing jingles associated with brands",
    ],
    relatedConcepts: ["Operant Conditioning", "Behaviorism", "Extinction"],
    category: "Learning Theories",
  },
  {
    id: "concept-2",
    title: "Operant Conditioning",
    description: "A method of learning that employs rewards and punishments for behavior.",
    details:
      "Operant conditioning, developed by B.F. Skinner, is a method of learning that occurs through rewards and punishments for behavior. Through operant conditioning, an association is made between a behavior and a consequence for that behavior. When a desirable result follows an action, the behavior becomes more likely to be repeated. Conversely, when an undesirable result follows an action, the behavior becomes less likely to be repeated.",
    examples: [
      "Training pets with treats",
      "Token economy systems in classrooms",
      "Positive reinforcement in workplace",
    ],
    relatedConcepts: ["Classical Conditioning", "Reinforcement Schedules", "Behaviorism"],
    category: "Learning Theories",
  },
  {
    id: "concept-3",
    title: "Cognitive Dissonance",
    description: "The mental discomfort that results from holding two conflicting beliefs, values, or attitudes.",
    details:
      "Cognitive dissonance, introduced by Leon Festinger, refers to the mental discomfort experienced when a person holds contradictory beliefs or ideas, or is confronted with new information that conflicts with existing beliefs. People tend to seek consistency in their cognitions and will often change their beliefs or behaviors to reduce this discomfort and restore balance.",
    examples: [
      "Justifying an expensive purchase that doesn't meet expectations",
      "Smokers who ignore health warnings",
      "Changing opinions to match group consensus",
    ],
    relatedConcepts: ["Confirmation Bias", "Self-Perception Theory", "Attitude Change"],
    category: "Social Psychology",
  },
  {
    id: "concept-4",
    title: "Working Memory",
    description: "A cognitive system responsible for temporarily holding and manipulating information.",
    details:
      "Working memory is a cognitive system that allows for temporary storage and manipulation of information necessary for complex cognitive tasks such as language comprehension, learning, and reasoning. The model of working memory was proposed by Alan Baddeley and Graham Hitch, who argued that it consists of multiple components: the phonological loop, the visuospatial sketchpad, the central executive, and the episodic buffer.",
    examples: [
      "Remembering a phone number long enough to dial it",
      "Mental arithmetic",
      "Following multi-step instructions",
    ],
    relatedConcepts: ["Short-term Memory", "Long-term Memory", "Attention"],
    category: "Cognitive Psychology",
  },
  {
    id: "concept-5",
    title: "Maslow's Hierarchy of Needs",
    description: "A motivational theory in psychology comprising a five-tier model of human needs.",
    details:
      "Maslow's Hierarchy of Needs is a motivational theory in psychology proposed by Abraham Maslow. The hierarchy is often depicted as a pyramid, with the most basic needs at the bottom and the need for self-actualization at the top. According to Maslow, people are motivated to fulfill basic needs before moving on to more advanced needs. The five levels are: physiological needs, safety needs, love and belonging needs, esteem needs, and self-actualization.",
    examples: [
      "Basic survival needs like food and shelter",
      "Job security and financial stability",
      "Pursuing creative fulfillment",
    ],
    relatedConcepts: ["Self-Actualization", "Humanistic Psychology", "Motivation Theory"],
    category: "Personality Psychology",
  },
]

interface ConceptsListProps {
  searchQuery: string
}

export default function ConceptsList({ searchQuery }: ConceptsListProps) {
  const [expandedConcepts, setExpandedConcepts] = useState<string[]>([])
  const router = useRouter()

  const filteredConcepts = sampleConcepts.filter(
    (concept) =>
      concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concept.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAskAboutConcept = (conceptTitle: string) => {
    router.push(`/chat?topic=${encodeURIComponent(conceptTitle)}`)
  }

  return (
    <div className="space-y-6">
      {filteredConcepts.map((concept) => (
        <Card key={concept.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{concept.title}</CardTitle>
                <CardDescription className="mt-1">{concept.description}</CardDescription>
              </div>
              <Badge variant="outline" className="ml-2">
                {concept.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger>Details</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-4">{concept.details}</p>

                  <h4 className="font-medium mb-2">Examples:</h4>
                  <ul className="list-disc pl-5 mb-4 text-sm text-muted-foreground">
                    {concept.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>

                  <h4 className="font-medium mb-2">Related Concepts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {concept.relatedConcepts.map((related, index) => (
                      <Badge key={index} variant="secondary">
                        {related}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 flex justify-end gap-2">
              <DownloadButton
                data={concept}
                filename={concept.title.toLowerCase().replace(/\s+/g, "-")}
                formats={["json", "txt"]}
                variant="outline"
                size="sm"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
                onClick={() => handleAskAboutConcept(concept.title)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask about this
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredConcepts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No concepts found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
