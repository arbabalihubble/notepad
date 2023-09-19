'use client'
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { v4 as uid } from 'uuid';
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push(`/${uid()}`);
  });
  return (
    <></>
  )
}
