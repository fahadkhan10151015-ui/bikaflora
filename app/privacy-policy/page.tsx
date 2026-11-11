import PageShell from "@/components/PageShell";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({ title: "Privacy Policy", description: "How BikaFlora collects, uses and protects your personal data, in line with Malaysia's Personal Data Protection Act (PDPA).", path: "/privacy-policy" });

export default function Page() {
  return (
    <PageShell title="Privacy Policy" path="/privacy-policy">
      <div className="max-w-3xl prose-bf bg-white rounded-3xl border border-blush-2/70 p-6 md:p-10">
        <p className="!mt-0">{site.name} respects your privacy. This policy explains how we handle your personal data in line with the Personal Data Protection Act 2010 (PDPA) of Malaysia.</p>
        <h2>What we collect</h2>
        <p>When you create an account we store your name, email address and (optionally) phone number. When you order on WhatsApp we receive the details you send us, such as delivery address and recipient details.</p>
        <h2>How we use it</h2>
        <p>We use your data only to process orders, deliver bouquets, reply to enquiries and, if you agree, send you offers. We never sell your data.</p>
        <h2>Account security</h2>
        <p>Accounts are handled by our secure authentication provider. Passwords are encrypted and never visible to us.</p>
        <h2>Your rights</h2>
        <p>You can ask us to view, correct or delete your data at any time by emailing {site.email}.</p>
      </div>
    </PageShell>
  );
}
