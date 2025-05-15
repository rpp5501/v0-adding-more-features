"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, File, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUploadComplete?: (files: File[]) => void
  buttonText?: string
  acceptedFileTypes?: string
  maxFiles?: number
  maxSizeMB?: number
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function FileUpload({
  onUploadComplete,
  buttonText = "Upload Document",
  acceptedFileTypes = ".pdf,.docx,.txt,.md",
  maxFiles = 1,
  maxSizeMB = 10,
  variant = "outline",
  size = "default",
  className = "",
  showIcon = true,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)

    // Check file count
    if (selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload ${maxFiles} file${maxFiles > 1 ? "s" : ""} at a time.`,
        variant: "destructive",
      })
      return
    }

    // Check file size
    const oversizedFiles = selectedFiles.filter((file) => file.size > maxSizeMB * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Some files exceed the ${maxSizeMB}MB limit.`,
        variant: "destructive",
      })
      return
    }

    setFiles(selectedFiles)
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setIsUploading(true)

    // Simulate upload progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setIsUploading(false)

        // Call the callback with the uploaded files
        if (onUploadComplete) {
          onUploadComplete(files)
        }

        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${files.length} file${files.length > 1 ? "s" : ""}.`,
        })

        setOpen(false)
        setFiles([])
        setProgress(0)
      }
    }, 100)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {showIcon && <Upload className="h-4 w-4 mr-2" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload a document to analyze and generate content from.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {files.length === 0 ? (
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Input
                id="file-upload"
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="hidden"
                multiple={maxFiles > 1}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">
                  {acceptedFileTypes.split(",").join(", ")} (max {maxSizeMB}MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {isUploading && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add more files
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
