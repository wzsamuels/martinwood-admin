import React from "react";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Account from "@/components/Account";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  console.log(session)

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <h1 className='my-8 text-3xl text-center'>Not signed in</h1>
        <div className='flex justify-center'>
          <SignOutButton/>
        </div>
      </div>
    )
  }

  return <Account/>
}
