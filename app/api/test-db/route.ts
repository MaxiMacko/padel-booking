import { NextResponse } from "next/server";
import { Client } from "pg";

console.log('URL', process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Connected ✅ Time:", res.rows[0]);
  } catch (err) {
    console.error("❌ DB connection error:", err);
  } finally {
    await client.end();
  }
}


export async function GET() {
  try {
    test();
    return NextResponse.json({ ok: true });
  }
  catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
