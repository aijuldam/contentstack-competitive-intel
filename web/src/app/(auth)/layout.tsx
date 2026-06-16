import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="flex h-14 items-center border-b border-border bg-background px-4 sm:px-6">
        <Link href="/">
          <Logo size="sm" />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
        {" · "}
        <Link href="/terms" className="hover:text-foreground">Terms</Link>
      </footer>
    </div>
  );
}
