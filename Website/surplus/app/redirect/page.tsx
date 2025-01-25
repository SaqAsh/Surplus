"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Redirect() {
  useEffect(() => {
    // Simulate redirect delay
    const timer = setTimeout(() => {
      window.location.href = "vscode:extension/surplus"
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Redirecting to Surplus Extension...</h1>
          <p className="text-muted-foreground">
            You will be redirected automatically. If nothing happens, click{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => (window.location.href = "vscode:extension/surplus")}
            >
              here
            </Button>
          </p>
        </div>
      </main>
    </div>
  )
}

