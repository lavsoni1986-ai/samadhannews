'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
}

// Custom Image Extension — adds data-align and data-size attributes
const InlineImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-align': {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align') || 'center',
        renderHTML: (attributes) => ({ 'data-align': attributes['data-align'] }),
      },
      'data-size': {
        default: 'medium',
        parseHTML: (element) => element.getAttribute('data-size') || 'medium',
        renderHTML: (attributes) => ({ 'data-size': attributes['data-size'] }),
      },
      class: {
        default: 'news-inline-img',
        parseHTML: () => 'news-inline-img',
        renderHTML: () => ({ class: 'news-inline-img' }),
      },
    };
  },
});

// Toolbar button component
function ToolbarButton({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${
        isActive
          ? 'bg-red-600 text-white shadow-sm'
          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
      }`}
    >
      {children}
    </button>
  );
}

// Image Upload Popup Component
function ImageUploadPopup({
  onClose,
  onInsert,
  cloudName,
  uploadPreset,
}: {
  onClose: () => void;
  onInsert: (url: string, align: string, size: string) => void;
  cloudName?: string;
  uploadPreset?: string;
}) {
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
  const [size, setSize] = useState<'small' | 'medium' | 'full'>('small');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset) {
      setError('Settings → Cloudinary Cloud Name और Preset पहले set करें।');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const url: string = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText).secure_url);
            } catch {
              reject(new Error('Invalid response'));
            }
          } else {
            try {
              reject(new Error(JSON.parse(xhr.responseText).error?.message || `Error ${xhr.status}`));
            } catch {
              reject(new Error(`Upload failed: ${xhr.status}`));
            }
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
        xhr.send(formData);
      });

      onInsert(url, align, size);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="absolute z-50 top-full left-0 mt-1 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">📷 Content Image</span>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">✕</button>
      </div>

      {/* Alignment */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Alignment</p>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAlign(a)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                align === a
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-red-400'
              }`}
            >
              {a === 'left' ? '◀ Left' : a === 'center' ? '⬛ Center' : 'Right ▶'}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Size</p>
        <div className="flex gap-2">
          {([
            { val: 'small', label: 'छोटी' },
            { val: 'medium', label: 'मध्यम' },
            { val: 'full', label: 'पूरी' },
          ] as const).map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => setSize(val)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                size === val
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-red-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
            Uploading... {progress}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5">
            <div
              className="bg-red-500 h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload button */}
      {!uploading && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            📤 फ़ोटो Upload करें
          </button>
          <p className="text-center text-xs text-slate-400">
            {align === 'left' || align === 'right'
              ? '💡 Mobile पर auto-center हो जाएगी'
              : ''}
          </p>
        </>
      )}
    </div>
  );
}

export default function TiptapEditor({
  value,
  onChange,
  placeholder,
  cloudinaryCloudName,
  cloudinaryUploadPreset,
}: TiptapEditorProps) {
  const [showImagePopup, setShowImagePopup] = useState(false);
  const imageButtonRef = useRef<HTMLDivElement>(null);

  const extensions = React.useMemo(() => [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: false,
      underline: false,
    }),
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-red-600 underline hover:text-red-800',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
    }),
    InlineImage.configure({ inline: false, allowBase64: false }),
  ], []);

  const editor = useEditor({
    extensions,
    content: value || '',
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class:
          'min-h-[220px] px-4 py-3 prose prose-sm dark:prose-invert max-w-none focus:outline-none text-slate-900 dark:text-white leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g., when editing an existing news item)
  useEffect(() => {
    if (editor && !editor.isDestroyed && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Close popup on outside click
  useEffect(() => {
    if (!showImagePopup) return;
    function handleOutside(e: MouseEvent) {
      if (imageButtonRef.current && !imageButtonRef.current.contains(e.target as Node)) {
        setShowImagePopup(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showImagePopup]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('लिंक URL दर्ज करें:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  function handleInsertImage(url: string, align: string, size: string) {
    if (!editor) return;
    editor.chain().focus().setImage({
      src: url,
      alt: '',
      'data-align': align,
      'data-size': size,
    } as any).run();
  }

  if (!editor) return null;

  return (
    <div className="border border-slate-300 dark:border-slate-600 rounded-xl overflow-visible bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-red-500 transition-shadow">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600 rounded-t-xl">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <div className="w-px bg-slate-300 dark:bg-slate-500 mx-0.5 self-stretch" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px bg-slate-300 dark:bg-slate-500 mx-0.5 self-stretch" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          • सूची
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          1. सूची
        </ToolbarButton>

        <div className="w-px bg-slate-300 dark:bg-slate-500 mx-0.5 self-stretch" />

        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive('link')}
          title="Insert Link"
        >
          🔗 लिंक
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          ✕ क्लियर
        </ToolbarButton>

        <div className="w-px bg-slate-300 dark:bg-slate-500 mx-0.5 self-stretch" />

        {/* Image Insert Button */}
        <div ref={imageButtonRef} className="relative">
          <ToolbarButton
            onClick={() => setShowImagePopup((v) => !v)}
            isActive={showImagePopup}
            title="Content में Image डालें"
          >
            📷 फ़ोटो
          </ToolbarButton>

          {showImagePopup && (
            <ImageUploadPopup
              onClose={() => setShowImagePopup(false)}
              onInsert={handleInsertImage}
              cloudName={cloudinaryCloudName}
              uploadPreset={cloudinaryUploadPreset}
            />
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} />
        {/* Placeholder */}
        {editor.isEmpty && placeholder && (
          <p className="absolute top-3 left-4 text-slate-400 dark:text-slate-500 text-sm pointer-events-none select-none">
            {placeholder}
          </p>
        )}
      </div>
    </div>
  );
}
