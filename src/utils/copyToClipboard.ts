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
    let el: HTMLDivElement | null = null;
    try {
      el = document.createElement('div');
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
      return success;
    } catch (err) {
      console.error('Failed to copy rich text:', err);
      return false;
    } finally {
      // Remove the temp node even if execCommand or the selection logic throws,
      // so the error path doesn't orphan a detached element in the DOM.
      if (el && el.parentNode) document.body.removeChild(el);
    }
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Declared outside the try so the finally can clean it up. Stays null on the
  // primary navigator.clipboard path, where no temp node is ever created.
  let textArea: HTMLTextAreaElement | null = null;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    textArea = document.createElement('textarea');
    textArea.value = text;

    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    return document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  } finally {
    // No-op on the primary path (textArea null); on the fallback path this
    // removes the temp node even if execCommand throws.
    if (textArea && textArea.parentNode) document.body.removeChild(textArea);
  }
};