import fs from "fs"
import matter from "gray-matter"
import path from "path"

export interface BlogPost {
    slug: string
    title: string
    date: string
    summary?: string
    cover?: string
    content: string
    tags?: string[]
    author?: string
    readTime?: number,
}
  
  
export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
    const filePath = path.join(process.cwd(), "src", "content", "blog", slug, "index.md")

    if (!fs.existsSync(filePath)) {
        console.warn(`Blog post not found: ${filePath}`)
        return null
    }

    const raw = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(raw)

    return {
        slug,
        title: data.title,
        date: data.date || new Date().toISOString(),
        summary: data.summary || "",
        cover: `/blog/${slug}/cover.jpg`,
        tags: data.tags || [],
        author: data.author || "Admin",
        content,
        readTime: data.readTime,
    }
}
  
