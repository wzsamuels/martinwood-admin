import './globals.css'
import { Inter } from 'next/font/google'
import AuthContext from "@/app/AuthContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Martinwood Admin'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <AuthContext>
        {children}
      </AuthContext>
      </body>
    </html>
  )
}
