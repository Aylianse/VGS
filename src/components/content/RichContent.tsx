import { isHtmlContent, sanitizeHtml } from "@/lib/sanitize-html";

type RichContentProps = {
  content: string;
  className?: string;
};

export function RichContent({ content, className = "" }: RichContentProps) {
  if (!content) return null;

  if (isHtmlContent(content)) {
    const safe = sanitizeHtml(content);
    return (
      <div
        className={`lexical-content ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  return (
    <div className={`lexical-content ${className}`.trim()}>
      {content.split("\n\n").map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}
