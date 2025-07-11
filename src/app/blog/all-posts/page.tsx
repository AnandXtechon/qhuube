import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { getPosts } from "../get-posts"


const page = async () => {
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

    const otherPosts = posts.slice(1)

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })

    return (
        <div className="my-8">

            {/* Navigation */}
            <nav className="max-w-6xl mx-auto px-6 pb-4">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to blogs
                </Link>
            </nav>


            {/* All Posts */}
            {otherPosts.length > 6 && (
                <section className="max-w-6xl mx-auto px-6 mb-20">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">All posts</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {otherPosts.slice(6).map((post) => (
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
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {post.title}
                                            <ArrowUpRight className="w-4 h-4 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        {/* <p className="text-gray-600 text-sm line-clamp-3">{post.summary}</p> */}
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                            <span>By {post.author}</span>
                                            <span>•</span>
                                            <span>{formatDate(post.date)}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default page