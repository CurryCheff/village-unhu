import React from 'react';
import { buildWhatsAppLink } from '../utils/whatsapp';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18.2 14.2c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.1-.8.1-.2.2-.7.9-.9 1.1-.2.2-.4.2-.7.1-.9-.5-1.9-1.3-2.7-2.3-.7-.9-1.2-1.8-1.3-2.1-.1-.3 0-.5.1-.7l.2-.3c.1-.1.2-.3.3-.5.1-.1.1-.3 0-.5-.1-.2-.8-1.8-.9-2.4-.2-.5-.4-.4-.7-.4h-.5c-.2 0-.5.1-.8.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.4 1.4 3.6.2.2 2.5 3.9 6.2 5.2.9.4 1.6.6 2.2.8.9.3 1.8.2 2.5.1.8-.1 2.4-1 2.8-2 .4-1 .4-1.9.3-2.1-.1-.2-.3-.2-.6-.4zM12 2.1c-5.5 0-10 4.1-10 9.1 0 1.7.5 3.3 1.4 4.7L1.7 22l6.2-1.7c1.4.8 3 .9 4.6.9 5.5 0 10-4.1 10-9.1S17.5 2.1 12 2.1z" fill="currentColor" />
    </svg>
  );
}

export default function WhatsAppChooser({ number, messages = [] }) {
  const cleanNumber = typeof number === 'string' ? number.trim() : '';
  if (!cleanNumber || cleanNumber.startsWith('[TODO')) return null;

  return (
    <div className="whatsapp-chooser" aria-label="WhatsApp contact options">
      <div className="whatsapp-chooser__header">
        <span className="whatsapp-chooser__icon" aria-hidden="true"><WhatsAppIcon /></span>
        <div>
          <h3>Chat with us on WhatsApp</h3>
          <p>Pick a topic and we’ll open WhatsApp with a message ready to send.</p>
        </div>
      </div>

      <div className="whatsapp-chooser__list" role="list">
        {messages.map((item) => {
          const href = buildWhatsAppLink(cleanNumber, item.message);
          if (!href) return null;
          return (
            <a
              key={item.id}
              className="whatsapp-chooser__item"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Message us on WhatsApp about ${item.label.toLowerCase()}, opens in a new tab`}
            >
              {item.label}
            </a>
          );
        })}
      </div>

      <a
        className="whatsapp-chooser__blank"
        href={buildWhatsAppLink(cleanNumber) || '#'}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open a blank WhatsApp chat in a new tab"
      >
        Or open a blank chat
      </a>
    </div>
  );
}
