import AuthCard from "@/components/auth/AuthCard";
import ResetForm from "@/components/auth/ResetForm";
export const metadata = { title: "Set a new password", robots: { index: false } };
export default function Page() { return <AuthCard title="Set a new password"><ResetForm /></AuthCard>; }
