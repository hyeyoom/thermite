'use server'

import {Profile} from "@/lib/types";
import {createSupabaseClientForServer} from "@/lib/utils/supabase/server";
import {getProfileService} from "@/server/services/factories/profile.service.factory";

export async function fetchProfileServerAction(
    userId: string,
): Promise<Profile | null> {

    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const profileService = getProfileService()
    return profileService.getProfile(userId)
}

export async function upsertProfileServerAction(
    userId: string,
    profile: Profile,
) {
    const supabase = await createSupabaseClientForServer()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
        throw new Error('Unauthorized')
    }

    const profileService = getProfileService()
    await profileService.upsertProfile(userId, profile)
}
