'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Home() {
  const [value, setValue] = useState("");
  const router = useRouter();
  return (
    <div
      className='min-h-screen flex items-center justify-center'
    >
      <div className="w-[500px] p-5 bg-white space-y-2">
        <h1 className="text-2xl font-black capitalize text-indigo-600">
          Go to notepad
        </h1>
        <div className="">
          <form
            className="space-y-2"
            onSubmit={(event) => {
              if (!!value){
                router.push(`/${value}`)
              }
              event.preventDefault();
            }}
          >
            <input
              type="text"
              className="p-3 border-[1px] border-gray-300 w-full rounded-md"
              onChange={(event) => {
                let val = event.target.value;
                val = val.split("");
                val = val.filter(elem => {
                  if (elem !== ' ' && ((elem >= 'a' && elem <= 'z') || (elem >= 'A' && elem <= 'Z') || (elem >= '0' && elem <= '9')) ){
                    return elem;
                  }
                })
                val = val.join('');
                setValue(val);                
              }}
              placeholder="Enter name of the notepad..."
              value={value}
            />
            {
              value !== '' && <input type="submit" value={`Go to notepad`} className="bg-gradient-to-r from-indigo-400 to-orange-400 px-20 py-3 text-white font-black text-lg rounded-md w-full cursor-pointer" />
            }
          </form>
        </div>
      </div>
    </div>
  )
}
