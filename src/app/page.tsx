// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { signIn, signOut, useSession } from "next-auth/react";
// import { useState } from "react";
// import SplineViewer from "./components/KuberLogo";
// import { Repository } from "./components/RepoSelector";

// export default function Home() {
//   const { data: session, update } = useSession();
//   const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

//   const handleGithubConnect = async () => {
//     const result = await signIn("github", { redirect: false });
//     if (result?.error) {
//       console.error("GitHub sign-in error:", result.error);
//     } else {
//       await update();
//     }
//   };

//   const handleSelectRepo = (repo: Repository) => {
//     setSelectedRepo(repo);
//     console.log("Selected repository for deployment:", repo.full_name);
//     // Here you would typically call your backend API to initiate the deployment
//   };

//   return (
//     <div className="">
//       {/* <Spline scene="https://prod.spline.design/HNQOi2tyEdTQtCL0/scene.splinecode" /> */}
//       <div className="w-full h-[100vh]">
//         <SplineViewer />
//       </div>
//       <Card className="w-[350px] mx-auto">
//         <CardHeader>
//           <CardTitle>Authentication</CardTitle>
//           <CardDescription>Manage your account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {session ? (
//             <>
//               <p className="mb-4">Signed in as {session.user.email}</p>
//               <p className="mb-4">Username: {session.user.username}</p>
//               {session.user.githubUsername ? (
//                 <p className="mb-4">
//                   GitHub connected: {session.user.githubUsername}
//                 </p>
//               ) : (
//                 <Button onClick={handleGithubConnect} className="w-full mb-2">
//                   Connect GitHub
//                 </Button>
//               )}
//               <Button
//                 onClick={() => signOut()}
//                 variant="outline"
//                 className="w-full"
//               >
//                 Sign out
//               </Button>
//             </>
//           ) : (
//             <Button onClick={() => signIn("google")} className="w-full">
//               Sign in with Google
//             </Button>
//           )}
//         </CardContent>
//       </Card>
//       {/*
//       {session?.user.githubUsername && (
//         <RepoSelector onSelectRepo={handleSelectRepo} />
//       )}

//       {selectedRepo && (
//         <Card className="w-[350px] mx-auto mt-4">
//           <CardHeader>
//             <CardTitle>Selected Repository</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p>Ready to deploy: {selectedRepo.full_name}</p>
//           </CardContent>
//         </Card>
//       )} */}

//       {session && (
//         <Card className="w-[350px] mx-auto mt-4">
//           <CardHeader>
//             <CardTitle>Session Info</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <pre className="text-xs overflow-auto max-h-60">
//               {JSON.stringify(session, null, 2)}
//             </pre>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { signIn, signOut, useSession } from "next-auth/react";
// import SplineViewer from "./components/KuberLogo";

// export default function Home() {
//   const { data: session, update } = useSession();

//   const handleGithubConnect = async () => {
//     const result = await signIn("github", { redirect: false });
//     if (result?.error) {
//       console.error("GitHub sign-in error:", result.error);
//     } else {
//       await update();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#C3FDBF]">
//       {/* Hero Section */}
//       <div className="container mx-auto px-4 pt-20">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div className="space-y-6">
//             <h1 className="text-6xl font-bold text-gray-900">
//               Deploy Your Apps with
//               <span className="text-emerald-600"> Meow PaaS</span>
//             </h1>
//             <p className="text-xl text-gray-600">
//               The purr-fect platform for deploying your applications. Simple,
//               fast, and developer-friendly.
//             </p>
//             <div className="flex gap-4">
//               {!session ? (
//                 <Button
//                   onClick={() => signIn("google")}
//                   size="lg"
//                   className="bg-emerald-600 hover:bg-emerald-700"
//                 >
//                   Get Started for Free
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleGithubConnect}
//                   size="lg"
//                   className="bg-emerald-600 hover:bg-emerald-700"
//                   disabled={session.user.githubUsername ? false : true}
//                 >
//                   {session.user.githubUsername
//                     ? "GitHub Connected"
//                     : "Connect GitHub"}
//                 </Button>
//               )}
//               <Button variant="outline" size="lg">
//                 View Documentation
//               </Button>
//             </div>
//           </div>
//           <div className="h-[400px] relative">
//             <SplineViewer />
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="container mx-auto px-4 py-20">
//         <h2 className="text-3xl font-bold text-center mb-12">
//           Why Choose Meow PaaS?
//         </h2>
//         <div className="grid md:grid-cols-3 gap-8">
//           <Card className="bg-white/50 border-none shadow-lg">
//             <CardHeader>
//               <CardTitle>Easy Deployment</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">
//                 Deploy your applications with just a few clicks. No complex
//                 configurations needed.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/50 border-none shadow-lg">
//             <CardHeader>
//               <CardTitle>GitHub Integration</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">
//                 Connect your GitHub repositories and deploy directly from your
//                 workflow.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="bg-white/50 border-none shadow-lg">
//             <CardHeader>
//               <CardTitle>Scalable Infrastructure</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600">
//                 Built on modern cloud infrastructure for reliability and
//                 scalability.
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Auth Status Section */}
//       {session && (
//         <div className="container mx-auto px-4 pb-20">
//           <Card className="bg-white/50 border-none shadow-lg">
//             <CardHeader>
//               <CardTitle>Account Status</CardTitle>
//               <CardDescription>
//                 Welcome back, {session.user.email}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <p>Username: {session.user.username}</p>
//               {session.user.githubUsername && (
//                 <p>GitHub Connected: {session.user.githubUsername}</p>
//               )}
//               <Button
//                 onClick={() => signOut()}
//                 variant="outline"
//                 className="w-full"
//               >
//                 Sign out
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRef } from "react";
import KuberSpline from "./components/KuberSpline";

export default function Home() {
  const { data: session, update } = useSession();

  const handleGithubConnect = async () => {
    const result = await signIn("github", { redirect: false });
    if (result?.error) {
      console.error("GitHub sign-in error:", result.error);
    } else {
      await update();
    }
  };

  const signInButton = useRef();

  function onLoad(spline: any) {
    const obj = spline.findObjectById("f62c804b-f73f-4b2f-88f9-31a013bd1b05");
    console.log(JSON.stringify(obj));
    signInButton.current = obj;
  }

  function onSplineMouseDown(e: any) {
    if (e.target.name === "cta") {
      console.log("I have been clicked!");
    }
  }

  return (
    <div className="min-h-screen bg-[#C3FDBF]">
      {/* Hero Section with Full-screen SplineViewer */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          {/* <SplineViewer onSplineMouseDown={onSplineMouseDown} onLoad={onLoad} /> */}
          <KuberSpline onSplineMouseDown={onSplineMouseDown} onLoad={onLoad} />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl h-full flex flex-col justify-end pb-52 pl-16">
            <div className="flex gap-4">
              {!session ? (
                <Button
                  onClick={() => signIn("google")}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Get Started Here
                </Button>
              ) : (
                <Button
                  onClick={handleGithubConnect}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {session.user.githubUsername
                    ? "Deploy Now"
                    : "Connect GitHub"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Meow PaaS?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Easy Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Deploy your applications with just a few clicks. No complex
                configurations needed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>GitHub Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Connect your GitHub repositories and deploy directly from your
                workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Scalable Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Built on modern cloud infrastructure for reliability and
                scalability.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Auth Status Section */}
      {session && (
        <div className="container mx-auto px-4 pb-20">
          <Card className="bg-white/50 border-none shadow-lg">
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
              <CardDescription>
                Welcome back, {session.user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Username: {session.user.username}</p>
              {session.user.githubUsername && (
                <p>GitHub Connected: {session.user.githubUsername}</p>
              )}
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="w-full"
              >
                Sign out
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
