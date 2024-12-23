'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import CatIcon from '../icons/cat'

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
    offset: ["start start", "end end"]
  })
  const [activeFeature, setActiveFeature] = useState(0)

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => {
      const newActiveFeature = Math.min(
        features.length - 1,
        Math.floor(v * features.length)
      )
      setActiveFeature(newActiveFeature)
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div className="bg-gradient-to-b from-[#B2FFB9] to-[#A4FBD9] min-h-screen py-24 px-4 sm:px-6 lg:px-8" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <CatIcon className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Platform Features
          </h2>
          <p className="mt-6 text-xl text-gray-600">
            Discover how our PaaS solution can transform your cloud infrastructure
          </p>
        </div>
        <div className="relative mt-24">
          <div className="absolute left-1/2 w-0.5 h-full bg-emerald-100 transform -translate-x-1/2" />
          <motion.div
            className="absolute left-1/2 w-0.5 bg-emerald-500 origin-top transform -translate-x-1/2"
            style={{ scaleY }}
          />
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              index={index}
              active={index === activeFeature}
              total={features.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ feature, index, active, total, scrollYProgress }: { 
  feature: Feature; 
  index: number; 
  active: boolean; 
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isEven = index % 2 === 0

  const yProgress = useTransform(
    scrollYProgress,
    [(index - 0.5) / total, index / total, (index + 1) / total],
    [0, 1, 0]
  )

  const opacity = useTransform(yProgress, [0, 0.5, 1], [0.4, 1, 0.4])
  const scale = useTransform(yProgress, [0, 0.5, 1], [0.95, 1, 0.95])
  const x = useTransform(yProgress, [0, 1], [isEven ? 50 : -50, 0])

  const lineSpring = useSpring(yProgress, { 
    stiffness: 40,
    damping: 20,
    restDelta: 0.001
  })

  return (
    <motion.div
      className={`mb-32 flex justify-between items-center w-full ${
        isEven ? 'flex-row-reverse left-timeline' : 'right-timeline'
      }`}
      style={{ opacity, scale }}
      ref={cardRef}
    >
      <div className="order-1 w-5/12" />
      <div className="z-20 flex items-center justify-center order-1 bg-emerald-500 shadow-lg w-10 h-10 rounded-full">
        <span className="font-semibold text-lg text-white">{index + 1}</span>
      </div>
      <motion.div
        className="order-1 bg-white rounded-xl shadow-lg w-5/12 px-6 py-5"
        style={{ x }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
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
        >
          Learn More 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* <svg 
        className={`absolute ${isEven ? 'left-1/2' : 'right-1/2'} h-32 w-[calc(50%-2.5rem)]`}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        viewBox="0 0 100 100"
        preserveAspectRatio={isEven ? "xMinYMid meet" : "xMaxYMid meet"}
      >
        <motion.path
          d={isEven 
            ? "M 0,50 H 80 V 100" 
            : "M 100,50 H 20 V 100"
          }
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-emerald-500"
          style={{
            pathLength: lineSpring
          }}
        />
        <motion.circle
          cx={isEven ? "0" : "100"}
          cy="50"
          r="4"
          fill="currentColor"
          className="text-emerald-500"
          style={{ 
            x: isEven 
              ? useTransform(lineSpring, [0, 0.5, 1], ["0%", "80%", "80%"]) 
              : useTransform(lineSpring, [0, 0.5, 1], ["0%", "-80%", "-80%"]),
            y: useTransform(lineSpring, [0, 0.5, 1], ["0%", "0%", "100%"])
          }}
        />
      </svg> */}
    </motion.div>
  )
}

