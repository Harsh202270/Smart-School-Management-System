/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Universal print helper engineered specifically for browser iframe sandboxes.
 * Uses window.focus() and native window.print() combined with targeted print stylesheets.
 */
export function triggerPrint(elementId?: string) {
  try {
    // 1. Focus the current window/iframe so browser print commands are received
    window.focus();

    // 2. Mark body with printing state
    document.body.classList.add('app-printing-in-progress');

    // 3. Mark the specific document to isolate it for the printer
    let targetEl: HTMLElement | null = null;
    if (elementId) {
      targetEl = document.getElementById(elementId);
      if (targetEl) {
        targetEl.classList.add('printable-document-active');
      }
    }

    // 4. Also mark all general printable documents if no specific element was given
    const printableCards = document.querySelectorAll('.printable-document');
    printableCards.forEach((c) => c.classList.add('printable-document-active'));

    // 5. Invoke browser print
    window.print();

    // 6. Cleanup after print dialog returns
    const cleanup = () => {
      document.body.classList.remove('app-printing-in-progress');
      if (targetEl) {
        targetEl.classList.remove('printable-document-active');
      }
      printableCards.forEach((c) => c.classList.remove('printable-document-active'));
    };

    window.addEventListener('afterprint', cleanup, { once: true });
    setTimeout(cleanup, 1200);
  } catch (err) {
    console.warn('Error during print invocation:', err);
    try {
      window.focus();
      window.print();
    } catch (e) {
      console.error('Direct window.print fallback failed:', e);
    }
  }
}
