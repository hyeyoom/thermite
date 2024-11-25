'use client'

import {User} from "@supabase/supabase-js"
import {Button} from "@/components/ui/button"
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet"
import {LogOut, Settings, User as UserIcon} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {cn} from "@/lib/utils"
import {signOutServerAction} from '@/app/actions/auth.actions'

interface UserMenuProps {
    user: User
}

export function UserMenu({user}: UserMenuProps) {
    const handleSignOut = async () => {
        await signOutServerAction()
    }

    return (
        <>
            {/* 데스크톱 메뉴 */}
            <NavigationMenu className="hidden sm:flex">
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
                            <span>{user.user_metadata?.full_name || user.email}</span>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="w-48 p-2">
                                <li>
                                    <Link href="/profile" legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={cn("flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent", "cursor-pointer")}>
                                            <UserIcon className="w-4 h-4"/>
                                            <span>프로필</span>
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/settings" legacyBehavior passHref>
                                        <NavigationMenuLink
                                            className={cn("flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent", "cursor-pointer")}>
                                            <Settings className="w-4 h-4"/>
                                            <span>설정</span>
                                        </NavigationMenuLink>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleSignOut}
                                        className={cn(
                                            "flex items-center gap-2 w-full p-2 rounded-md hover:bg-accent",
                                            "text-red-500 hover:text-red-600"
                                        )}
                                    >
                                        <LogOut className="w-4 h-4"/>
                                        <span>로그아웃</span>
                                    </button>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            {/* 모바일 메뉴 */}
            <Sheet>
                <SheetTrigger asChild className="sm:hidden">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[40vh]">
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                                {user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">{user.user_metadata?.full_name}</span>
                                <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Link href="/profile">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <UserIcon className="w-4 h-4"/>
                                    프로필
                                </Button>
                            </Link>
                            <Link href="/settings">
                                <Button variant="ghost" className="w-full justify-start gap-3">
                                    <Settings className="w-4 h-4"/>
                                    설정
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 text-red-500 hover:text-red-600"
                                onClick={handleSignOut}
                            >
                                <LogOut className="w-4 h-4"/>
                                로그아웃
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
