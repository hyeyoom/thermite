import {Profile} from "@/lib/types";
import {ProfileService} from "@/server/services/profile.service";
import {createSupabaseClientForServer} from "@/lib/utils/supabase/server";

export class SupabaseProfileService implements ProfileService {

    async getProfile(userId: string): Promise<Profile | null> {
        const supabase = await createSupabaseClientForServer()

        const {data, error} = await supabase
            .from('user_profile')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle()

        if (error) throw error

        if (data === null) return null

        return {
            id: data.id,
            name: data.name
        }
    }

    async upsertProfile(userId: string, profile: Profile): Promise<void> {
        const supabase = await createSupabaseClientForServer()
        const { error } = await supabase
            .from('user_profile')
            .upsert({
                user_id: userId,
                name: profile.name
            }, {
                onConflict: 'user_id'
            })
        
        if (error) {
            console.error('Supabase upsert 에러:', error)
            throw error
        }
    }
}
