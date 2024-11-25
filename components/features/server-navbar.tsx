import Link from "next/link"
import {ThemeToggle} from "@/components/theme-toggle"
import {LoginButton} from "@/components/features/auth/login-button"
import {UserMenu} from "@/components/features/auth/user-menu"
import {CheckSquare} from "lucide-react"
import {createSupabaseClientForServer} from "@/lib/utils/supabase/server"

export async function ServerNavbar() {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto">
                <nav className="h-16">
                    <div className="flex h-full items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <div className="flex items-center text-primary">
                                    <CheckSquare className="w-7 h-7"/>
                                </div>
                                <span className="font-bold text-xl">Block6</span>
                            </Link>
                            <Link
                                href="/planning"
                                className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
                            >
                                플래닝
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle/>
                            {user ? (
                                <UserMenu user={user}/>
                            ) : (
                                <LoginButton/>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}
