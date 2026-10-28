import React, { useEffect, useRef, useState } from 'react';
import { buildWhatsAppLink } from '../utils/whatsapp';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18.2 14.2c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.1-.8.1-.2.2-.7.9-.9 1.1-.2.2-.4.2-.7.1-.9-.5-1.9-1.3-2.7-2.3-.7-.9-1.2-1.8-1.3-2.1-.1-.3 0-.5.1-.7l.2-.3c.1-.1.2-.3.3-.5.1-.1.1-.3 0-.5-.1-.2-.8-1.8-.9-2.4-.2-.5-.4-.4-.7-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.5 3.9 6.2 5.2.9.4 1.6.6 2.2.8.9.3 1.8.2 2.5.1.8-.1 2.4-1 2.8-2 .4-1 .4-1.9.3-2.1-.1-.2-.3-.2-.6-.4zM12 2.1c-5.5 0-10 4.1-10 9.1 0 1.7.5 3.3 1.4 4.7L1.7 22l6.2-1.7c1.4.8 3 .9 4.6.9 5.5 0 10-4.1 10-9.1S17.5 2.1 12 2.1z" fill="currentColor" />
    </svg>
  );
}

export default function WhatsAppFab({ number, messages = [] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const previousFocusRef = useRef(null);

  const cleanNumber = typeof number === 'string' ? number.trim() : '';
  if (!cleanNumber || cleanNumber.startsWith('[TODO')) return null;

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (!popoverRef.current || !buttonRef.current) return;
      if (!popoverRef.current.contains(target) && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !popoverRef.current) return;

      const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(popoverRef.current.querySelectorAll(focusableSelector));
      if (!focusable.length) return;

      const currentIndex = focusable.indexOf(document.activeElement);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    previousFocusRef.current = document.activeElement;
    const focusable = popoverRef.current.querySelectorAll('a[href], button:not([disabled])');
    if (focusable.length) {
      requestAnimationFrame(() => focusable[0].focus());
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  const openLink = buildWhatsAppLink(cleanNumber) || '#';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
        aria-expanded={open}
        aria-controls="whatsapp-fab-popover"
        onClick={() => setOpen((value) => !value)}
      >
        <WhatsAppIcon />
      </button>

      {open && (
        <div id="whatsapp-fab-popover" ref={popoverRef} className="whatsapp-fab__popover" role="dialog" aria-label="Choose a WhatsApp topic">
          <div className="whatsapp-fab__popover-header">
            <span className="whatsapp-chooser__icon" aria-hidden="true"><WhatsAppIcon /></span>
            <strong>Chat on WhatsApp</strong>
          </div>
          <div className="whatsapp-popover__list">
            {messages.map((item) => {
              const href = buildWhatsAppLink(cleanNumber, item.message);
              if (!href) return null;
              return (
                <a key={item.id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Message us on WhatsApp about ${item.label.toLowerCase()}, opens in a new tab`}>
                  {item.label}
                </a>
              );
            })}
            <a href={openLink} target="_blank" rel="noopener noreferrer">Open a blank chat</a>
          </div>
        </div>
      )}
    </>
  );
}
