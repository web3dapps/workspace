import fetch from "node-fetch";
// import PdfParse from "pdf-parse";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function POST(request) {
  try {

    const contentType = request.headers.get("Content-Type");
    let message;
    if (contentType?.includes("application/pdf")) {
      // const pdfBuffer = await request.arrayBuffer();
      const pdfData = await PdfParse(new Uint8Array(pdfBuffer));
      message = `Summarize the following text extracted from a PDF:\n${pdfData.text}`;
    } else {
      const body = await request.json();
      message = body.message;

      if (!message) {
        throw new Error("No message provided.");
      }
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", 
        messages: [
          { role: "system", content: "You are an intelligent and helpful assistant. Please provide precise and high-quality answers." },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7, 
        top_p: 1, 
        frequency_penalty: 0,
        presence_penalty: 0, 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error from OpenAI API:", data);
      throw new Error(data.error?.message || "Failed to fetch response from OpenAI.");
    }

    return new Response(JSON.stringify({ reply: data.choices[0]?.message?.content || "" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from OpenAI." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
