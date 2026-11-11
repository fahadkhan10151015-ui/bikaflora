import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";
export const metadata = { title: "Create an account", robots: { index: false } };
export default function Page() { return <AuthCard title="Create your account" sub="It takes less than a minute."><SignupForm /></AuthCard>; }
