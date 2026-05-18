interface RichTextDisplayProps {
  html?: string;
  className?: string;
}

export default function RichTextDisplay({
  html,
  className = "",
}: RichTextDisplayProps) {
  if (!html) return null;
  return (
    <div
      className={`prose prose-sm max-w-none text-slate-600 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
