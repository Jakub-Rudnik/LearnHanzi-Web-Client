import { NavLink } from "react-router";
import Logo from "@/components/logo.tsx";
import { Button } from "@/components/ui/button.tsx";
import PageMeta from "@/components/seo/page-meta.tsx";

export default function LandingPage() {
  return (
    <>
      <PageMeta
        title="LearnHanzi - Learn Hanzi the easy way"
        description="A temporary landing page for LearnHanzi. Start learning Chinese characters with focused practice and track your progress."
      />

      <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <header className="flex justify-center">
            <Logo to="/" />
          </header>

          <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 rounded-2xl border bg-card px-6 py-10 text-center shadow-sm sm:px-10 sm:py-14">
            <p className="mb-3 text-sm font-medium text-primary">
              Temporary landing page
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Learn Hanzi with daily practice and clear progress.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
              Build your Chinese character knowledge with flashcards, dictionary
              lookups, and friendly competition.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <NavLink to="/signup">Create account</NavLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <NavLink to="/login">Log in</NavLink>
              </Button>
            </div>
          </section>
        </div>

        <div className="flex flex-col items-center justify-center p-10">
          <Button className="p-8 text-2xl" asChild>
            <NavLink to="/home">Go to app</NavLink>
          </Button>
        </div>
      </main>
    </>
  );
}
