"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signup } from './firebase_auth_db';
import { signInWithGooglePopup, signInWithGithubPopup } from '../login/firebase_auth_db';
import { changeUsername } from '../firebase_database';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const result = await signup(username, password);
      if (result.success) {
        // Successful login
        changeUsername(username);
        setIsLoading(false);
        router.push('/'); // Navigate to main page
      } else {
        setIsLoading(false);
        // Handle error case if needed
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error during signup:', error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Get started with Surplus</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe" required disabled={isLoading} />
              </div>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading} />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <Button className="w-full mt-2" variant="outline" onClick={async () => {
                try {
                  const result = await signInWithGooglePopup();
                  if (result.success) {
                    router.push('/');
                  } else {
                    console.error(result.errorMessage || 'An error occurred during Google login');
                  }
                } catch (error) {

                  console.error('Error during Google login:', error);
                }
              }}>
                <FcGoogle /> Sign up with Google 
              </Button>
              <Button className="w-full mt-2" variant="outline" onClick={async () => {
                try {
                  const result = await signInWithGithubPopup();
                  if (result.success) {
                    router.push('/');
                  } else {
                    console.error(result.errorMessage || 'An error occurred during Github login');
                  }
                } catch (error) {

                  console.error('Error during Github login:', error);
                }
              }}>
                <FaGithub /> Sign up with Github 
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


