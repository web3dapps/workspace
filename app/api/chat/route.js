import fetch from "node-fetch";
import db from "@/lib/database";

const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// function renameMessageColumnToContent() {
//   const tableInfo = db.prepare(`PRAGMA table_info(Chat);`).all();
//   const hasMessageColumn = tableInfo.some((column) => column.name === "message");
//   const hasContentColumn = tableInfo.some((column) => column.name === "content");

//   // If 'content' column already exists, do nothing
//   if (hasContentColumn) {
//     console.log("'content' column already exists.");
//     return;
//   }

//   // If 'message' column exists but 'content' does not, proceed with renaming
//   if (hasMessageColumn && !hasContentColumn) {
//     db.transaction(() => {
//       // 1. Create a new table with the correct schema
//       db.exec(`
//         CREATE TABLE Chat_new (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           workspace_id INTEGER NOT NULL,
//           content TEXT NOT NULL,
//           role TEXT NOT NULL DEFAULT 'user',
//           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//           FOREIGN KEY (workspace_id) REFERENCES Workspace (id)
//         );
//       `);

//       // 2. Copy the data from the old table to the new table
//       db.exec(`
//         INSERT INTO Chat_new (id, workspace_id, content, role, created_at)
//         SELECT id, workspace_id, message, role, created_at FROM Chat;
//       `);

//       // 3. Drop the old table
//       db.exec(`DROP TABLE Chat;`);

//       // 4. Rename the new table to the original table name
//       db.exec(`ALTER TABLE Chat_new RENAME TO Chat;`);
//     })();

//     console.log("Renamed 'message' column to 'content'.");
//   } else {
//     console.log("No need to rename the column.");
//   }
// }

// // Run the function to rename the column if needed
// renameMessageColumnToContent();
 

export async function POST(request) {
  try {
    const contentType = request.headers.get("Content-Type");
    const workspaceId = request.headers.get("workspace_id");

    if (!workspaceId) {
      throw new Error("Workspace ID is required.");
    }

    let message;
    const body = await request.json();
    message = body.message;

    if (!message) {
      throw new Error("No message provided.");
    }

    // Insert user's message
    db.prepare(
      `INSERT INTO Chat (workspace_id, content, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
    ).run(workspaceId, message, "user");

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
    db.prepare(
      `INSERT INTO Chat (workspace_id, content, role, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
    ).run(workspaceId, assistantMessage, "assistant");

    return new Response(
      JSON.stringify({ reply: assistantMessage }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch response from OpenAI." }),
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

    const chats = db
      .prepare(
        `SELECT * FROM Chat WHERE workspace_id = ? ORDER BY created_at ASC`
      )
      .all(workspaceId);

    return new Response(JSON.stringify({ chats }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch chat history." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
