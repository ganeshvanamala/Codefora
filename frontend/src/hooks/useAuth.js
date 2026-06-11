import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

function getManualUser() {
  try {
    const uid = localStorage.getItem("codefora_user_id");
    const displayName = localStorage.getItem("codefora_username");
    if (!uid || !displayName) return null;
    return {
      uid,
      displayName,
      email: `${displayName}@codefora.local`,
      photoURL: null,
      providerId: "manual",
    };
  } catch {
    return null;
  }
}

export const useAuth = () => {
  const [user, setUser] = useState(() => getManualUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || getManualUser());
      setLoading(false);
    }, (err) => {
      setError(err);
      setUser(getManualUser());
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Secure admin check based on email
  const isAdmin = user?.email === "ganeshvanamala16@gmail.com";

  return { user, loading, error, isAdmin };
};
