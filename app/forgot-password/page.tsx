import AuthCard from "@/components/auth/AuthCard";
import ForgotForm from "@/components/auth/ForgotForm";
export const metadata = { title: "Forgot password", robots: { index: false } };
export default function Page() { return <AuthCard title="Forgot your password?" sub="Enter your email and we will send you a 6-digit code to reset your password."><ForgotForm /></AuthCard>; }
