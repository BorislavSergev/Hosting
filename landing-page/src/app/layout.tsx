import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NexusBG — Bulgarian Cloud Hosting',
  description: 'Deploy apps, databases, and workers on European infrastructure. Bulgarian-owned, GDPR compliant, Hetzner-powered.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
