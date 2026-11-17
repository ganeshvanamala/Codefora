import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isLocalIdentityAllowed, saveCodeforaSession } from "../lib/session";
import { subscribeProfileSync } from "../lib/profileSync";
import { isAdminRole, isDefaultAdminEmail, isGuestUser } from "../lib/userAccess";

function getStoredAdminRole(uid) {
  if (!uid || typeof window === "undefined") return false;
  try {
    const storedUid = localStorage.getItem("codefora_user_id");
    const storedRole = localStorage.getItem("codefora_role");
    return storedUid === uid && isAdminRole(storedRole);
  } catch {
    return false;
  }
}

function getManualUser() {
  try {
    const uid = localStorage.getItem("codefora_user_id");
    const displayName = localStorage.getItem("codefora_username");
    if (!uid || !displayName) return null;
    // Guest identities are browser-only and never receive an API token.
    if (!isLocalIdentityAllowed() && !uid.startsWith("guest-")) return null;
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
  const [serverIsAdmin, setServerIsAdmin] = useState(() => getStoredAdminRole(getManualUser()?.uid));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth) {
      const manualUser = getManualUser();
      setUser(manualUser);
      setServerIsAdmin(getStoredAdminRole(manualUser?.uid));
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const nextUser = currentUser || getManualUser();
      setUser(nextUser);
      setServerIsAdmin(getStoredAdminRole(nextUser?.uid));
      setLoading(false);
    }, (err) => {
      setError(err);
      const manualUser = getManualUser();
      setUser(manualUser);
      setServerIsAdmin(getStoredAdminRole(manualUser?.uid));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const syncBrowserSession = () => {
      // Firebase remains authoritative for signed-in accounts. Browser sessions
      // are only used when there is no Firebase user, including guests.
      if (!auth?.currentUser) {
        const manualUser = getManualUser();
        setUser(manualUser);
        setServerIsAdmin(getStoredAdminRole(manualUser?.uid));
        setLoading(false);
      } else {
        setServerIsAdmin(getStoredAdminRole(auth.currentUser.uid));
      }
    };

    window.addEventListener("codefora:session-changed", syncBrowserSession);
    return () => window.removeEventListener("codefora:session-changed", syncBrowserSession);
  }, []);

  // Client-side navigation/display hint backed by default admin emails and server-synced profile role.
  // Admin API access is always enforced by backend token and role checks.
  const isAdmin = Boolean(user && !isGuestUser(user)) && (isDefaultAdminEmail(user?.email) || serverIsAdmin);

  useEffect(() => {
    if (user?.uid) {
      saveCodeforaSession({
        uid: user.uid,
        displayName: user.displayName || user.email?.split("@")[0] || "Developer",
        ...(isAdmin ? { role: "admin" } : {})
      });
    }
  }, [isAdmin, user]);

  useEffect(() => {
    return subscribeProfileSync((profile) => {
      setUser((current) => {
        if (!current?.uid || profile.uid !== current.uid) return current;
        if (profile.isAdmin !== undefined || profile.role !== undefined) {
          setServerIsAdmin(Boolean(profile.isAdmin) || isAdminRole(profile.role));
        }
        return {
          ...current,
          displayName: profile.displayName || current.displayName,
          photoURL: profile.photoURL || current.photoURL
        };
      });
    });
  }, []);

  return { user, loading, error, isAdmin };
};
