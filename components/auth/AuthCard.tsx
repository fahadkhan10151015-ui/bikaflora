import Link from "next/link";
import Photo from "@/components/ui/Photo";
import { siteImages } from "@/lib/images";
import { authConfigured } from "@/lib/supabase-config";

export default function AuthCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="container-x py-10 md:py-16">
      <div className="grid lg:grid-cols-2 bg-white rounded-[2rem] border border-blush-2/70 overflow-hidden max-w-5xl mx-auto shadow-sm">
        <div className="relative hidden lg:block min-h-[560px] bg-blush">
          <Photo src={siteImages.heroPoster} alt="" sizes="50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-rose-950/70 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-3xl font-semibold">Welcome to BikaFlora</h2>
            <p className="mt-2 text-white/85 text-sm">Save favourite bouquets and order faster on WhatsApp with your details filled in.</p>
          </div>
        </div>
        <div className="p-7 md:p-12">
          <h1 className="text-3xl font-semibold">{title}</h1>
          {sub && <p className="mt-2 text-muted text-sm">{sub}</p>}
          {!authConfigured && (
            <div className="mt-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm p-4">
              Accounts are not switched on yet (Supabase keys missing). You can still <Link href="/shop" className="underline">order on WhatsApp</Link> without an account.
            </div>
          )}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Alert({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  return <div className={`rounded-xl p-3 text-sm ${kind === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`}>{children}</div>;
}
