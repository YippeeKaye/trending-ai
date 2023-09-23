import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from '@/components/ui/mode-toggle'
 
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI popular APIs',
  description: 'Analytics on trending AI APIs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ModeToggle className="absolute top-6 right-6"/>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
