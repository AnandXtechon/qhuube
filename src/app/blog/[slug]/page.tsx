import { getBlogBySlug } from "./get-post-detail"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { getPosts } from "../get-posts"

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await getBlogBySlug(params.slug)

    if (!post) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <h1 className="text-2xl font-medium text-gray-900 mb-4">Post not found</h1>
                    <Link href="/blog" className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to blogs
                    </Link>
                </div>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const posts = await getPosts()
    const moreArticles = posts.filter(p => p.slug !== post.slug).slice(0, 3)


    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="max-w-6xl mx-auto px-6 py-6">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to blogs
                </Link>
            </nav>

            {/* Article */}
            <article className="max-w-6xl mx-auto px-6 pb-16">
                {/* Header */}
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-6">{post.title}</h1>

                    {post.summary && <p className="text-xl text-gray-600 leading-relaxed mb-8">{post.summary}</p>}

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-medium">By {post.author}</span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Featured Image */}
                {post.cover && (
                    <div className="relative overflow-hidden rounded-xl mb-12">
                        <Image
                            src={post.cover || "/placeholder.svg?height=500&width=800"}
                            alt={post.title}
                            width={800}
                            height={500}
                            className="w-full h-[400px] md:h-[500px] object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <div
                        className="prose-headings:font-medium prose-headings:text-gray-900 prose-headings:leading-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-medium prose-strong:text-gray-900 prose-ul:my-6 prose-ol:my-6 prose-li:my-2 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                {/* Author Section
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            {(post.author || "A")[0]}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 mb-1">{post.author}</h3>
                            <p className="text-gray-600 text-sm mb-3">
                                Content creator and technology enthusiast passionate about sharing insights on modern web development.
                            </p>
                            <Link
                                href={`/author/${post.author?.toLowerCase().replace(/\s+/g, "-")}`}
                                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
                            >
                                View profile
                                <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div> */}

                {/* Related Posts or Back to Blog */}
                {/* More Articles */}
                {moreArticles.length > 0 && (
                    <div className="mt-20 border-t border-gray-200 pt-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-8">More Articles</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {moreArticles.map((article) => (
                                <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                                    <article className="space-y-4">
                                        <div className="overflow-hidden rounded-xl">
                                            <Image
                                                src={article.cover || "/placeholder.svg?height=240&width=400"}
                                                alt={article.title}
                                                width={400}
                                                height={240}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {article.title}
                                                <ArrowUpRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                                                <span>By {article.author}</span>
                                                <span>•</span>
                                                <span>{formatDate(article.date)}</span>
                                                <span>•</span>
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </article>
        </div>
    )
}
