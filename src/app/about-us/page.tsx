"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/app/components/ui/CustomCards";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Cpu,
  Database,
  Gauge,
  MemoryStickIcon as Memory,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-[#A4FBAD] to-[#A4FBD9] min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-16" {...fadeIn}>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About MeowPaas
          </h1>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <motion.div className="md:col-span-2 lg:col-span-3" {...fadeIn}>
            <GlassCard>
              <CardContent className="p-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  MeowPaas is redefining cloud deployment with enterprise-grade
                  performance optimization built into its core. Born from the
                  challenges of modern cloud computing, we&apos;ve created a
                  platform that makes sophisticated infrastructure accessible to
                  teams of all sizes.
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            className="md:col-span-2 lg:col-span-3"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            <GlassCard>
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To democratize enterprise-level cloud infrastructure by making
                  advanced performance optimization and intelligent resource
                  management available to every developer and organization.
                </p>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            className="lg:col-span-3"
            {...fadeIn}
            transition={{ delay: 0.3 }}
          >
            <GlassCard>
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  What Sets Us Apart
                </h2>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-4">
                    <Memory className="h-8 w-8 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Advanced Memory Optimization
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>Up to 3x lower memory access latency</li>
                      <li>
                        2.5x higher throughput for data-intensive operations
                      </li>
                      <li>66% reduction in processing time</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <Cpu className="h-8 w-8 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Intelligent Workload Placement
                    </h3>
                    <p className="text-gray-700">
                      Automatically detects your application&apos;s resource
                      patterns and optimizes deployment accordingly.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Gauge className="h-8 w-8 text-emerald-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Enterprise-Grade, Developer-Friendly
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>Multi-socket resource optimization</li>
                      <li>Intelligent memory allocation</li>
                      <li>Advanced topology mapping</li>
                      <li>Real-time performance monitoring</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            {...fadeIn}
            transition={{ delay: 0.4 }}
          >
            <GlassCard>
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Perfect For
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-emerald-600 mr-2" />
                    Financial services requiring microsecond-level response
                    times
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-emerald-600 mr-2" />
                    Machine learning workloads with intensive memory
                    requirements
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-emerald-600 mr-2" />
                    Real-time streaming and video processing applications
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-emerald-600 mr-2" />
                    Large-scale databases and caching systems
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-5 w-5 text-emerald-600 mr-2" />
                    Any application where performance is crucial
                  </li>
                </ul>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.4 }}>
            <GlassCard>
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  The Technology
                </h2>
                <div className="space-y-4">
                  <Database className="h-8 w-8 text-emerald-600" />
                  <p className="text-gray-700">
                    Built on AWS EKS with advanced optimizations, our platform
                    transforms standard cloud infrastructure into a
                    high-performance computing environment. Our proprietary
                    scheduling algorithms ensure your applications always run
                    with optimal resource allocation, delivering bare-metal
                    performance with cloud flexibility.
                  </p>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>

          <motion.div
            className="md:col-span-2 lg:col-span-3"
            {...fadeIn}
            transition={{ delay: 0.5 }}
          >
            <GlassCard>
              <CardContent className="p-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Start Optimizing Today
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Join forward-thinking companies that are already leveraging
                  MeowPaas&apos;s advanced infrastructure optimization.
                  Experience the perfect balance of performance and simplicity.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => router.push("/")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </CardContent>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
