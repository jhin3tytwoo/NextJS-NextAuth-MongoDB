"use client"

import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation'


function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const { data: session } = useSession();
    if (session) router.replace('welcome');


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await signIn("credentials", {
                email, password, redirect: false
            })

            if (res.error) {
                setError("Invalid credentials");
                return;
            }

            router.replace("welcome");

        } catch(error) {
            console.log(error);
        }
    }

  return (
    <div>
      <Navbar/>
      <div className='container mx-auto py-5'>
        <h3>Login page</h3>
        <hr className='my-3'></hr>
        <form onSubmit={handleSubmit}>

        {error && (
          <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
            {error}
            </div>
          )}
            <input type="text" onChange={(e) => setEmail(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your email' />
            <input type="password" onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
            <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Sign In</button>
        </form>
        <hr className='my-3' />
        <p>Go to <Link href="/register" className='text-blue-500 hover:underline'>Register</Link> Page</p>
      </div>
    </div>
  )
}

export default LoginPage
