"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RefreshCw, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample data structure for the mind map
const mindMapData = {
  id: "root",
  name: "Psychology",
  children: [
    {
      id: "learning",
      name: "Learning Theories",
      children: [
        { id: "classical", name: "Classical Conditioning" },
        { id: "operant", name: "Operant Conditioning" },
        { id: "social", name: "Social Learning" },
      ],
    },
    {
      id: "cognitive",
      name: "Cognitive Psychology",
      children: [
        {
          id: "memory",
          name: "Memory",
          children: [
            { id: "working", name: "Working Memory" },
            { id: "long-term", name: "Long-term Memory" },
          ],
        },
        { id: "attention", name: "Attention" },
        { id: "perception", name: "Perception" },
      ],
    },
    {
      id: "social",
      name: "Social Psychology",
      children: [
        { id: "dissonance", name: "Cognitive Dissonance" },
        { id: "attribution", name: "Attribution Theory" },
        { id: "conformity", name: "Conformity" },
      ],
    },
    {
      id: "personality",
      name: "Personality Psychology",
      children: [
        { id: "traits", name: "Trait Theory" },
        { id: "maslow", name: "Maslow's Hierarchy" },
        { id: "psychoanalytic", name: "Psychoanalytic Theory" },
      ],
    },
  ],
}

export default function MindMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const { toast } = useToast()

  // Colors for different levels
  const colors = [
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#f97316", // orange-500
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and offset
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(zoom, zoom)

    // Draw mind map
    const centerX = canvas.width / 2 / zoom
    const centerY = canvas.height / 2 / zoom
    drawNode(ctx, mindMapData, centerX, centerY, 0, 2 * Math.PI, 0, 200)

    ctx.restore()
  }, [zoom, offset])

  // Function to draw a node and its children
  const drawNode = (
    ctx: CanvasRenderingContext2D,
    node: any,
    x: number,
    y: number,
    startAngle: number,
    endAngle: number,
    level: number,
    radius: number,
  ) => {
    // Draw the current node
    ctx.beginPath()
    ctx.arc(x, y, 30, 0, 2 * Math.PI)
    ctx.fillStyle = colors[level % colors.length]
    ctx.fill()
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw node text
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(node.name, x, y)

    // If no children, return
    if (!node.children || node.children.length === 0) return

    // Calculate angles for children
    const angleStep = (endAngle - startAngle) / node.children.length
    let currentAngle = startAngle

    // Draw children
    node.children.forEach((child: any) => {
      const childAngle = currentAngle + angleStep / 2
      const childX = x + radius * Math.cos(childAngle)
      const childY = y + radius * Math.sin(childAngle)

      // Draw line to child
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(childX, childY)
      ctx.strokeStyle = colors[level % colors.length]
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw child node
      drawNode(ctx, child, childX, childY, childAngle - Math.PI / 2, childAngle + Math.PI / 2, level + 1, radius * 0.8)

      currentAngle += angleStep
    })
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return

    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y

    setOffset({
      x: offset.x + dx,
      y: offset.y + dy,
    })

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      // In a real implementation, we would use the canvas.toDataURL() method
      // to get a data URL for the image and then create a download link

      toast({
        title: "Download started",
        description: "Your mind map image is being prepared for download.",
      })

      // Simulate download delay
      setTimeout(() => {
        toast({
          title: "Download complete",
          description: "Mind map has been downloaded as PNG.",
        })
      }, 1000)
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the mind map.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative w-full h-[600px] bg-muted/20 rounded-lg overflow-hidden">
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">Drag to pan, use buttons to zoom</div>
    </div>
  )
}
