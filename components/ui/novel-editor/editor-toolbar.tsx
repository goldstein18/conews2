'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export function EditorToolbar({ editor, disabled = false }: EditorToolbarProps) {
  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border border-b-0 rounded-t-lg bg-muted/50 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
      {/* Text Formatting */}
      <Button
        type="button"
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('code') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Headings */}
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 1 }) ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 2 }) ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('heading', { level: 3 }) ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Lists */}
      <Button
        type="button"
        variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Link & Image */}
      <Button
        type="button"
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        size="sm"
        onClick={addLink}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={addImage}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-8 mx-1" />

      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={disabled || !editor.can().undo()}
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={disabled || !editor.can().redo()}
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}
