import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ChartNoAxesCombined, NotebookTabs, Wallet } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              Supercharge your <span className="text-primary">Productivity</span> In VS Code
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Surplus is a VSCode extension that helps you manage your tasks, track expenses, and monitor investments all within VS Code.
            Stay on top of your finances and productivity with intelligent alerts and seamless integrations.
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
                <NotebookTabs className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Task Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize tasks and deadlines directly in VS Code. Get smart reminders to stay on track.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Wallet className="h-12 w-12 text-secondary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Expense Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Log and track your expenses in real time. Get notifications if you`&apos`re nearing your budget limits.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <ChartNoAxesCombined className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Investment Tracker</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your stocks, crypto, and investment portfolio with real-time alerts, all within VS Code.
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

