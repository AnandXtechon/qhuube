import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const summary = formData.get("summary") as string
    const content = formData.get("content") as string
    const cover = formData.get("cover") as File
    const author = formData.get("author") as string
    const tags = formData.get("tags") as string
    const readTime = formData.get("readTime") as string

    const createdAt = new Date().toISOString()
    const id = Date.now().toString()
    

    const postDir = path.join(process.cwd(), "src", "content", "blog", slug)
    const coverDir = path.join(process.cwd(), "public", "blog", slug)

    await mkdir(postDir, { recursive: true })
    await mkdir(coverDir, { recursive: true })

    const md = `---
title: "${title}"
summary: "${summary}"
date: "${createdAt}"
author: "${author}"
readTime: "${readTime}"
tags: [${tags
            .split(",")
            .map((tag) => `"${tag.trim()}"`)
            .join(", ")}]
id: "${id}"
---

${content}
`

    await writeFile(path.join(postDir, "index.md"), md)

    if (cover && cover.size > 0) {
        const buffer = Buffer.from(await cover.arrayBuffer())
        await writeFile(path.join(coverDir, "cover.jpg"), buffer)
    }

    return NextResponse.json({ success: true })
}
