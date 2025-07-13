'use client'
import React, { useCallback, useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Type,
  Minus,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Safe to use document
      const el = document.getElementById('something');
      console.log(el);
    }
  }, []);


  // Execute formatting commands
  const executeCommand = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current) return;
      try {
        editorRef.current.focus();
        document.execCommand(command, false, value);
        // Get the updated HTML content and clean it
        const htmlContent = editorRef.current.innerHTML;
        onChange(cleanHtml(htmlContent));
      } catch (error) {
        console.error('Error executing command:', error);
      }
    },
    [onChange]
  );

  // Clean HTML to ensure proper structure
  const cleanHtml = (html: string): string => {
    return html
      .replace(/<p><br><\/p>/g, '<p></p>')
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<div><br><\/div>/g, '')
      .replace(/<div>\s*<\/div>/g, '')
      .replace(/<br\s*\/?>/g, '<br>')
      .trim();
  };

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      onChange(cleanHtml(htmlContent));
    }
  }, [onChange]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editorRef.current && !isEditorFocused) {
      if (editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content || '';
      }
    }
  }, [content, isEditorFocused]);

  // Handle paste events
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Handle key events for better formatting
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle Enter key to ensure proper paragraph structure
      if (e.key === 'Enter' && !e.shiftKey) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const currentElement = range.commonAncestorContainer.parentElement;

          // If we're in a heading, create a new paragraph
          if (currentElement && /^H[1-6]$/.test(currentElement.tagName)) {
            e.preventDefault();
            executeCommand('formatBlock', 'p');
            executeCommand('insertHTML', '<br>');
          }
        }
      }
    },
    [executeCommand]
  );

  // Check if command is active
  const isCommandActive = (command: string, value?: string): boolean => {
    try {
      if (value) {
        return document.queryCommandValue(command) === value;
      }
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      executeCommand('insertHTML', `<p><img src="${url}" alt="Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;"></p>`);
    }
  };

  const addLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      alert('Please select some text first');
      return;
    }

    const url = window.prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const toolbarButtons = [
    {
      icon: Type,
      label: 'Paragraph',
      action: () => executeCommand('formatBlock', 'p'),
      isActive: isCommandActive('formatBlock', 'p'),
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => executeCommand('formatBlock', 'h1'),
      isActive: isCommandActive('formatBlock', 'h1'),
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      action: () => executeCommand('formatBlock', 'h2'),
      isActive: isCommandActive('formatBlock', 'h2'),
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => executeCommand('formatBlock', 'h3'),
      isActive: isCommandActive('formatBlock', 'h3'),
    },
    { type: 'divider' },
    {
      icon: Bold,
      label: 'Bold',
      action: () => executeCommand('bold'),
      isActive: isCommandActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => executeCommand('italic'),
      isActive: isCommandActive('italic'),
    },
    {
      icon: Code,
      label: 'Code',
      action: () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          executeCommand('insertHTML', `<code>${selection.toString()}</code>`);
        }
      },
      isActive: false,
    },
    { type: 'divider' },
    {
      icon: List,
      label: 'Bullet List',
      action: () => executeCommand('insertUnorderedList'),
      isActive: isCommandActive('insertUnorderedList'),
    },
    {
      icon: ListOrdered,
      label: 'Ordered List',
      action: () => executeCommand('insertOrderedList'),
      isActive: isCommandActive('insertOrderedList'),
    },
    { type: 'divider' },
    {
      icon: Quote,
      label: 'Blockquote',
      action: () => executeCommand('formatBlock', 'blockquote'),
      isActive: isCommandActive('formatBlock', 'blockquote'),
    },
    {
      icon: LinkIcon,
      label: 'Link',
      action: addLink,
      isActive: isCommandActive('createLink'),
    },
    {
      icon: ImageIcon,
      label: 'Image',
      action: addImage,
      isActive: false,
    },
    {
      icon: Minus,
      label: 'Horizontal Rule',
      action: () => executeCommand('insertHTML', '<hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">'),
      isActive: false,
    },
    { type: 'divider' },
    {
      icon: Undo,
      label: 'Undo',
      action: () => executeCommand('undo'),
      isActive: false,
      disabled: !document.queryCommandEnabled('undo'),
    },
    {
      icon: Redo,
      label: 'Redo',
      action: () => executeCommand('redo'),
      isActive: false,
      disabled: !document.queryCommandEnabled('redo'),
    },
  ];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            if (button.type === 'divider') {
              return <div key={index} className="w-px h-6 bg-gray-300 mx-2" />;
            }

            const Icon = button.icon;
            if (!Icon) return null;

            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                disabled={button.disabled}
                className={`p-2 rounded transition-colors ${button.isActive
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  } ${button.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                  }`}
                title={button.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleContentChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
          className="w-full min-h-[400px] p-6 focus:outline-none text-base leading-relaxed prose prose-lg max-w-none
            prose-headings:font-semibold prose-headings:text-gray-900 prose-headings:leading-tight 
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline 
            prose-strong:font-semibold prose-strong:text-gray-900 
            prose-ul:my-6 prose-ol:my-6 prose-li:my-2 
            prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-600 
            prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
            [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl
            [&_hr]:my-8 [&_hr]:border-gray-200
            [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6"
          style={{ minHeight: '400px' }}
        />

        {/* Placeholder */}
        {!content && (
          <div className="absolute top-6 left-6 text-gray-400 pointer-events-none select-none">
            Start writing your article...
          </div>
        )}
      </div>
    </div>
  );
}