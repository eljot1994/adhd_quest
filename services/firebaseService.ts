
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Profile, Theme, AvatarConfig } from '../types';
import { AVATAR_COLORS, AVATAR_EYES_COUNT, AVATAR_MOUTHS_COUNT } from '../constants';

const generateRandomAvatar = (): AvatarConfig => {
  return {
    bodyColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    eyes: Math.floor(Math.random() * AVATAR_EYES_COUNT),
    mouth: Math.floor(Math.random() * AVATAR_MOUTHS_COUNT),
  };
};

const profilesCollection = 'profiles';

/**
 * Retrieves a user profile from Firestore.
 * @param uid The user's unique ID.
 * @returns The user's profile, or null if not found.
 */
export const getProfile = async (uid: string): Promise<Profile | null> => {
  try {
    const docRef = doc(db, profilesCollection, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Profile;
    }
    return null;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
};

/**
 * Creates a new user profile in Firestore.
 * @param uid The user's unique ID.
 * @param name The user's display name or email.
 * @returns The newly created profile.
 */
export const createProfile = async (uid: string, name: string): Promise<Profile> => {
  const newProfile: Profile = {
    id: uid,
    name: name.split('@')[0], // Use part of email as name initially
    exp: 0,
    level: 1,
    tasks: [],
    completedTasksCount: 0,
    avatar: generateRandomAvatar(),
    theme: Theme.Light,
    badges: [],
  };
  try {
    await setDoc(doc(db, profilesCollection, uid), newProfile);
    return newProfile;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
};

/**
 * Updates an existing user profile in Firestore.
 * @param uid The user's unique ID.
 * @param updatedProfile The partial or full profile data to update.
 */
export const updateProfile = async (uid: string, updatedProfile: Profile): Promise<void> => {
  try {
    const docRef = doc(db, profilesCollection, uid);
    await setDoc(docRef, updatedProfile); // Using setDoc to overwrite the whole document
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
