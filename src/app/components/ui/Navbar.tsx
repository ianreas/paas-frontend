'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { UserNav } from './UserNav';
import CatIcon from '../icons/cat';
import styled from '@emotion/styled'
import { signIn, useSession } from 'next-auth/react'

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


const Navbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { label: 'Home', href: '/' },
    // { label: 'About', href: '/about' },
    ...(session ? [{ label: 'Applications', href: '/applications' }] : []),
    {label: "Pricing", href: "/pricing"}
    // { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 bg-opacity-50 bg-[#B2FFB9] shadow-sm backdrop-blur-sm border-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <LogoBox>
              <Link href="/">
                <span className="text-xl font-bold text-gray-800">
                  <CatIcon />
                </span>
                </Link>
              </LogoBox>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.href
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
        {!session ? (
          <Button 
            variant="link" 
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            Log In
          </Button>
        ) : null}
        <UserNav />
      </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;