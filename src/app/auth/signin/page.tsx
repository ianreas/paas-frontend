'use client';
//export const dynamic = 'force-dynamic';


import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GlassCard } from '@/app/components/ui/CustomCards';



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
  const isGithubConnection = searchParams.get('github') === 'true';

  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders: any = await getProviders();
      setProviders(fetchedProviders);
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    // Only redirect if user is signed in and not trying to connect GitHub
    if (session && !isGithubConnection) {
      router.push('/');
    }
  }, [session, router, isGithubConnection]);

  if (!providers) {
    return <div className="mx-auto bg-[#A4FBAD] min-h-screen flex items-center justify-center"></div>;
  }

  return (
    <div className="mx-auto bg-[#A4FBAD] min-h-screen flex items-center justify-center">
      <GlassCard>
        <CardHeader>
          <CardTitle>{isGithubConnection ? 'Connect GitHub' : 'Sign In'}</CardTitle>
          <CardDescription>
            {isGithubConnection 
              ? 'Connect your GitHub account to enable repository access'
              : 'Sign in with your Google account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGithubConnection ? (
            <Button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="w-full"
            >
              Connect GitHub Account
            </Button>
          ) : (
            <Button
              onClick={() => signIn('google', { callbackUrl: '/',  redirect: true, })}
              className="w-full"
            >
              Sign in with Google
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