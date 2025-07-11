"use client"

import type React from "react"
import { useCallback, useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Type,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isEditorFocused, setIsEditorFocused] = useState(false)

  // Execute formatting commands
  const executeCommand = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current) return
      try {
        editorRef.current.focus()
        document.execCommand(command, false, value)
        // Get the updated HTML content and clean it
        const htmlContent = editorRef.current.innerHTML
        onChange(cleanHtml(htmlContent))
      } catch (error) {
        console.error("Error executing command:", error)
      }
    },
    [onChange],
  )

  // Clean HTML to ensure proper structure
  const cleanHtml = (html: string): string => {
    // Remove empty paragraphs and clean up formatting
    return (
      html
        .replace(/<p><br><\/p>/g, "<p></p>")
        .replace(/<p>\s*<\/p>/g, "")
        .replace(/<div><br><\/div>/g, "")
        .replace(/<div>\s*<\/div>/g, "")
        .replace(/<br\s*\/?>/g, "<br>")
        // Ensure proper paragraph structure
        .replace(/^(?!<[h1-6]|<p|<ul|<ol|<blockquote|<hr)/gm, "<p>$&</p>")
        .replace(/<\/p><p>/g, "</p>\n<p>")
    )
  }

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML
      onChange(cleanHtml(htmlContent))
    }
  }, [onChange])

  // Update editor content when prop changes
  useEffect(() => {
    if (editorRef.current && !isEditorFocused) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content
      }
    }
  }, [content, isEditorFocused])

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
  }, [])

  // Handle key events for better formatting
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle Enter key to ensure proper paragraph structure
      if (e.key === "Enter" && !e.shiftKey) {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const currentElement = range.commonAncestorContainer.parentElement

          // If we're in a heading, create a new paragraph
          if (currentElement && /^H[1-6]$/.test(currentElement.tagName)) {
            e.preventDefault()
            executeCommand("formatBlock", "p")
            executeCommand("insertHTML", "<br>")
          }
        }
      }
    },
    [executeCommand],
  )

  const toolbarButtons = [
    {
      icon: Type,
      label: "Normal Text",
      action: () => executeCommand("formatBlock", "p"),
    },
    {
      icon: Heading1,
      label: "Heading 1",
      action: () => executeCommand("formatBlock", "h1"),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      action: () => executeCommand("formatBlock", "h2"),
    },
    {
      icon: Heading3,
      label: "Heading 3",
      action: () => executeCommand("formatBlock", "h3"),
    },
    { type: "divider" },
    {
      icon: Bold,
      label: "Bold",
      action: () => executeCommand("bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => executeCommand("italic"),
    },
    { type: "divider" },
    {
      icon: List,
      label: "Bullet List",
      action: () => executeCommand("insertUnorderedList"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => executeCommand("insertOrderedList"),
    },
    { type: "divider" },
    {
      icon: Link,
      label: "Link",
      action: () => {
        const url = prompt("Enter URL:")
        if (url) executeCommand("createLink", url)
      },
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => executeCommand("formatBlock", "blockquote"),
    },
    {
      icon: Code,
      label: "Code",
      action: () => {
        const selection = window.getSelection()
        if (selection && selection.toString()) {
          executeCommand("insertHTML", `<code>${selection.toString()}</code>`)
        }
      },
    },
  ]

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            if (button.type === "divider") {
              return <div key={index} className="w-px h-5 bg-gray-300 mx-2" />
            }
            // const Icon = button.icon
            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title={button.label}
              >
                {/* <Icon className="w-4 h-4 text-gray-600" /> */}
              </button>
            )
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleContentChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          className="w-full min-h-96 p-6 focus:outline-none text-base leading-relaxed prose prose-lg max-w-none
            prose-headings:font-medium prose-headings:text-gray-900 prose-headings:leading-tight 
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline 
            prose-strong:font-medium prose-strong:text-gray-900 
            prose-ul:my-6 prose-ol:my-6 prose-li:my-2 
            prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600 
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
            [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl
            [&_hr]:my-8 [&_hr]:border-gray-200
            [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6"
        />

        {/* Placeholder */}
        {!content && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">Start writing your article...</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 border-t border-gray-200 p-3">
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => executeCommand("insertHTML", "<hr>")}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            Add divider
          </button>
          <button
            type="button"
            onClick={() => {
              const imageUrl = prompt("Enter image URL:")
              if (imageUrl) {
                executeCommand("insertHTML", `<p><img src="${imageUrl}" alt="Image"></p>`)
              }
            }}
            className="px-3 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" />
            Add image
          </button>
        </div>
      </div>
    </div>
  )
}
