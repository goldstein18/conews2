'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { EditorToolbar } from './editor-toolbar';
import './styles.css';

interface NovelEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export function NovelEditor({
  content = '',
  onChange,
  placeholder = 'Start writing your article...',
  disabled = false,
  className = '',
  minHeight = '400px'
}: NovelEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto'
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer'
        }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`novel-editor-wrapper ${className}`}>
      <EditorToolbar editor={editor} disabled={disabled} />
      <EditorContent
        editor={editor}
        className="novel-editor-content"
        style={{ minHeight }}
      />
    </div>
  );
}
