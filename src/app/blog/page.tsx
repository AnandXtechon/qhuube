import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { getPosts } from "./get-posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const Blog = async () => {
    const posts = await getPosts()

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">No Posts Yet</h1>
                    <p className="text-gray-600">Check back soon for our latest insights and stories.</p>
                </div>
            </div>
        )
    }

    const featuredPost = posts[0]
    const otherPosts = posts.slice(1)

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="max-w-6xl mx-auto px-6 py-14">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    <span className="text-sky-600">Q</span>huube Insights & Resources
                </h2>
                <p className="text-lg text-sky-600 max-w-2xl leading-relaxed">
                    Discover thought leadership on tax compliance, financial innovation, and technology trends—built to empower modern businesses.
                </p>
            </header>


            {/* Featured Post */}
            <section className="max-w-6xl mx-auto px-6 mb-16">
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        <Image
                            src={featuredPost.cover || "/placeholder.svg?height=600&width=1200"}
                            alt={featuredPost.title}
                            width={1200}
                            height={600}
                            className="w-full h-[500px] md:h-[600px] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                            <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight">{featuredPost.title}</h2>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200">
                                <span>By <strong>{featuredPost.author}</strong></span>
                                <span>•</span>
                                <span>{formatDate(featuredPost.date)}</span>
                                {featuredPost.tags?.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <div className="flex gap-2">
                                            {featuredPost.tags.slice(0, 3).map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="bg-white/20 text-white border-0 hover:bg-white/30"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {featuredPost.readTime && (
                                    <>
                                        <span>•</span>
                                        <span>{featuredPost.readTime} min</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </section>

            {/* Featured Blog Posts */}
            <section className="max-w-6xl mx-auto px-6 mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Featured blog posts</h2>
                    <Button
                        asChild
                        variant="outline"
                        className="text-blue-600 hover:text-blue-600 border-blue-200 hover:bg-blue-100 bg-transparent"
                    >
                        <Link href="/blog/all-posts">
                            View all posts
                            <ArrowUpRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {otherPosts.slice(0, 6).map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                            <article className="space-y-4">
                                <div className="overflow-hidden rounded-xl">
                                    <Image
                                        src={post.cover || "/placeholder.svg?height=240&width=400"}
                                        alt={post.title}
                                        width={400}
                                        height={240}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {post.title}
                                        <ArrowUpRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    {/* <p className="text-gray-600 text-sm line-clamp-3">{post.summary}</p> */}
                                    <div className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                                        <span>By {post.author}</span>
                                        <span>•</span>
                                        <span>{formatDate(post.date)}</span>
                                        <span>•</span>
                                        <span>{post.readTime} min</span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Blog
