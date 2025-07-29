
import { Profile } from '../types';

const PROFILES_STORAGE_KEY = 'adhd_quest_profiles';

/**
 * Retrieves all user profiles from localStorage.
 * @returns An array of profiles, or an empty array if none are found.
 */
export const getProfilesFromStorage = (): Profile[] => {
  try {
    const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
    return storedProfiles ? JSON.parse(storedProfiles) : [];
  } catch (error) {
    console.error("Failed to parse profiles from localStorage:", error);
    return [];
  }
};

/**
 * Saves an array of profiles to localStorage.
 * @param profiles The array of profiles to save.
 */
export const saveProfilesToStorage = (profiles: Profile[]): void => {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.error("Failed to save profiles to localStorage:", error);
  }
};
