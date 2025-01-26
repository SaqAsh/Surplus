"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function Redirect() {
  const {token} = useAuth();

  useEffect(() => {
    if (!token) {
      console.error('No token available for redirect');
      return;
    }

    console.log('Redirecting with token:', token);
    const timer = setTimeout(() => {
      const vsCodeUri = `vscode://surplus?token=${encodeURIComponent(token)}`;
      console.log('Redirecting to:', vsCodeUri);
      window.location.href = vsCodeUri;
    }, 3000);

    return () => clearTimeout(timer);
  }, [token]);

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
              onClick={() => {
                const vsCodeUri = `vscode://surplus?token=${encodeURIComponent(token!)}`;
                window.location.href = vsCodeUri;
              }}
            >
              here
            </Button>
          </p>
        </div>
      </main>
    </div>
  )
}

