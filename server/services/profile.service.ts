import {Profile} from "@/lib/types";

export interface ProfileService {

    getProfile(userId: string): Promise<Profile | null>;

    upsertProfile(userId: string, profile: Profile): Promise<void>;
}
