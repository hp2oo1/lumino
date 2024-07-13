// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2019, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

/**
 * The namespace for clipboard related functionality.
 */
export namespace ClipboardExt {
  /**
   * Copy text to the system clipboard.
   *
   * @param text - The text to copy to the clipboard.
   */
  export function copyText(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log('Text copied to clipboard');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    } else {
      console.warn('Clipboard API not supported, falling back to execCommand');
      // Fallback for older browsers
      const body = document.body;
      const handler = (event: ClipboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
        event.clipboardData?.setData('text', text);
        body.removeEventListener('copy', handler, true);
      };
      body.addEventListener('copy', handler, true);
      document.execCommand('copy');
    }
  }

  export async function pasteText(
    callback: (text: string) => void
  ): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = await navigator.clipboard.readText();
        callback(text);
      } catch (err) {
        console.error('Could not read text from clipboard: ', err);
      }
    } else {
      console.warn('Clipboard API not supported, manual paste not possible');
      // Manual paste is not possible without user interaction
      // Consider adding a textarea for manual paste as a fallback
    }
  }
}
