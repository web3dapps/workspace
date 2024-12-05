import db from "@/lib/database";

export async function POST(request) {
  try {
     const checkColumnStmt = db.prepare(`
      SELECT COUNT(*) as count 
      FROM pragma_table_info('PDF') 
      WHERE name = 'fileName'
    `);
    const { count } = checkColumnStmt.get();

    if (count === 0) {
      db.exec(`
        ALTER TABLE PDF ADD COLUMN fileName TEXT
      `);
      console.log("'fileName' column added to PDF table.");
    }
    const body = await request.json();
    const { workspace_id, file_url, fileName } = body;

     if (!workspace_id || !file_url || !fileName) {
      throw new Error("Workspace ID, file URL, and file name are required.");
    }


     const stmt = db.prepare(`
      INSERT INTO PDF (workspace_id, file_url, fileName)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(workspace_id, file_url, fileName);
    return new Response(
      JSON.stringify({ success: true, id: result.lastInsertRowid }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error uploading PDF:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const workspaceId = url.searchParams.get("workspace_id");

    if (!workspaceId) {
      return new Response(
        JSON.stringify({ error: "Workspace ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stmt = db.prepare("SELECT * FROM PDF WHERE workspace_id = ?");
    const pdfs = stmt.all(workspaceId);

    return new Response(JSON.stringify(pdfs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching PDFs:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const pdfId = url.searchParams.get("id");

    if (!pdfId) {
      return new Response(
        JSON.stringify({ error: "PDF ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleteStmt = db.prepare("DELETE FROM PDF WHERE id = ?");
    const result = deleteStmt.run(pdfId);

    if (result.changes === 0) {
      return new Response(
        JSON.stringify({ error: "PDF not found or already deleted." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "PDF deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting PDF:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

