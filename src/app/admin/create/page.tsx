/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import type React from "react"
import { ArrowLeft, Eye, Save, ImageIcon, X } from "lucide-react"
import RichTextEditor from "../components/RichTextEditor"
import Link from "next/link"
import axios from "axios"
import { toast } from "sonner"

export default function CreateBlogPost() {
    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [summary, setSummary] = useState("")
    const [content, setContent] = useState("")
    const [author, setAuthor] = useState("")
    const [tags, setTags] = useState("")
    const [readTime, setReadTime] = useState(0)
    const [cover, setCover] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>("")
    const [isPreview, setIsPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const slugify = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        setSlug(slugify(newTitle))
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setCover(file)
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setCoverPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setCoverPreview("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("title", title)
            formData.append("slug", slug)
            formData.append("summary", summary)
            formData.append("content", content) // HTML content
            formData.append("author", author)
            formData.append("tags", tags) // comma-separated string
            formData.append("readTime", readTime.toString())
            if (cover) formData.append("cover", cover)

            const response = await axios.post("/api/blog/create", formData , {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (response.data) {
                console.log(formData)
            }
            toast.success("Blog post published successfully!")

            // Reset form
            setTitle("")
            setSlug("")
            setSummary("")
            setContent("")
            setAuthor("")
            setTags("")
            setCover(null)
            setCoverPreview("")
            setIsPreview(false)

        } catch (error: any) {
            console.error("Error creating blog post:", error)
            alert("Something went wrong while publishing the blog post.")
        } finally {
            setIsSubmitting(false)
        }
    }


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }
    const wordCount = content
        .replace(/<[^>]*>/g, "")
        .split(" ")
        .filter((word) => word.length > 0).length

    useEffect(() => {
        
        const time = Math.max(1, Math.ceil(wordCount / 200))
        setReadTime(time)
    }, [content, wordCount])
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/posts" className="text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-medium text-gray-900">Create Article</h1>
                                <p className="text-sm text-gray-500">Write and publish your story</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsPreview(!isPreview)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPreview ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                {isPreview ? "Edit" : "Preview"}
                            </button>
                            <button
                                type="submit"
                                form="blog-form"
                                disabled={isSubmitting || !title.trim()}
                                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Publish
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {!isPreview ? (
                            <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
                                {/* Title */}
                                <div>
                                    <input
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder="Article title"
                                        required
                                        className="w-full text-4xl font-medium placeholder-gray-400 border-none focus:outline-none p-0 bg-transparent text-gray-900"
                                    />
                                </div>

                                {/* Summary */}
                                <div>
                                    <textarea
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        placeholder="Write a brief summary of your article..."
                                        rows={3}
                                        className="w-full text-xl text-gray-600 placeholder-gray-400 border-none focus:outline-none p-0 resize-none bg-transparent leading-relaxed"
                                    />
                                </div>

                                {/* Cover Image */}
                                <div className="border-t border-gray-200 pt-8">
                                    <label className="block text-sm font-medium text-gray-900 mb-4">Cover Image</label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-gray-300 transition-colors">
                                        {coverPreview ? (
                                            <div className="relative">
                                                <img
                                                    src={coverPreview || "/placeholder.svg"}
                                                    alt="Cover preview"
                                                    className="w-full h-auto object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCover(null)
                                                        setCoverPreview("")
                                                    }}
                                                    className="absolute z-20 cursor-pointer top-3 right-3 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50 transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-2">Upload a cover image</p>
                                                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Content Editor */}
                                <div className="border-t border-gray-200 pt-8">
                                    <label className="block text-sm font-medium text-gray-900 mb-4">Content</label>
                                    <RichTextEditor content={content} onChange={setContent} />
                                </div>
                            </form>
                        ) : (
                            /* Preview Mode - Matches blog detail page exactly */
                            <article className="max-w-4xl">
                                {/* Header */}
                                <header className="mb-12">
                                    <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-6">
                                        {title || "Article title"}
                                    </h1>

                                    {summary && <p className="text-xl text-gray-600 leading-relaxed mb-8">{summary}</p>}

                                    {/* Meta information */}
                                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-gray-200 rounded-full" />
                                            <span>{author || "Admin"}</span>
                                        </div>
                                        <span>{formatDate(new Date().toISOString())}</span>
                                        <span>{readTime} min read</span>
                                    </div>

                                    {/* Tags */}
                                    {tags && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.split(",").map((tag: string, index: number) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </header>

                                {/* Featured Image */}
                                {coverPreview && (
                                    <div className="relative overflow-hidden rounded-xl mb-12">
                                        <img
                                            src={coverPreview || "/placeholder.svg"}
                                            alt={title}
                                            className="w-full h-auto md:h-[500px] object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content - Render HTML directly */}
                                <div className="prose prose-lg max-w-none">
                                    <div
                                        className="prose-headings:font-medium prose-headings:text-gray-900 prose-headings:leading-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-medium prose-strong:text-gray-900 prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono"
                                        dangerouslySetInnerHTML={{ __html: content || "<p>Your content will appear here...</p>" }}
                                    />
                                </div>
                            </article>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Settings */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">URL Slug</label>
                                    <input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="url-friendly-slug"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Author</label>
                                    <input
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Author name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Tags</label>
                                    <input
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="design, technology, business"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="font-medium text-gray-900 mb-4">Article Stats</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Words</span>
                                    <span className="font-medium">{wordCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Characters</span>
                                    <span className="font-medium">{content.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Read time</span>
                                    <span className="font-medium">{readTime} min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
