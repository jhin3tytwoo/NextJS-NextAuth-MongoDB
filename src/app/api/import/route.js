import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Post from "../../../../models/post";

export async function POST(req) {
  try {
    // เชื่อมต่อกับฐานข้อมูล MongoDB
    await connectMongoDB();

    // รับข้อมูลจากคำขอ (Request)
    const { posts } = await req.json();

    // ตรวจสอบข้อมูลที่ได้รับ
    if (!Array.isArray(posts)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // ลบโพสต์ทั้งหมดก่อนทำการนำเข้า (เลือกใช้ตามความต้องการ)
    await Post.deleteMany({});

    // สร้างโพสต์ใหม่ทั้งหมดในฐานข้อมูล
    await Post.insertMany(posts);

    return NextResponse.json(
      { message: "Posts imported successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error importing posts:", error);
    return NextResponse.json(
      { error: "Failed to import posts" },
      { status: 500 }
    );
  }
}
