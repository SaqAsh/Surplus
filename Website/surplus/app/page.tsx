import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Code2, Zap, Shield, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              Supercharge your <span className="text-primary">TypeScript</span> development
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Surplus is a powerful VSCode extension that enhances your TypeScript development experience with
              intelligent features and seamless integration.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="vscode:extension/surplus">Install Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Code2 className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Smart Completions</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent code suggestions that understand your project context.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Zap className="h-12 w-12 text-secondary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Quick Fixes</h3>
                  <p className="text-sm text-muted-foreground">
                    Instant solutions for common TypeScript issues and patterns.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Shield className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Type Safety</h3>
                  <p className="text-sm text-muted-foreground">
                    Enhanced type checking and validation for robust code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

