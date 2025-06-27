import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingBlock from './components/BookingBlock';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('youbookpro-booking-root');
  if (container) {
    const buttonColor = container.dataset.buttonColor || '#0073aa';
    const buttonTextColor = container.dataset.buttonTextColor || '#ffffff';
    const buttonHoverColor = container.dataset.buttonHoverColor || '#005177';
    const buttonHoverTextColor = container.dataset.buttonHoverTextColor || '#ffffff';

    createRoot(container).render(
      <BookingBlock
        buttonColor={buttonColor}
        buttonTextColor={buttonTextColor}
        buttonHoverColor={buttonHoverColor}
        buttonHoverTextColor={buttonHoverTextColor}
      />
    );
  }
});
