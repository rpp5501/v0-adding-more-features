"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, FileText, ImageIcon, FileJson } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DownloadButtonProps {
  data: any
  filename: string
  formats: Array<"pdf" | "png" | "json" | "txt" | "csv">
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function DownloadButton({
  data,
  filename,
  formats,
  variant = "outline",
  size = "default",
  className = "",
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = (format: string) => {
    setIsDownloading(true)

    // Simulate download process
    setTimeout(() => {
      try {
        let content = ""
        let mimeType = ""

        // Format the data based on the selected format
        switch (format) {
          case "json":
            content = JSON.stringify(data, null, 2)
            mimeType = "application/json"
            break
          case "txt":
            content = typeof data === "string" ? data : JSON.stringify(data, null, 2)
            mimeType = "text/plain"
            break
          case "csv":
            // Simple CSV conversion for array of objects
            if (Array.isArray(data) && data.length > 0) {
              const headers = Object.keys(data[0]).join(",")
              const rows = data.map((item) =>
                Object.values(item)
                  .map((val) => (typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val))
                  .join(","),
              )
              content = [headers, ...rows].join("\n")
            } else {
              content = "No data"
            }
            mimeType = "text/csv"
            break
          case "pdf":
          case "png":
            // For PDF and PNG, we would normally use libraries like jsPDF or html2canvas
            // Here we'll just show a toast message
            toast({
              title: `${format.toUpperCase()} download`,
              description: `${format.toUpperCase()} download would be implemented with a library in a real application.`,
            })
            setIsDownloading(false)
            return
        }

        // Create a download link
        const blob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Download complete",
          description: `Successfully downloaded ${filename}.${format}`,
        })
      } catch (error) {
        toast({
          title: "Download failed",
          description: "There was an error downloading the file.",
          variant: "destructive",
        })
      } finally {
        setIsDownloading(false)
      }
    }, 500)
  }

  const formatIcons = {
    pdf: <FileText className="h-4 w-4 mr-2" />,
    png: <ImageIcon className="h-4 w-4 mr-2" />,
    json: <FileJson className="h-4 w-4 mr-2" />,
    txt: <FileText className="h-4 w-4 mr-2" />,
    csv: <FileText className="h-4 w-4 mr-2" />,
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isDownloading}>
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Downloading..." : "Download"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.map((format) => (
          <DropdownMenuItem key={format} onClick={() => handleDownload(format)} className="cursor-pointer">
            {formatIcons[format]}
            {format.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
