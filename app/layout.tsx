import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider"
import {AuthProvider} from "@/lib/contexts/auth-context";
import {ServerNavbar} from "@/components/features/server-navbar";
import {headers} from 'next/headers'

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

// app/layout.tsx
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
        default: 'Block 6 - 하루를 6개의 블록으로',
        template: '%s | Block 6'
    },
    description: '하루를 6개의 시간 블록으로 나누어 효율적으로 관리할 수 있게 도와주는 도구입니다.',
    keywords: ['시간관리', '생산성', '플래닝', '일정관리', '블록식스'],
    authors: [{name: 'Block 6'}],
    openGraph: {
        type: 'website',
        locale: 'ko_KR',
        title: 'Block 6 - 하루를 6개의 블록으로',
        description: '하루를 6개의 시간 블록으로 나누어 효율적으로 관리할 수 있게 도와주는 도구입니다.',
        siteName: 'Block 6'
    }
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = headers()
    const preferredLanguage = headersList.get('x-preferred-language')

    return (
        <html lang={preferredLanguage || 'ko'} suppressHydrationWarning>
        <head>
            <meta name="x-preferred-language" content={preferredLanguage || 'ko'}/>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ServerNavbar/>
                <main className="min-h-screen pb-16 md:pb-8 p-4 md:p-8 pt-16">
                    {children}
                </main>
            </ThemeProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
