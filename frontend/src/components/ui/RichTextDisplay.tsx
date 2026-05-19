interface RichTextDisplayProps {
  html?: string;
  className?: string;
}

export function RichTextDisplay({
  html,
  className = "",
}: RichTextDisplayProps) {
  if (!html) return null;
  return (
    <div
      className={`prose prose-sm max-w-none prose-slate prose-headings:font-semibold prose-a:text-blue-600 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default RichTextDisplay;
