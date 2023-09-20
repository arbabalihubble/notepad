'use client'
import React, { useEffect, useRef, useState } from 'react';
import { FaShareFromSquare, FaRegHandPointer } from "react-icons/fa6";
import ActionItem from '@/components/Actions/ActionItem';
import MarkdownPreview from '@uiw/react-markdown-preview';

import logo from '../../../assets/imgs/logo.png'


export default function Page({ params }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [value, setValue] = useState('');;
  const divRef = useRef(null);
  const handleSelectAll = () => {
    if (divRef.current) {
      const range = document.createRange();
      range.selectNodeContents(divRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };
  useEffect(() => {
    const getNote = async () => {
      try {
        const response = await fetch(`${apiUrl}/notes/shareable/${params.note}/`);
        if (response.ok) {
          const data = await response.json();
          setValue(data.note);
        }
      } catch (error) {
      }
    };
    getNote();
  }, []);
  return (
    <div className={`container mx-auto min-h-screen py-10 flex w-full items-center`}>
      <div className="w-full">
        <div className="p-4 py-2 bg-white border-[1px] border-b-0 border-gray-300 flex items-center justify-center w-full space-x-8">
          <div className="">
            <img src={logo.src} width={'100'} />
          </div>
          <ActionItem
            Icon={FaShareFromSquare}
            linkText={'Shareable Link'}
            link={`share/${params.note}`}
          />
          <div
            className="text-gray-600 cursor-pointer hover:text-indigo-800 hover:font-semibold flex items-center space-x-2"
            onClick={handleSelectAll}
          >
            <FaRegHandPointer className='inline-block'/>
            <p>
              Select All
            </p>

          </div>
        </div>
        <div
          ref={divRef}
          className="w-full bg-white h-[70vh] p-5 overflow-y-auto border-2 border-gray-200 text-gray-700"
        >
          <div data-color-mode="light">
            <div className="wmde-markdown-var"> </div>
            <MarkdownPreview source={value} />
          </div>
        </div>
      </div>
    </div>
  );
}
