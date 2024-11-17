'use client'

import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LogOut, Settings, User } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

type MockUser = {
  email: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
  };
}

export function Navbar() {
  // TODO: Supabase에서 사용자 정보 가져오기
  const user: MockUser | null = {
    email: "test@example.com",
    user_metadata: {
      avatar_url: "",
      full_name: "테스트 사용자"
    }
  }

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
            {user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center gap-2">
                      {user.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="User avatar"
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="hidden sm:inline">{user.user_metadata?.full_name || user.email}</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-48 p-2">
                        <li>
                          <Link href="/profile" legacyBehavior passHref>
                            <NavigationMenuLink 
                              className={cn(
                                "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                "cursor-pointer"
                              )}
                            >
                              <User className="w-4 h-4" />
                              <span>프로필</span>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <Link href="/settings" legacyBehavior passHref>
                            <NavigationMenuLink 
                              className={cn(
                                "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                "cursor-pointer"
                              )}
                            >
                              <Settings className="w-4 h-4" />
                              <span>설정</span>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                        <li>
                          <form action="/auth/signout" method="post">
                            <button 
                              className={cn(
                                "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                "text-red-500 hover:text-red-600"
                              )}
                            >
                              <LogOut className="w-4 h-4" />
                              <span>로그아웃</span>
                            </button>
                          </form>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Button variant="outline" size="sm" className="gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="hidden sm:inline">Google로 로그인</span>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
