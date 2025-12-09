type Message = {
  role: string
  content: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const messages: Message[] = body.messages
    const model: string = body.model
    const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!

    if (!messages) {
      return new Response(JSON.stringify({ error: "Messages required" }), { status: 400 })
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GOOGLE_API_KEY" }), { status: 500 })
    }

    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }],
    }))

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 512,
      },
    }

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(JSON.stringify({ error: text }), { status: 500 })
    }

    const data = await res.json()

    const output = data.candidates?.[0].content;

    return Response.json({ content: output })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
