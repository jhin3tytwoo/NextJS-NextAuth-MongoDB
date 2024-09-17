"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDropzone } from 'react-dropzone';  // import react-dropzone

function EditPostPage({ params }) {
    const { data: session } = useSession();
    
    if (!session) redirect("/login");
    console.log(session);

    const { id } = params;

    const [postData, setPostData] = useState("");

    // New data of post
    const [newTitle, setNewTitle] = useState("");
    const [newImg, setNewImg] = useState("");
    const [newContent, setNewContent] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);  // state for uploaded file

    const router = useRouter();

    const getPostById = async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/api/posts/${id}`,{
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Failed to fetch a post");
            }

            const data = await res.json();
            console.log("edit post:", data);
            setPostData(data.post);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getPostById(id);
    }, [id]);

    // Handle dropzone logic
    const onDrop = (acceptedFiles) => {
        setUploadedFile(acceptedFiles[0]);
        const reader = new FileReader();
        reader.onload = () => {
            setNewImg(reader.result);  // Save base64 image string
        };
        reader.readAsDataURL(acceptedFiles[0]); // Convert image to base64 string
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',  // Accept image files only
        multiple: false,    // Only one file at a time
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedTitle = newTitle || postData.title;
            const updatedImg = newImg || postData.img;
            const updatedContent = newContent || postData.content;

            const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ newTitle: updatedTitle, newImg: updatedImg, newContent: updatedContent })
            });

            if (!res.ok) {
                throw new Error("Failed to update the post");
            }

            router.refresh();
            router.push("/crud");

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container mx-auto py-10'>
            <Navbar session={session} />
            <h3 className='text-3xl font-bold my-5'>Edit Post</h3>
            <hr className='my-3' />
            <Link href="/crud" className='bg-gray-500 inline-block text-white border py-2 px3 my-2 rounded'>Go back</Link>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setNewTitle(e.target.value)}
                    type="text"
                    className='w-[300] block bg-gray-200 border py-2 px-2 rounded text-lg my-2'
                    defaultValue={postData.title}
                />
                <div {...getRootProps()} className='w-[300] block bg-gray-200 border py-10 px-2 rounded text-lg my-2 text-center cursor-pointer'>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the image here ...</p>
                    ) : (
                        <p>{uploadedFile ? uploadedFile.name : 'Drag & drop an image here, or click to select one'}</p>
                    )}
                </div>
                <textarea
                    onChange={(e) => setNewContent(e.target.value)}
                    cols="30"
                    rows="10"
                    className='w-[300] block bg-gray-200 border py-2 px-2 rounded text-lg my-2'
                    defaultValue={postData.content}
                />
                <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Edit post</button>
            </form>
        </div>
    );
}

export default EditPostPage;
