'use client'
import React, { useEffect, useState } from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Quill.register();
export default function Page({params}) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const getNote = async () => {
      const response = await fetch(`http://localhost:8000/notes/${params.note}/`)
      if (response.ok){
        const data = await response.json();
        setValue(data)
      }
    }
    getNote();
  }, [])
  const updateNote = async () => {
    const response = await fetch(`http://localhost:8000/notes/${params.note}/`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        note: value
      })
    })
  }
  return (
    <div className='container mx-auto min-h-screen py-10 space-y-4'>
      <div className="">
        <button
          className='bg-gradient-to-r from-indigo-400 to-orange-400 px-20 py-3 text-white font-black text-2xl'
          onClick={() => {
            updateNote();
          }}
        >
          Save
        </button>
      </div>
      <ReactQuill theme="snow" value={value} onChange={setValue} className='w-full bg-white'/>
    </div>
  );
}