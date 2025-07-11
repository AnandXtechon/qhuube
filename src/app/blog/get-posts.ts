import path from "path"
import fs from "fs"
import matter from "gray-matter"

export interface BlogPost {
    slug: string
    title: string
    date: string
    summary: string
    cover: string
    content: string
    tags: string[]
    author: string
    readTime: number
}

export const getPosts = async (): Promise<BlogPost[]> => {
    const postsDir = path.join(process.cwd(), "src", "content", "blog")

    if (!fs.existsSync(postsDir)) {
        console.warn(`Blog directory not found: ${postsDir}`)
        return []
    }

    const slugs = fs.readdirSync(postsDir)
    const validSlugs = slugs.filter((slug) => {
        const isValid = !slug.includes("[") && !slug.includes("]") && slug !== ".DS_Store"
        if (!isValid) {
            console.warn(`Skipping invalid slug: ${slug}`)
        }
        return isValid
    })

    const posts: BlogPost[] = validSlugs
        .map((slug) => {
            const filePath = path.join(postsDir, slug, "index.md")
            if (!fs.existsSync(filePath)) {
                console.warn(`Markdown file not found: ${filePath}`)
                return null
            }

            const raw = fs.readFileSync(filePath, "utf-8")
            const { data } = matter(raw)

            return {
                slug,
                title: data.title || slug,
                summary: data.summary || "No summary available",
                date: data.date || new Date().toISOString(),
                cover: `/blog/${slug}/cover.jpg`,
                tags: data.tags || [],
                author: data.author || "Admin",
                readTime: data.readTime
            }
        })
        .filter((post): post is BlogPost => post !== null)

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
