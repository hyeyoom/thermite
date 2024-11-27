import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {redirect} from "next/navigation";
import {createSupabaseClientForServer} from "@/lib/utils/supabase/server";
import {ProfileEditClient} from "@/components/features/profile/profile-edit-client";

export default async function ProfilePage() {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-12">
            <Card>
                <CardHeader>
                    <CardTitle>프로필</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={user.user_metadata?.avatar_url}/>
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <ProfileEditClient name={user.user_metadata?.full_name || '이름 없음'}
                                           email={user.email || 'no-email'}/>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">계정 정보</h4>
                        <div className="grid gap-2 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">가입일</span>
                                <span>{new Date(user.created_at).toLocaleDateString('ko-KR')}</span>
                            </div>
                            {user.last_sign_in_at ? <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">마지막 로그인</span>
                                <span>{new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                            </div> : null}
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">인증 제공자</span>
                                <span className="capitalize">{user.app_metadata.provider}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
