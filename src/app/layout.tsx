import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Srazzu Sync — Meetings will never be the same again',
  description: 'AI-powered meeting platform with live transcription, translation, and voice agents. Trilingual support: English, Arabic, Russian.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
