export const copyRichTextToClipboard = async (html: string): Promise<boolean> => {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([html.replace(/<[^>]*>/g, '')], { type: 'text/plain' }),
      }),
    ]);
    return true;
  } catch {
    // Fallback: render into a temporary element, select, and copy
    try {
      const el = document.createElement('div');
      el.innerHTML = html;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);

      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      const success = document.execCommand('copy');
      selection?.removeAllRanges();
      document.body.removeChild(el);
      return success;
    } catch (err) {
      console.error('Failed to copy rich text:', err);
      return false;
    }
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};