'use client'

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { LoginButton } from "@/components/features/auth/login-button"
import { UserMenu } from "@/components/features/auth/user-menu"
import { useAuth } from "@/lib/contexts/auth-context"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <nav className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex h-14 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Block 6
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? <UserMenu user={user} /> : <LoginButton />}
          </div>
        </div>
      </nav>
    </header>
  )
}
