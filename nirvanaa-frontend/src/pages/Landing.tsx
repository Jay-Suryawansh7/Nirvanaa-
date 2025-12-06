import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground">
        <Link className="flex items-center justify-center font-bold text-xl" to="/">
          Auchitya
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/login">
            <Button variant="secondary" size="sm">Login</Button>
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/register">
             <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background flex flex-col items-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Justice Delayed is Justice Denied.
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Auchitya reduces court adjournments by ensuring cases are ready before hearings. 
                  Identify risks, confirm attendance, and streamline the justice process.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90">Get Started</Button>
                </Link>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 Auchitya Justice Platform. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
