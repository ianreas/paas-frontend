'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import CatIcon from '../icons/cat';
import styled from '@emotion/styled'
import { Github, Twitter, Linkedin } from 'lucide-react'

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;

  svg {
    transition: transform 200ms ease;
    &:hover {
      transform: rotate(180deg);
      filter: invert(1);
    }
  }
`

const footerItems = [
  { label: 'Home', href: '/' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Applications', href: '/applications' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
];

const Footer = () => {
  return (
    <footer className="w-full bg-opacity-90 bg-[#A4FBAE] shadow-sm backdrop-blur-sm border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
              <LogoBox>
                <Link href="/">
                  <span className="text-xl font-bold text-gray-800">
                    <CatIcon />
                  </span>
                </Link>
              </LogoBox>
              <p className="mt-2 text-sm text-gray-500">
                Making cloud infrastructure provisioning easy and efficient.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-4">
              {footerItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 flex flex-col-reverse md:flex-row justify-between items-center border-t border-gray-200/30">
            <p className="mt-4 md:mt-0 text-sm text-gray-500">
              &copy; 2024 Meow, Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20"
                asChild
              >
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">GitHub</span>
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20"
                asChild
              >
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-white/20"
                asChild
              >
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

