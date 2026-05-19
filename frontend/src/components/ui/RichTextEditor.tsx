import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect } from "react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
    ],
    content: value || "",
    editable: !disabled,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML())
      editor.commands.setContent(value || "");
  }, [value, editor]);

  if (!editor) return null;

  const toolBtn = (active: boolean) =>
    `p-1.5 rounded-lg transition-colors text-sm ${
      active
        ? "bg-blue-100 text-blue-700"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    }`;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        disabled
          ? "bg-slate-50 border-slate-200"
          : "border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
      }`}
    >
      {!disabled && (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={toolBtn(editor.isActive("bold"))}
            title="Negrita"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={toolBtn(editor.isActive("italic"))}
            title="Cursiva"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={toolBtn(editor.isActive("heading", { level: 2 }))}
            title="Título"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-1" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={toolBtn(editor.isActive("bulletList"))}
            title="Lista con viñetas"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={toolBtn(editor.isActive("orderedList"))}
            title="Lista numerada"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="px-4 py-3 min-h-25 text-sm"
      />
      <style>{`
        .ProseMirror { outline: none; min-height: 80px; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .ProseMirror li { margin: 0.25em 0; }
        .ProseMirror p { margin: 0.5em 0; }
        .ProseMirror h2 { font-size: 1.15em; font-weight: 600; margin: 0.75em 0 0.5em; color: #1e293b; }
      `}</style>
    </div>
  );
}

export default RichTextEditor;
