import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export const GlassCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden backdrop-blur-sm bg-white/30 border-none shadow-xl 
        before:absolute before:w-full before:h-full before:bg-gradient-to-br before:from-white/10 before:to-white/5 before:-z-10
        hover:shadow-lg hover:bg-white/40 transition-all duration-300">
        {children}
      </Card>
    </motion.div>
  );
};

// Example usage
const StyledCardExample = () => {
  return (
    <div className="bg-[#A4FBAD] min-h-screen flex items-center justify-center p-4">
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-2xl font-medium text-gray-800">
            Deploy Application
          </CardTitle>
          <CardDescription className="text-gray-600">
            Deploy your application to Kubernetes with one click
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white/40 rounded-lg backdrop-blur-sm">
            <p className="text-gray-700">
              Your application will be automatically scaled and managed
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 bg-emerald-600 text-white rounded-lg
              hover:bg-emerald-700 transition-colors duration-200"
          >
            Deploy Now
          </motion.button>
        </CardContent>
      </GlassCard>
    </div>
  );
};

export default StyledCardExample;