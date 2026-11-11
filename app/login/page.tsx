import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
export const metadata = { title: "Log in", robots: { index: false } };
export default function Page() { return <AuthCard title="Log in" sub="Welcome back! Log in to your BikaFlora account."><LoginForm /></AuthCard>; }
