import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@workos-inc/authkit-nextjs";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { messages, model, systemPrompt, stream = false } = await req.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://mylescrm.app",
        "X-Title": "MylesCRM",
      },
      body: JSON.stringify({
        model: model ?? process.env.OPENROUTER_DEFAULT_MODEL ?? "anthropic/claude-3.5-sonnet",
        messages: systemPrompt
          ? [{ role: "system", content: systemPrompt }, ...messages]
          : messages,
        stream,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    if (stream) {
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
