import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Space_Grotesk, Space_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const baile = localFont({
  src: [
    { path: '../public/fonts/ft-baile-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile',
  display: 'swap',
});

const baileShadow = localFont({
  src: [
    { path: '../public/fonts/ft-baile-shadow-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-shadow-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-shadow',
  display: 'swap',
});

const baileRounded = localFont({
  src: [
    { path: '../public/fonts/ft-baile-rounded-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-rounded-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-rounded',
  display: 'swap',
});

const baileRoundedShadow = localFont({
  src: [
    { path: '../public/fonts/ft-baile-rounded-shadow-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-rounded-shadow-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-rounded-shadow',
  display: 'swap',
});

const baileScript = localFont({
  src: [
    { path: '../public/fonts/ft-baile-script-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-script-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-script',
  display: 'swap',
});

const baileScriptShadow = localFont({
  src: [
    { path: '../public/fonts/ft-baile-script-shadow-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-script-shadow-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-script-shadow',
  display: 'swap',
});

const baileScriptBulky = localFont({
  src: [
    { path: '../public/fonts/ft-baile-script-bulky-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-script-bulky-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-script-bulky',
  display: 'swap',
});

const baileScriptBulkyShadow = localFont({
  src: [
    { path: '../public/fonts/ft-baile-script-bulky-shadow-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-script-bulky-shadow-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-script-bulky-shadow',
  display: 'swap',
});

const baileWest = localFont({
  src: [
    { path: '../public/fonts/ft-baile-west-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-west-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-west',
  display: 'swap',
});

const baileWestShadow = localFont({
  src: [
    { path: '../public/fonts/ft-baile-west-shadow-regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ft-baile-west-shadow-regular.woff', weight: '400', style: 'normal' },
  ],
  variable: '--font-baile-west-shadow',
  display: 'swap',
});

const SITE_NAME = '3 Letter Daily';
const SITE_DESCRIPTION = 'Small words, big stakes. A daily 3-letter word puzzle — three letters, six tries, one word a day.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.3letterdaily.com'),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: 'https://www.3letterdaily.com',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD22F',
  colorScheme: 'light',
};

const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  spaceGrotesk.variable,
  spaceMono.variable,
  baile.variable,
  baileShadow.variable,
  baileRounded.variable,
  baileRoundedShadow.variable,
  baileScript.variable,
  baileScriptShadow.variable,
  baileScriptBulky.variable,
  baileScriptBulkyShadow.variable,
  baileWest.variable,
  baileWestShadow.variable,
].join(' ');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="kit min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
