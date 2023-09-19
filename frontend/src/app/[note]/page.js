'use client'
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MdOutlineSave } from "react-icons/md";
import { FaLink, FaShareFromSquare } from "react-icons/fa6";
import ActionItem from '../../components/Actions/ActionItem';
import logo from '../../assets/imgs/logo.png'
export default function Page({ params }) {
  const [value, setValue] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0
  });
  const [startValue, setStartValue] = useState('');
  const quillRef = useRef();
  const [changesMade, setChangesMade] = useState(false);
  useEffect(() => {
    const getNote = async () => {
      try {
        const response = await fetch(`http://localhost:8000/notes/${params.note}/`);
        if (response.ok) {
          const data = await response.json();
          setValue(data);
          setStartValue(data);
          setChangesMade(false);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    };
    getNote();
  }, [params.note]);

  const updateNote = async () => {
    setChangesMade(false);
    try {
      const response = await fetch(`http://localhost:8000/notes/${params.note}/`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          note: value
        })
      });
      if (response.ok) {

      } else {
      }
    } catch (error) {
    }
  };

  const handleSave = () => {
    updateNote();
  };
  useEffect(() => {
    function getStats(){
      if (typeof value !== 'string'){
        return;
      }
      const stringWithoutHTML = value.replace(/<\/?[^>]+(>|$)/g, '');
      let words = stringWithoutHTML.split(/[ \t\n\r!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/);
      words = words.filter((word) => {
        if (word !== '') {
          return word;
        }
      });
      const wordCount = words;
      const characterCount = words.join('').length;
      setStats({
        words: wordCount.length,
        characters: characterCount
      })
      if (!changesMade && startValue !== value) {

        setChangesMade(true)
      }
    }
    getStats();
  }, [value])
  const handleQuillRef = (ref) => {
    if (ref) {
      quillRef.current = ref;
      // Focus inside the Quill editor when the ref is available
      quillRef.current.focus();
    }
  };




  return (
    <div className={`container mx-auto min-h-screen py-10 flex flex-col w-full items-center`}>
      <div className="w-full">
        <div className="p-4 py-2 bg-white border-[1px] border-b-0 border-gray-300 flex items-center justify-center w-full space-x-8">
          <div className="">
            <img src={logo.src} width={'100'} />
          </div>
          <div
            className={`text-xl ${changesMade ? 'text-indigo-800 cursor-pointer' : 'text-gray-600 cursor-default'}`}
            onClick={handleSave}
          >
            <MdOutlineSave />
          </div>
          <ActionItem
            Icon={FaLink}
            linkText={'Editable Link'}
            link={`${params.note}`}

          />
          <ActionItem
            Icon={FaShareFromSquare}
            linkText={'Shareable Link'}
            link={`share/${params.note}`}
          />
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="w-full bg-white"
          ref={handleQuillRef}
        />
        <div className="p-4 py-2 bg-white border-[1px] border-t-0 border-gray-300 flex items-center justify-center w-full space-x-8">
          <div className="flex space-x-5 text-xs text-gray-400">
            <div className="">
              <strong>
                Words:
              </strong>
              <pre className='inline-block'> </pre>
              {
                stats.words
              }
            </div>
            <div className="">              
              <strong>
                Characters: 
              </strong>
              <pre className='inline-block'> </pre>
              {
                stats.characters
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
