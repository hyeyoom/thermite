import {ProfileService} from "@/server/services/profile.service";
import {SupabaseProfileService} from "@/server/services/supabase/profile.service";

let profileService: ProfileService | null = null

export function getProfileService(): ProfileService {
    if (!profileService) {
        profileService = new SupabaseProfileService()
    }
    return profileService
}
