import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Account from "@/components/Account";
import SignOutButton from "@/components/SignOutButton";
import martinLogo from '@/public/martin.png'
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log(session)

  if (!session) {
    return (
      <>
      <header className='relative'>

      </header>
      <div className='flex flex-col items-center justify-center'>
        <Image src={martinLogo} alt="Martin Logo" width={300} height={300}/>
        <h1 className='my-8 text-3xl text-center'>Admin Dashboard</h1>
        <div className='flex justify-center'>
          <SignOutButton/>
        </div>
      </div>
      </>
    )
  }

  return <Account/>
}
