'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/app/components/ui/CustomCards'
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'

const ContactPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
    // Here you would typically send the data to your server
    alert('Thank you for your message. We will get back to you soon!')
  }

  return (
    <div className="bg-gradient-to-b from-[#A4FBAD] to-[#A4FBD9] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Contact Us
          </h1>
          <p className="mt-5 text-xl text-gray-500">
            Have questions about our pricing? We're here to help!
          </p>
        </div>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-2xl font-medium text-gray-800">
              Send us a message
            </CardTitle>
            <CardDescription className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="bg-white/50"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="bg-white/50"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  {...register('message', { required: 'Message is required' })}
                  className="bg-white/50"
                  rows={5}
                />
                {errors.message && <p className="text-red-500 text-sm">{errors.message.message as string}</p>}
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
                  Send Message
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  )
}

export default ContactPage
