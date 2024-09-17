"use client"

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useSession } from "next-auth/react";

export default function Home() {

  const {data: session} = useSession;

  return (
    <main>
      <Navbar session={session}/>
      <div className='container mx-auto py-5'>
        <h3>WelcomePage to Next Auth</h3>
        <hr className='my-3'></hr>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, ipsam iure est soluta molestiae repellendus harum. Totam beatae odio in aut temporibus molestiae, asperiores hic quas animi eveniet minus illum!</p>
        <hr className='my-3' />        
      </div>
    </main>
  );
}
