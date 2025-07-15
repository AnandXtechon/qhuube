/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Eye, Save, ImageIcon, X, Calendar, User, Clock } from 'lucide-react';
import RichTextEditor from '../components/rich-text-editor';

export default function BlogPostEditor() {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [tags, setTags] = useState('');
    const [readTime, setReadTime] = useState(0);
    const [cover, setCover] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const slugify = (str: string) =>
        str
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(slugify(newTitle));
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCover(file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCoverPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setCoverPreview('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            const formData = new FormData();
            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('summary', summary);
            formData.append('content', content);
            formData.append('author', author);
            formData.append('tags', tags);
            formData.append('readTime', readTime.toString());
            if (cover) formData.append('cover', cover);

            console.log('Publishing blog post:', {
                title,
                slug,
                summary,
                content,
                author,
                tags: tags.split(',').map(tag => tag.trim()),
                readTime,
                cover: cover ? cover.name : null,
                publishedAt: new Date().toISOString(),
            });

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            alert('Blog post published successfully!');

            // Reset form
            setTitle('');
            setSlug('');
            setSummary('');
            setContent('');
            setAuthor('');
            setTags('');
            setCover(null);
            setCoverPreview('');
            setIsPreview(false);
        } catch (error) {
            console.error('Error creating blog post:', error);
            alert('Something went wrong while publishing the blog post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Calculate word count and read time
    const wordCount = content
        .replace(/<[^>]*>/g, '')
        .split(' ')
        .filter((word) => word.length > 0).length;

    useEffect(() => {
        const time = Math.max(1, Math.ceil(wordCount / 200));
        setReadTime(time);
    }, [wordCount]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className='hidden lg:block'>
                                <h1 className="text-xl font-semibold text-gray-900">Create Article</h1>
                                <p className="text-sm text-gray-500">Write and publish your story</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsPreview(!isPreview)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPreview
                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                {isPreview ? 'Edit' : 'Preview'}
                            </button>
                            <button
                                type="submit"
                                form="blog-form"
                                disabled={isSubmitting || !title.trim()}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm"
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

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {!isPreview ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <form id="blog-form" onSubmit={handleSubmit} className="p-8 space-y-8">
                                    {/* Title */}
                                    <div>
                                        <input
                                            value={title}
                                            onChange={handleTitleChange}
                                            placeholder="Enter your article title..."
                                            required
                                            className="w-full text-3xl md:text-4xl font-bold placeholder-gray-400 border-none focus:outline-none p-0 bg-transparent text-gray-900 leading-tight"
                                        />
                                    </div>

                                    {/* Summary */}
                                    <div>
                                        <textarea
                                            value={summary}
                                            onChange={(e) => setSummary(e.target.value)}
                                            placeholder="Write a compelling summary that will hook your readers..."
                                            rows={3}
                                            className="w-full text-lg text-gray-600 placeholder-gray-400 border-none focus:outline-none p-0 resize-none bg-transparent leading-relaxed"
                                        />
                                    </div>

                                    {/* Cover Image */}
                                    <div className="border-t border-gray-100 pt-8 flex flex-col items-center justify-center ">
                                        <label className="block text-start text-sm font-semibold text-gray-900 mb-4">
                                            Cover Image
                                        </label>

                                        <div className="relative border-2 w-fit h-fit flex border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:border-gray-300 transition-colors">
                                            {coverPreview ? (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={coverPreview}
                                                        alt="Cover preview"
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCover(null);
                                                            setCoverPreview('');
                                                        }}
                                                        className="absolute top-3 z-30 right-3 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition-colors"
                                                    >
                                                        <X className="w-4 h-4 text-gray-600 cursor-pointer" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                                                    <p className="text-gray-600 mb-2 font-medium">Upload a cover image</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB. Recommended: 1200×630px</p>
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
                                    <div className="border-t border-gray-100 pt-8">
                                        <label className="block text-sm font-semibold text-gray-900 mb-4">
                                            Article Content
                                        </label>
                                        <RichTextEditor content={content} onChange={setContent} />
                                    </div>
                                </form>
                            </div>
                        ) : (
                            /* Preview Mode */
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <article className="max-w-4xl">
                                    {/* Header */}
                                    <header className="mb-12">
                                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                            {title || 'Your article title will appear here'}
                                        </h1>

                                        {summary && (
                                            <p className="text-xl text-gray-600 leading-relaxed mb-8">{summary}</p>
                                        )}

                                        {/* Meta information */}
                                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{author || 'Anonymous'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(new Date().toISOString())}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{readTime} min read</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {tags && (
                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {tags.split(',').map((tag: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                                                    >
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
                                                src={coverPreview}
                                                alt={title}
                                                className="w-full h-auto max-h-96 object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50 prose-blockquote:py-4">
                                        {content ? (
                                            <div dangerouslySetInnerHTML={{ __html: content }} />
                                        ) : (
                                            <p className="text-gray-400 italic">Your content will appear here...</p>
                                        )}
                                    </div>
                                </article>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Settings */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        URL Slug
                                    </label>
                                    <input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="url-friendly-slug"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Author
                                    </label>
                                    <input
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Author name"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags
                                    </label>
                                    <input
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="technology, design, business"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Article Stats</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Words</span>
                                    <span className="font-semibold text-gray-900">{wordCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Characters</span>
                                    <span className="font-semibold text-gray-900">{content.length.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Read time</span>
                                    <span className="font-semibold text-gray-900">{readTime} min</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                                        Draft
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <h3 className="font-semibold text-blue-900 mb-3">Writing Tips</h3>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>• Keep your title under 60 characters for better SEO</li>
                                <li>• Write a compelling summary to hook readers</li>
                                <li>• Use headings to structure your content</li>
                                <li>• Include relevant images to break up text</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}