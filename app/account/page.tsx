import { Suspense } from "react";
import AccountView from "@/components/auth/AccountView";
export const metadata = { title: "My account", robots: { index: false } };
export default function Page() { return <Suspense><AccountView /></Suspense>; }
