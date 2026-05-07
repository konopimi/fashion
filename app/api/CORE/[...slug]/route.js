// app/api/core/[[...slug]]/route.js
import { NextResponse } from "next/server";
import {
  get,
  getAll,
  create,
  remove,
  update,
} from "@/lib/api/models/default.js";
import { ObjectId } from "mongodb";
// DYNAMIC IMPORT HELPER
const getDbConnection = async () => {
  try {
    const { connectToDatabase } = await import("@/lib/mongodb");
    return connectToDatabase();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Failed to connect to database");
  }
};
const debug = (label, obj) => {
  try {
    console.log(`[api/core] ${label}:`, JSON.stringify(obj));
  } catch {
    console.log(`[api/core] ${label}: (unserializable)`);
  }
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req, { params }) {
  const { slug = [] } = await params;
  const collection = slug[0];
  debug("incoming", { method: "POST", url: req.url, params: slug });

  if (!collection)
    return badRequest("Missing collection in slug. Example: /api/core/posts");

  let body;
  try {
    body = await req.json();
  } catch (err) {
    debug("invalid-json", { err: err?.message });
    return badRequest(
      "Invalid JSON body. Ensure Content-Type: application/json and valid JSON.",
    );
  }

  const data = body?.data ? { ...body.data } : { ...body };
  if (!data || Object.keys(data).length === 0) {
    return badRequest(
      "Missing `data` payload for POST. Provide JSON with `data` object or payload fields.",
    );
  }

  data.creation = {
    utc: new Date().toISOString(),
    by: body?.by ?? null,
  };

  try {
    const response = await create(collection, data);
    const asset = JSON.parse(
      JSON.stringify({ _id: response.insertedId, ...data }),
    );
    return NextResponse.json({ response, asset });
  } catch (err) {
    console.error("[api/core] create error:", err);
    return NextResponse.json(
      { error: "Create failed", details: err?.message },
      { status: 500 },
    );
  }
}

export async function GET(req, { params }) {
  const { slug = [] } = await params;
  const collection = slug[0];
  debug("incoming", { method: "GET", url: req.url, params: slug });

  if (!collection)
    return badRequest("Missing collection in slug. Example: /api/core/posts");

  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  try {
    const response = Object.keys(query).length
      ? await get(collection, query)
      : await getAll(collection);
    return NextResponse.json({ response });
  } catch (err) {
    console.error("[api/core] get error:", err);
    return NextResponse.json(
      { error: "Get failed", details: err?.message },
      { status: 500 },
    );
  }
}

export async function DELETEold(req, { params }) {
  const { slug = [] } = await params;
  const collection = slug[0];
  debug("incoming", { method: "DELETE", url: req.url, params: slug });

  if (!collection)
    return badRequest("Missing collection in slug. Example: /api/core/posts");

  const url = new URL(req.url);
  let id = url.searchParams.get("id");

  if (!id) {
    try {
      const body = await req.json().catch(() => null);
      id = body?.id;
    } catch (err) {
      // ignore parse error, will trigger missing id below
    }
  }

  if (!id)
    return badRequest(
      "Missing id for DELETE. Provide ?id=... or JSON body { id: '...' }",
    );

  try {
    const response = await remove(collection, { id });
    return NextResponse.json({ response });
  } catch (err) {
    console.error("[api/core] delete error:", err);
    return NextResponse.json(
      { error: "Delete failed", details: err?.message },
      { status: 500 },
    );
  }
}
export async function DELETE(request, { params }) {
  try {
    // params.slug is array because of [...slug] catch-all
    const slugParts = params?.slug || [];
    if (slugParts.length === 0) {
      return new Response(
        JSON.stringify({ message: "Collection name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const collection = slugParts[0]; // e.g. "heroes", "projects", "files"

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // You can also support body as fallback/alternative
    let bodyId;
    try {
      const body = await request.json().catch(() => ({}));
      bodyId = body.id || body._id;
    } catch {}

    const assetId = id || bodyId;

    if (!assetId) {
      return new Response(
        JSON.stringify({
          message: "Asset ID is required (use ?id=... or body {id})",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { db } = await getDbConnection();

    let objectId;
    try {
      objectId = new ObjectId(assetId);
    } catch (err) {
      return new Response(JSON.stringify({ message: "Invalid ID format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await db.collection(collection).deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ message: "Asset not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Asset deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({
        message: "Error deleting asset",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
export async function PUT() {
  return NextResponse.json(
    {
      error:
        "PUT operation needs the field pattern. Example: api/music/comments",
    },
    { status: 400 },
  );
}

export async function PATCH(req, { params }) {
  const { slug = [] } = await params;
  const collection = slug[0];

  if (!collection) {
    return NextResponse.json(
      { error: "Missing collection in slug for PATCH." },
      { status: 400 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body for PATCH." },
      { status: 400 },
    );
  }

  const id = body?.id || body?._id;
  const data = body?.data;

  if (!id || !data) {
    return NextResponse.json(
      { error: "PATCH requires { id, data }." },
      { status: 400 },
    );
  }

  const response = await update(collection, id, data);
  return NextResponse.json({ response });
}
