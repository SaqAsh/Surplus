"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { login , signInWithGooglePopup} from './firebase_auth_db';
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation"
import { useState } from "react"
import { changeUsername } from '../firebase_database';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(username, password);
      if (result.success) {
        // Successful login
        changeUsername(username);
        setIsLoading(false);
        router.push('/'); // Navigate to main page
      } else {
        setIsLoading(false);
        setErrorMessage(result.message || 
          'An error occurred during login. Please try again.');
      }
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('An error occurred during login. Please try again.');
      console.error('Error during login:', error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Login to your Surplus account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" 
                required 
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button className="w-full mt-2" variant="outline" onClick={async () => {
                try {
                  const result = await signInWithGooglePopup();
                  if (result.success) {
                    router.push('/');
                  } else {
                    setErrorMessage(result.errorMessage || 'An error occurred during Google login');
                  }
                } catch (error) {
                  setErrorMessage('An error occurred during Google login');
                  console.error('Error during Google login:', error);
                }
              }}>
                <FcGoogle /> Login with Google
              </Button>
              {errorMessage && ( // Render Error Message if one is provided. Otherwise, render nothing
                <div className="space-y-2">
                    {errorMessage}
                </div>
              )}
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
