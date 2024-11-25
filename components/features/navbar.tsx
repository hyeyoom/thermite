'use client'

import Link from "next/link"
import {ThemeToggle} from "@/components/theme-toggle"
import {LoginButton} from "@/components/features/auth/login-button"
import {UserMenu} from "@/components/features/auth/user-menu"
import {useAuth} from "@/lib/contexts/auth-context"
import {CheckSquare} from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function Navbar() {
    const {user} = useAuth()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <nav className="h-16">
                    <div className="flex h-full items-center justify-between">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <Link href="/" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center text-primary">
                                                    <CheckSquare className="w-7 h-7"/>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="font-bold text-xl">Block6</span>
                                                </div>
                                            </div>
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>

                        <div className="flex items-center gap-4">
                            <ThemeToggle/>
                            {user ? <UserMenu user={user}/> : <LoginButton/>}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}
