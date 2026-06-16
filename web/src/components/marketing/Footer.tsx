import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Product: [
    { label: "Features", href: "/product" },
    { label: "Pricing", href: "/pricing" },
    { label: "Examples", href: "/examples" },
    { label: "FAQ", href: "/faq" },
  ],
  Resources: [
    { label: "MEDDIC explained", href: "#" },
    { label: "Command of the Message", href: "#" },
    { label: "Documentation", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo size="sm" />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Structured sales messaging for B2B SaaS teams. One intake, one
              source of truth, every asset aligned.
            </p>
          </div>
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="label-xs mb-3">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} NarrativeKit. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
