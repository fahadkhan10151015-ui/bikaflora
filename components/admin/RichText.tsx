"use client";
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Table, Undo2, Redo2, Code2, Quote } from "lucide-react";

/** Word-style editor (headings, bold, lists, links, tables) with an HTML view for advanced edits. */
export default function RichText({ value, onChange, small = false }: { value: string; onChange: (html: string) => void; small?: boolean }) {
  const [htmlMode, setHtmlMode] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), TableKit.configure({ table: { resizable: false } })],
    content: value,
    editorProps: { attributes: { class: `prose-location focus:outline-none px-4 py-3 ${small ? "min-h-[90px]" : "min-h-[260px]"}` } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  // Keep the editor in sync when a different page is opened.
  useEffect(() => { if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false }); }, [value, editor]);

  const Btn = ({ on, title, onClick, children }: { on?: boolean; title: string; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" title={title} aria-label={title} onClick={onClick}
      className={`w-8 h-8 grid place-items-center rounded-lg text-sm ${on ? "bg-brand text-white" : "hover:bg-blush"}`}>{children}</button>
  );
  const link = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (e.g. /category/birthday-flowers or https://…). Leave empty to remove the link.", prev ?? "");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  return (
    <div className="rounded-2xl border border-[#e6e1d8] bg-white overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[#eee8de] bg-cream/70 px-2 py-1.5">
        {!htmlMode && editor && (<>
          {!small && <Btn title="Heading" on={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>}
          {!small && <Btn title="Sub-heading" on={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>}
          <Btn title="Bold" on={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
          <Btn title="Italic" on={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
          <Btn title="Bullet list" on={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
          <Btn title="Numbered list" on={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
          <Btn title="Link" on={editor.isActive("link")} onClick={link}><Link2 className="w-4 h-4" /></Btn>
          {!small && <Btn title="Quote" on={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>}
          {!small && <Btn title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table className="w-4 h-4" /></Btn>}
          <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Btn>
          <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Btn>
        </>)}
        <span className="flex-1" />
        <Btn title={htmlMode ? "Back to editor" : "Edit HTML"} on={htmlMode} onClick={() => setHtmlMode(!htmlMode)}><Code2 className="w-4 h-4" /></Btn>
      </div>
      {htmlMode
        ? <textarea className="w-full font-mono text-xs p-3 min-h-[260px] outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
        : <EditorContent editor={editor} />}
    </div>
  );
}
