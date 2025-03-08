'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import CatIcon from '../icons/cat'
import { useRouter } from 'next/navigation'

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: "Automatic Builds",
    description: "Streamline your development process with our automatic build system.",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "One-Click Deploy",
    description: "Deploy your applications with a single click, saving time and reducing errors.",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Advanced Optimizations",
    description: "Leverage cutting-edge optimizations to enhance your application's performance.",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Scalability",
    description: "Easily scale your infrastructure to meet growing demands.",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "Monitoring & Analytics",
    description: "Gain insights into your application's performance with built-in monitoring tools.",
    icon: <CheckCircle2 className="h-6 w-6 text-emerald-500" />,
  },
]

export default function FeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="bg-gradient-to-b from-[#B2FFB9] to-[#A4FBD9] min-h-screen py-24 px-4 sm:px-6 lg:px-8" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">

          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Platform Features
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Discover how our PaaS solution can transform your cloud infrastructure
          </p>
        </div>
        <div className="relative mt-24">
          {/* Progress line */}
          <div className="absolute left-1/2 w-1 h-full bg-emerald-100/50 rounded-full transform -translate-x-1/2" />
          <motion.div
            className="absolute left-1/2 w-1 bg-emerald-500 rounded-full origin-top transform -translate-x-1/2"
            style={{ scaleY, height: '100%' }}
          />
          
          <div className="relative">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                total={features.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ feature, index, total, scrollYProgress }: { 
  feature: Feature
  index: number
  total: number
  scrollYProgress: any
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  // Calculate the progress for this specific card
  const cardProgress = useTransform(
    scrollYProgress,
    [index / total, (index + 0.5) / total, (index + 1) / total],
    [0, 1, 0]
  )

  // Smooth out the animations
  const smoothProgress = useSpring(cardProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Create smooth animations for each property
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4])
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1.05, 1.05, 0.8])
  const x = useTransform(
    smoothProgress, 
    [0, 1], 
    [isEven ? 50 : -50, 0]
  )

  const handleLearnMoreClick = () => {
    router.push('/about-us');
  };

  return (
    <motion.div
      className={`mb-32 flex justify-between items-center w-full ${
        isEven ? 'flex-row-reverse' : ''
      }`}
      style={{ opacity }}
      ref={cardRef}
    >
      <div className="w-5/12" />
      <motion.div
        className="z-20 flex items-center justify-center bg-emerald-500 shadow-lg w-12 h-12 rounded-full"
        style={{ scale: smoothProgress }}
      >
        <span className="font-semibold text-lg text-white">{index + 1}</span>
      </motion.div>
      <motion.div
        className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/50 rounded-xl shadow-lg w-5/12 px-6 py-5 hover:shadow-xl transition-shadow"
        style={{ x, scale }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <h3 className="mb-3 font-bold text-gray-900 text-xl flex items-center gap-3">
          {feature.icon}
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-5">
          {feature.description}
        </p>
        <Button 
          variant="ghost" 
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 pl-0"
          onClick={handleLearnMoreClick}
        >
          Learn More 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  )
}

