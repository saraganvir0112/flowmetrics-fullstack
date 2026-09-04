import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes blog HTML content to prevent XSS.
 * Explicitly disallows <script>, <iframe>, and all event-handler attributes (onclick, onerror, etc.).
 */
export const sanitizeBlogContent = (dirtyHtml: string): string => {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'pre',
      'hr',
      'br',
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
  });
};
