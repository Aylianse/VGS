import sanitizeHtmlLib from "sanitize-html";

/** Tags Lexical / rich CMS output may include */
const allowedTags = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "br",
  "hr",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "sub",
  "sup",
  "code",
  "pre",
  "span",
  "div",
  "img",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "figure",
  "figcaption",
];

export function sanitizeHtml(html: string) {
  return sanitizeHtmlLib(html, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      li: ["role", "aria-checked", "value"],
      th: ["colspan", "rowspan", "scope"],
      td: ["colspan", "rowspan"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      b: "strong",
      i: "em",
    },
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
