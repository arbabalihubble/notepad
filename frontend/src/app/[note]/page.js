'use client'
import React, { useEffect, useRef, useState } from 'react';
import { FaLink, FaShareFromSquare } from "react-icons/fa6";
import ActionItem from '../../components/Actions/ActionItem';
import logo from '../../assets/imgs/logo.png'
import { io } from "socket.io-client";
import { getWordCharacterCount } from '@/lib/helper/helper';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const socket = io(process.env.NEXT_PUBLIC_API_URL);
export default function Page({ params }) {
  const [value, setValue] = useState('');
  const [shareable, setShareable] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0
  });
  const [startValue, setStartValue] = useState('');
  const quillRef = useRef();
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    const roomName = params.note;
    socket.emit("join_room", roomName);
    socket.on("note_updated", (data) => {
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    socket.on("note_updated", (data) => {
    });
  });

  useEffect(() => {
    const getNote = async () => {
      try {
        const response = await fetch(`${apiUrl}/notes/${params.note}`);
        if (response.ok) {
          const data = await response.json();
          setValue(data.note);
          setShareable(data.shareable);
          setStartValue(data.note);
          setChangesMade(false);
        }
      } catch (error) {
      }
    };
    getNote();
  }, []);
  useEffect(() => {
    function getStats(){
      setStats(getWordCharacterCount(value))
      if (!changesMade && startValue !== value) {

        setChangesMade(true)
      }
    }
    getStats();
    socket.emit("note_updated", {
      slug: params.note,
      value: value
    });
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
          <ActionItem
            Icon={FaLink}
            linkText={'Editable Link'}
            link={`${params.note}`}

          />
          <ActionItem
            Icon={FaShareFromSquare}
            linkText={'Shareable Link'}
            link={`share/${shareable}`}
          />
        </div>
        {/* <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="w-full bg-white"
          ref={handleQuillRef}
        /> */}
        <div>
          <div data-color-mode="light">
            <div className="wmde-markdown-var"> </div>
            <MDEditor
              value={value}
              onChange={setValue}
              height={600}
              overflow={false}
              autoFocus={true}
              
            />
          </div>
        </div>
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
