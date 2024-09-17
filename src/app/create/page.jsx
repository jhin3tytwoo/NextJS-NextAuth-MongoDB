"use client"; // เพิ่มบรรทัดนี้ที่ด้านบนสุด

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDropzone } from 'react-dropzone'; // เพิ่ม import useDropzone

function CreatePage() {
    const { data: session } = useSession();
    
    if (!session) redirect("/login");
    
    const [title, setTitle] = useState("");
    const [img, setImg] = useState("");  // จัดการไฟล์รูปภาพที่อัปโหลด
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState({});
    const [uploadedFile, setUploadedFile] = useState(null); // จัดเก็บไฟล์ที่อัปโหลด
    const router = useRouter();

    const validate = () => {
        const newErrors = {};
    
        if (!title.trim()) newErrors.title = "Title is required";
        
        if (!uploadedFile) {
            newErrors.img = "Image is required";
        }
        
        if (!content.trim()) newErrors.content = "Content is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onDrop = (acceptedFiles) => {
        setUploadedFile(acceptedFiles[0]); // จัดเก็บไฟล์รูปภาพที่อัปโหลด
        const reader = new FileReader();
        reader.onload = () => {
            setImg(reader.result); // แปลงรูปภาพเป็น base64 แล้วเก็บไว้ใน img
        };
        reader.readAsDataURL(acceptedFiles[0]); // แปลงไฟล์เป็น base64
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',  // กำหนดให้รับเฉพาะไฟล์รูปภาพ
        multiple: false,    // อัปโหลดได้ครั้งละ 1 รูปภาพ
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validate()) {
            return; // หยุดการทำงานหากมีข้อผิดพลาด
        }

        try {
            const res = await fetch("http://localhost:3000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({title, img, content})
            });

            if (res.ok) {
                router.push("/crud");
            } else {
                throw new Error("Failed to create a post");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container mx-auto py-10'>
            <Navbar session={session}/>
            <h3 className='text-3xl font-bold my-5'>Create Post</h3>
            <hr className='my-3'/>
            <Link href="/crud" className='bg-gray-500 inline-block text-white border py-2 px-3 my-2 rounded'>Go back</Link>
            <form onSubmit={handleSubmit}>
                <input 
                    onChange={(e) => setTitle(e.target.value)} 
                    type="text" 
                    className='w-[300px] block bg-gray-200 border py-2 px-2 rounded text-lg my-2' 
                    placeholder='Post title'
                />
                {errors.title && <p className="text-red-500">{errors.title}</p>}
                
                {/* Dropzone สำหรับการลากและวางรูปภาพ */}
                <div {...getRootProps()} className='w-[300px] block bg-gray-200 border py-10 px-2 rounded text-lg my-2 text-center cursor-pointer'>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the image here ...</p>
                    ) : (
                        <p>{uploadedFile ? uploadedFile.name : 'Drag & drop an image here, or click to select one'}</p>
                    )}
                </div>
                {errors.img && <p className="text-red-500">{errors.img}</p>}
                
                <textarea 
                    onChange={(e) => setContent(e.target.value)} 
                    cols="30" 
                    rows="10" 
                    className='w-[300px] block bg-gray-200 border py-2 px-2 rounded text-lg my-2' 
                    placeholder='Enter your content'
                />
                {errors.content && <p className="text-red-500">{errors.content}</p>}
                
                <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>
                    Create post
                </button>
            </form>
        </div>
    );
}

export default CreatePage;
