import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  disabled,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-1.5 rounded transition-colors ${active ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`;

  return (
    <div
      className={`rounded-xl border ${disabled ? "bg-slate-50 border-slate-200" : "border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"} overflow-hidden transition-all`}
    >
      {!disabled && (
        <div className="flex gap-1 p-2 border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={btn(editor.isActive("bold"))}
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={btn(editor.isActive("italic"))}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={btn(editor.isActive("bulletList"))}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={btn(editor.isActive("orderedList"))}
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="px-4 py-2.5 min-h-[100px] prose prose-sm max-w-none outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[80px]"
      />
    </div>
  );
}
