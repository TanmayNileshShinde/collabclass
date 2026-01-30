import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'react-datepicker/dist/react-datepicker.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          layout: {
            socialButtonsVariant: 'iconButton',
            logoImageUrl: '/icons/cclogo.png',
          },
          variables: {
            colorText: '#fff',
            colorPrimary: '#6B46C1',
            colorBackground: '#0A0A0A',
            colorInputBackground: '#1A1A1A',
            colorInputText: '#fff',
          },
        }}
      >
        <App />
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);
