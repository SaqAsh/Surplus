import { ThemeProvider } from "@/components/theme-provider"
import { fontPoppins } from "@/lib/fonts"
import "./globals.css"

export const metadata = {
  title: "Surplus - TypeScript VSCode Extension",
  description: "Enhance your TypeScript development experience with Surplus",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontPoppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

