import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingBlock from './components/BookingBlock';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('youbookpro-booking-root');
  if (container) {
    createRoot(container).render(<BookingBlock />);
  }
});
