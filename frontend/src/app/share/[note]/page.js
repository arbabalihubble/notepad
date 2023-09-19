'use client'
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdOutlineSave } from "react-icons/md";
import { FaLink, FaShareFromSquare, FaRegHandPointer } from "react-icons/fa6";
import ActionItem from '@/components/Actions/ActionItem';
export default function Page({ params }) {
  const [value, setValue] = useState('');
  const [startValue, setStartValue] = useState('');
  const [changesMade, setChangesMade] = useState(false);
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
        const response = await fetch(`http://chat42:8000/notes/${params.note}/`);
        if (response.ok) {
          const data = await response.json();
          console.log('data: ', data);
          setValue(data);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };
    getNote();
  }, []);


  useEffect(() => {
    if (!changesMade && startValue !== value) {

      setChangesMade(true)
    }
  }, [value])

  const handleKeyPress = (event) => {
    if (event.ctrlKey && (event.key === 's' || event.key === 'S')) {
      event.preventDefault();
      updateNote();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  return (
    <div className={`container mx-auto min-h-screen py-10 flex w-full items-center`}>
      <div className="w-full">
        <div className="p-4 py-2 bg-white border-[1px] border-b-0 border-gray-300 flex items-center justify-center w-full space-x-8">        
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
          className="w-full bg-white h-[70vh] p-5 overflow-y-auto border-2 border-gray-200 text-gray-700" dangerouslySetInnerHTML={{__html: `<p class='text-xs text-gray-400 mb-5 font-normal'>Writtern by Anonymous</p>${value}` }}
        >
        </div>
      </div>
    </div>
  );
}
