'use client'

import {signIn} from "next-auth/react";
import Button from "@/components/Button";
import React from "react";

const SignOutButton = () => {
  return (
    <Button onClick={() => signIn()}>Sign in</Button>
  )
}

export default SignOutButton