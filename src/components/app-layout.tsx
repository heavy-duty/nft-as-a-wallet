import { AppFooter } from '@/components/app-footer'
import { AppHeader } from '@/components/app-header'
import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <AppFooter />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
