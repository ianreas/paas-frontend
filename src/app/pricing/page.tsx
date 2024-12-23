"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GlassCard } from "@/app/components/ui/CustomCards"; // ← adjust import path as needed

export default function PricingPage() {
  // State to toggle between "developers" and "businesses"
  const [activeTier, setActiveTier] = useState<"developers" | "businesses">("developers");

  return (
    <div
      className="min-h-screen w-full px-4 py-12 md:py-20"
      style={{ backgroundColor: "#A4FBAD" }} // Same green used in your GlassCard example
    >
      {/* Title + Subtitle */}
      <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Pricing
        </motion.h1>
        <p className="mt-3 text-gray-700 text-base md:text-lg">
          Find the perfect plan—whether you’re an individual developer or an enterprise team.
        </p>
      </div>

      {/* Tier Toggle */}
      <div className="max-w-xl mx-auto mb-10 flex justify-center">
        <div className="flex p-1 rounded-full bg-white/40 backdrop-blur-sm shadow-inner">
          <button
            onClick={() => setActiveTier("developers")}
            className={`px-6 py-2 text-sm md:text-base font-medium rounded-full transition-colors
              ${
                activeTier === "developers"
                  ? "bg-white text-gray-800"
                  : "text-green-400 hover:bg-white/20"
              }`}
          >
            For Developers
          </button>
          <button
            onClick={() => setActiveTier("businesses")}
            className={`px-6 py-2 text-sm md:text-base font-medium rounded-full transition-colors
              ${
                activeTier === "businesses"
                  ? "bg-white text-green-800"
                  : "text-green-400 hover:bg-white/20"
              }`}
          >
            For Businesses
          </button>
        </div>
      </div>

      {/* Pricing Content */}
      <div className="max-w-6xl mx-auto">
        {activeTier === "developers" ? (
          /* FOR DEVELOPERS: Single Card */
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard>
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Meow Cloud
                </CardTitle>
                <CardDescription className="text-gray-700 text-sm md:text-base">
                  Metered billing based on resource usage, pro-rated to the minute.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <p className="text-xl text-gray-800">
                    $10 <span className="text-sm">per GB RAM / mo</span>
                  </p>
                  <p className="text-xl text-gray-800">
                    $20 <span className="text-sm">per vCPU / mo</span>
                  </p>
                  {/* <p className="text-gray-600 text-sm">Eject to AWS, Azure, or GCP anytime</p> */}
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-5 rounded-lg font-medium 
                               bg-emerald-600 hover:bg-emerald-700 text-white
                               transition-colors duration-200"
                  >
                    Try Meow Cloud
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 px-5 rounded-lg font-medium 
                               bg-white/40 hover:bg-white/50 text-gray-800
                               transition-colors duration-200"
                  >
                    Learn More
                  </motion.button>
                </div>
                {/* Feature List */}
                <div className="border-t border-white/30 pt-4">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>Auto Deploys from Git</li>
                    <li>Web Services, Workers, Cron Jobs</li>
                    <li>Autoscaling</li>
                    <li>Monitoring &amp; Logging</li>
                    <li>Preview Environments</li>
                  </ul>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        ) : (
          /* FOR BUSINESSES: Two Cards side by side */
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Standard */}
            <GlassCard>
              <div className="flex flex-col h-full">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Standard
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-sm md:text-base">
                    Pay per use, scale indefinitely with metered billing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-1">
                    <p className="text-xl text-gray-800">
                      $6 <span className="text-sm">per GB RAM / mo</span>
                    </p>
                    <p className="text-xl text-gray-800">
                      $13 <span className="text-sm">per vCPU / mo</span>
                    </p>
                    <p className="text-gray-600 text-sm">Underlying cloud costs not included</p>
                  </div>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-5 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 
                                 text-white transition-colors duration-200"
                    >
                      Get Started
                    </motion.button>
                  </div>
                  <div className="border-t border-white/30 pt-4">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>Deploy from GitHub</li>
                      <li>Unlimited Applications</li>
                      <li>Preview Environments</li>
                      <li>Autoscaling</li>
                      <li>Jobs &amp; Cron Jobs</li>
                      <li>Certificate Management</li>
                      <li>Monitoring (30 days)</li>
                      <li>Logging (7 days)</li>
                      <li>Alerting</li>
                    </ul>
                  </div>
                </CardContent>
              </div>
            </GlassCard>

            {/* Enterprise */}
            <GlassCard>
              <div className="flex flex-col h-full">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl md:text-3xl font-semibold text-gray-800">
                    Enterprise
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-sm md:text-base">
                    For companies running at scale. Enjoy volume discounts with enterprise-grade support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">Volume Discounts</p>
                    <p className="text-sm text-gray-600">Starting at 40 vCPU, 80GB RAM</p>
                  </div>
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-5 rounded-lg font-medium bg-white/40 hover:bg-white/50 
                                 text-gray-800 transition-colors duration-200"
                    >
                      Talk to Sales
                    </motion.button>
                  </div>
                  <div className="border-t border-white/30 pt-4">
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>Premium Support (SLO available)</li>
                      <li>Advanced RBAC</li>
                      <li>SSO</li>
                      <li>Custom Alerts</li>
                      <li>Custom Autoscaling</li>
                      <li>Plus Everything in Standard</li>
                    </ul>
                  </div>
                </CardContent>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}
