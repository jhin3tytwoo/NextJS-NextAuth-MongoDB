import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post";
import { format } from "date-fns";

export async function GET() {
  try {
    await connectMongoDB();
    const posts = await Post.find({});
    const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
    const fileName = `posts_${timestamp}.json`;

    return NextResponse.json({ posts, fileName });
  } catch (error) {
    console.error("Error exporting posts:", error);
    return NextResponse.json(
      { error: "Failed to export posts" },
      { status: 500 }
    );
  }
}
