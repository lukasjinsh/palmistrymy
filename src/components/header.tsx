"use client";

import { Hand } from 'lucide-react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
      <Link href="/" className="flex items-center gap-2 flex-shrink-0" prefetch={false}>
        <Hand className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold font-headline">AI 손금 분석기</h1>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                손금 분석
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/basics" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                손금 기초
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/blog" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                블로그
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
