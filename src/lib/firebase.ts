import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import type { UserProfile, StudySession } from '@/types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:000000000000',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function signInAnon(): Promise<User> {
  const result = await signInAnonymously(auth)
  return result.user
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}

export async function createUserProfile(uid: string, displayName: string): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    displayName,
    totalXp: 0,
    coins: 0,
    streakDays: 0,
    lastLoginDate: new Date().toISOString().split('T')[0],
    avatarConfig: {
      body: 'default',
      face: 'smile',
      hat: null,
      accessory: null,
      effect: null,
    },
    unlockedSkills: [],
    unlockedItems: ['default-body', 'smile-face'],
    studyHistory: [],
  }

  const docRef = doc(db, 'users', uid)
  await setDoc(docRef, { ...profile, createdAt: serverTimestamp() })
  return profile
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const docRef = doc(db, 'users', uid)
  await updateDoc(docRef, { ...updates, updatedAt: serverTimestamp() })
}

export async function saveStudySession(uid: string, session: StudySession): Promise<void> {
  const profile = await getUserProfile(uid)
  if (!profile) return

  const updatedHistory = [...profile.studyHistory, session].slice(-100)

  await updateUserProfile(uid, {
    totalXp: profile.totalXp + session.xpEarned,
    coins: profile.coins + session.coinsEarned,
    studyHistory: updatedHistory,
  })
}
