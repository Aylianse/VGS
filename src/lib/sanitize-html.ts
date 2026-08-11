import sanitizeHtmlLib from "sanitize-html";

const allowedTags = [
  ...sanitizeHtmlLib.defaults.allowedTags,
  "img",
  "h1",
  "h2",
  "h3",
  "blockquote",
];

export function sanitizeHtml(html: string) {
  return sanitizeHtmlLib(html, {
    allowedTags,
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

export function isHtmlContent(value: string) {
  return /<[a-z][\s\S]*>/i.test(value);
}

export function stripHtml(html: string) {
  return sanitizeHtmlLib(html, { allowedTags: [], allowedAttributes: {} }).trim();
}

export function plainTextPreview(content: string, maxLength = 160) {
  const text = isHtmlContent(content) ? stripHtml(content) : content;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
