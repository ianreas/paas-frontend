"use client";
//export const dynamic = 'force-dynamic';

import { GlassCard } from "@/app/components/ui/CustomCards";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// function SignInContent() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [providers, setProviders] = useState(null);
//   const isGithubOnly = searchParams.get('github') === 'true';

//   useEffect(() => {
//     const fetchProviders = async () => {
//       const fetchedProviders: any = await getProviders();
//       setProviders(fetchedProviders);
//     };
//     fetchProviders();
//   }, []);

//   useEffect(() => {
//     if (session && !isGithubOnly) {
//       router.push('/');
//     }
//   }, [session, router, isGithubOnly]);

//   if (!providers) {
//     return <div>Loading...</div>;
//   }

//   const filteredProviders = isGithubOnly
//     ? Object.values(providers).filter((provider: any) => provider.id === 'github')
//     : Object.values(providers);

//   return (
//     <div className="container mx-auto mt-10">
//       <Card className="w-[350px] mx-auto">
//         <CardHeader>
//           <CardTitle>Sign In</CardTitle>
//           <CardDescription>
//             {isGithubOnly ? 'Connect your GitHub account' : 'Choose your sign-in method'}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredProviders.map((provider: any) => (
//             <div key={provider.name} className="mb-2">
//               <Button
//                 onClick={() => signIn(provider.id, { callbackUrl: '/' })}
//                 className="w-full"
//               >
//                 {isGithubOnly ? 'Connect GitHub' : `Sign in with ${provider.name}`}
//               </Button>
//             </div>
//           ))}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

function SignInContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isGithubConnection = searchParams.get("github") === "true";

  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders: any = await getProviders();
      setProviders(fetchedProviders);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (session && !isGithubConnection) {
      router.push("/");
    }
  }, [session, router, isGithubConnection]);

  const handleSignIn = async (providerId: string) => {
    try {
      setIsLoading(true);
      const callbackUrl = `${window.location.origin}/`;
      await signIn(providerId, {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!providers) {
    return (
      <div className="mx-auto bg-[#A4FBAD] min-h-screen flex items-center justify-center">
        <div>Loading providers...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-[#A4FBAD] min-h-screen flex items-center justify-center">
      <GlassCard>
        <CardHeader>
          <CardTitle>
            {isGithubConnection ? "Connect GitHub" : "Sign In"}
          </CardTitle>
          <CardDescription>
            {isGithubConnection
              ? "Connect your GitHub account to enable repository access"
              : "Sign in with your Google account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGithubConnection ? (
            <Button
              onClick={() => handleSignIn("github")}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect GitHub Account"}
            </Button>
          ) : (
            <Button
              onClick={() => handleSignIn("google")}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
