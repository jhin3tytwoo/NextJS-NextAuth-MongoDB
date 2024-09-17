import { connectMongoDB } from "../../../../../lib/mongodb";
import { NextResponse } from "next/server";
import Post from "../../../../../models/post";

export async function GET(req, { params }) {
  const { id } = params;
  await connectMongoDB();
  const post = await Post.findOne({ _id: id });
  return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = params;
  const {
    newTitle: title,
    newImg: img, // This will now be base64
    newContent: content,
  } = await req.json();
  await connectMongoDB();
  await Post.findByIdAndUpdate(id, { title, img, content });
  return NextResponse.json({ message: "Post updated" }, { status: 200 });
}
