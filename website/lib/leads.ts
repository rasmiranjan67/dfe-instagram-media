"use client";
import { firebaseConfig, firebaseReady } from "./firebase-config";

export type LeadInput = {
  source: "project" | "audit";
  name: string; phone?: string; business?: string; city?: string;
  needs?: string[]; stage?: string; when?: string; message?: string; website?: string; page?: string;
};

export async function saveLead(l: LeadInput) {
  if (!firebaseReady()) return;
  try {
    const { initializeApp, getApps } = await import("firebase/app");
    const { getFirestore, collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
    const app = getApps()[0] || initializeApp(firebaseConfig);
    const clip = (s?: string, n = 500) => (s || "").slice(0, n);
    await addDoc(collection(getFirestore(app), "leads"), {
      source: l.source, name: clip(l.name, 100), phone: clip(l.phone, 30), business: clip(l.business, 120),
      city: clip(l.city, 80), needs: (l.needs || []).slice(0, 8).map((n) => clip(n, 40)), stage: clip(l.stage, 60),
      when: clip(l.when, 60), message: clip(l.message, 2000), website: clip(l.website, 300), page: clip(l.page, 200),
      status: "new", createdAt: serverTimestamp(),
    });
  } catch (e) { console.warn("Lead not saved", e); }
}
