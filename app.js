// app.js — Shared Firebase config & utilities
// Replace with YOUR Firebase project config

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtumgV01ecQCz2scS4jvYHZOVyX9m6iAE",
  authDomain: "yw-za-88954.firebaseapp.com",
  projectId: "yw-za-88954",
  storageBucket: "yw-za-88954.firebasestorage.app",
  messagingSenderId: "653738438576",
  appId: "1:653738438576:web:c76566f2d4b7e7d2a07075",
  measurementId: "G-T1FR20XKQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ─── Deterministic Ticket Code Generator ───────────────────────────
// seed = DDMM + NN*100 + 1610 → 2 letters + 4 digits
export function generateTicketCode(ddmm, nn) {
  const seed = parseInt(ddmm) + nn * 100 + 1610;
  let s = (seed * 1103515245 + 12345) >>> 0;
  s = ((s ^ (s >>> 12)) * 2654435761) >>> 0;
  s = ((s ^ (s >>> 15)) * 2246822507) >>> 0;
  s = (s ^ (s >>> 13)) >>> 0;

  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l1 = L[s % 26];
  s = (s >>> 5) >>> 0;
  const l2 = L[s % 26];
  s = (s >>> 5) >>> 0;
  const d1 = s % 10; s = (s >>> 1) >>> 0;
  const d2 = s % 10; s = (s >>> 1) >>> 0;
  const d3 = s % 10; s = (s >>> 1) >>> 0;
  const d4 = s % 10;
  return `${l1}${l2}${d1}${d2}${d3}${d4}`;
}

export function generateAllCodes(dateStr) {
  // dateStr = "2025-10-15" → ddmm = "1510"
  const [y, m, d] = dateStr.split('-');
  const ddmm = d + m;
  const codes = [];
  for (let nn = 1; nn <= 25; nn++) {
    const num = String(nn).padStart(2, '0');
    const xxxx = generateTicketCode(ddmm, nn);
    codes.push(`YW-${ddmm}-${num}-${xxxx}`);
  }
  return codes;
}

export function getDrawId(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `YW-${d}${m}-${y}`;
}

export { db, auth, doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs,
  signInWithEmailAndPassword, signOut, onAuthStateChanged };

// ─── Confetti (lightweight) ────────────────────────────────────────
export function fireConfetti(container, count = 80) {
  const colors = ['#ff0000','#ffd700','#00ff00','#00bfff','#ff69b4','#ff8c00'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:absolute;width:10px;height:10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      top:50%;left:50%;border-radius:${Math.random()>0.5?'50%':'2px'};
      pointer-events:none;z-index:9999;
      transition:all ${1.5+Math.random()}s cubic-bezier(.25,.46,.45,.94);
    `;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${(Math.random()-0.5)*600}px, ${(Math.random()-0.5)*400 - 200}px) rotate(${Math.random()*720}deg)`;
      el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 3000);
  }
}
