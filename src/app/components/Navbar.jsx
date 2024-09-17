"use client";

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

function Navbar() {
  const { data: session, status } = useSession(); // ใช้ useSession เพื่อตรวจสอบ session

  return (
    <nav className="flex justify-between items-center shadow-md p-5">
      <div>
        <Link href="/">NextAuth</Link>
      </div>
      <ul className="flex space-x-4">
        {status === 'loading' ? (
          <li>Loading...</li> // ขณะโหลด session สามารถแสดงข้อความ "Loading..." ได้
        ) : !session ? (
          <>
            <li className="mx-3">
              <Link href="/login">Login</Link>
            </li>
            <li className="mx-3">
              <Link href="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
          <li className="mx-3">
              <Link
                href="/crud"
                className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2"
              >
                CRUD
              </Link>
            </li>
            <li className="mx-3">
              <Link
                href="/welcome"
                className="bg-gray-500 text-white border py-2 px-3 rounded-md text-lg my-2"
              >
                Profile
              </Link>
            </li>
            <li className="mx-3">
              <a
                onClick={() => signOut()}
                className="bg-red-500 text-white border py-2 px-3 rounded-md text-lg my-2"
              >
                Logout
              </a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
