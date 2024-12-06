import fetch from "node-fetch";
import supabase from "@/lib/database";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function POST(request) {
  try {
    const workspaceId = request.headers.get("workspace_id");

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: "Workspace ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const message = body.message;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "No message provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: userInsertError } = await supabase
      .from("Chat")
      .insert({
        workspace_id: workspaceId,
        content: message,
        role: "user",
      });

    if (userInsertError) {
      console.error("Error inserting user message:", userInsertError.message);
      throw userInsertError;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an intelligent and helpful assistant. Please provide precise and high-quality answers.",
          },
          { role: "user", content: message },
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
      throw new Error(
        data.error?.message || "Failed to fetch response from OpenAI."
      );
    }

    const assistantMessage = data.choices[0]?.message?.content || "";

    // Insert assistant's message
    const { error: assistantInsertError } = await supabase
      .from("Chat")
      .insert({
        workspace_id: workspaceId,
        content: assistantMessage,
        role: "assistant",
      });

    if (assistantInsertError) {
      console.error(
        "Error inserting assistant message:",
        assistantInsertError.message
      );
      throw assistantInsertError;
    }

    return new Response(
      JSON.stringify({ reply: assistantMessage }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to process request." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request) {
  try {
    const workspaceId = request.headers.get("workspace_id");

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: "Workspace ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: chats, error } = await supabase
      .from("Chat")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat history:", error.message);
      throw error;
    }

    return new Response(JSON.stringify({ chats }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat history." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
