"use client"

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from 'next/link';
import Image from 'next/image';
import DeleteBtn from '../DeleteBtn';

function CrudPage() {
  const [postData, setPostData] = useState([]);

  console.log(postData);

  const getPosts = async () =>{
    try {
        const res = await fetch("http://localhost:3000/api/posts",{
            method: "GET",
            cache: "no-store"
        })

        if(!res.ok){
            throw new Error ("Fail to fetch posts");
        }

        const data = await res.json();
        setPostData(data.posts)
    }catch(error){
        console.log("error loading posts: ",error)
  }
  }

  useEffect(() => {
    getPosts();
  }, []);

  const { data: session } = useSession();

  if (!session) redirect("/login");
  console.log(session);

  return (
    <div className='container mx-auto my-3'>
      <Navbar session={session} />
      <h1 className='py-2 py-3 rounded-md my-5'>NextJS CRUD + MongoDB</h1>
      <hr className='my-3'/>
      <button className='bg-green-500 p-3 text-white rounded'>
        <Link href="/create">Create Post</Link>
      </button>

      {/* Container for posts */}
      <div className='grid grid-cols-4 gap-5 mt-3'>
        {postData && postData.length > 0 ? (
            postData.map(val =>(
                <div  key={val._id} className='col-span-1 shadow-xl p-5 rounded-lg'>
                <h4 className='text-lg font-bold'>{val.title}</h4>
                <Image src={val.img} alt={val.title} width={300} height={0}/>
                <p className='text-sm'>
                  {val.content}
                </p>
                <div className='mt-5 flex space-x-3'>
                  <Link className='bg-gray-500 text-white border py-2 px-4 rounded-md text-lg' href={`/edit/${val._id}`}>
                    Edit
                  </Link>
                  <DeleteBtn id={val._id}/>
                </div>
              </div>
            ))
        ):(
            <p className="bg-gray-300 p-3 my-3">
                You do not have any posts yet.
            </p>
        )}
      </div>
    </div>
  );
}

export default CrudPage;
