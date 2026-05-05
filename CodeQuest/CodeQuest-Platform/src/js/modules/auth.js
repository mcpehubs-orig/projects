export async function initFirebaseAuth(onUserChange) {
  if (!window.CODEQUEST_FIREBASE_CONFIG || !window.CODEQUEST_FIREBASE_CONFIG.apiKey) {
    return {
      enabled: false,
      loginWithGoogle: () => Promise.reject(new Error("Firebase config missing")),
      logout: () => Promise.resolve(),
      loadCloudProfile: () => Promise.resolve(null),
      saveCloudProfile: () => Promise.resolve()
    };
  }

  const [
    { initializeApp },
    { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut },
    { getFirestore, doc, getDoc, setDoc }
  ] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")
  ]);

  const app = initializeApp(window.CODEQUEST_FIREBASE_CONFIG);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  onAuthStateChanged(auth, (user) => onUserChange(user));

  return {
    enabled: true,
    loginWithGoogle: () => signInWithPopup(auth, provider),
    logout: () => signOut(auth),
    loadCloudProfile: async (uid) => {
      const snap = await getDoc(doc(db, "profiles", uid));
      return snap.exists() ? snap.data() : null;
    },
    saveCloudProfile: async (uid, profile) =>
      setDoc(doc(db, "profiles", uid), profile, { merge: true })
  };
}
