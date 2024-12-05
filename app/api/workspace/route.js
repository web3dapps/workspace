import db from "@/lib/database";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, description, image } = body;

    if (!name || !description) {
      throw new Error("Name and description are required.");
    }

    const stmt = db.prepare(`
      INSERT INTO Workspace (name, description, image)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, description, image || null);
    return new Response(
      JSON.stringify({ success: true, id: result.lastInsertRowid }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating workspace:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    // Fetch all workspaces from the database
    const stmt = db.prepare("SELECT * FROM Workspace");
    const workspaces = stmt.all();

    return new Response(JSON.stringify(workspaces), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const workspaceId = url.searchParams.get("id");

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: "Workspace ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleteStmt = db.prepare("DELETE FROM Workspace WHERE id = ?");
    const result = deleteStmt.run(workspaceId);

    if (result.changes === 0) {
      return new Response(
        JSON.stringify({ error: "Workspace not found or already deleted." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Workspace deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting workspace:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}