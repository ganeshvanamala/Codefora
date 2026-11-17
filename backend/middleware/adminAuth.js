import fs from "fs/promises";
import { createAuth, createFirestore } from "../config/firebase.js";
import { runtimeDataPath } from "../utils/runtimeDataPath.js";

const localProfilesPath = runtimeDataPath("manualUsers.json");

export const SUPER_ADMIN_EMAILS = new Set(["ganeshvanamala16@gmail.com"]);
export const DEFAULT_ADMIN_EMAILS = new Set([
  "ganeshvanamala16@gmail.com",
  "roopasri061216@gmail.com"
]);

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isSuperAdminEmail(email) {
  return SUPER_ADMIN_EMAILS.has(normalizeEmail(email));
}

export function isDefaultAdminEmail(email) {
  return DEFAULT_ADMIN_EMAILS.has(normalizeEmail(email));
}

function decodeUnverifiedJwtPayload(token) {
  try {
    const parts = String(token || "").split(".");
    if (parts.length !== 3) return null;
    const json = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

async function readLocalUserRole(uid) {
  if (!uid) return null;
  try {
    const raw = await fs.readFile(localProfilesPath, "utf8");
    const users = JSON.parse(raw);
    return users?.[uid]?.profile?.role || null;
  } catch {
    return null;
  }
}

export async function adminAuth(request, response, next) {
  const authHeader = request.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({ error: "Access denied. Admin token required." });
  }

  const token = authHeader.slice(7).trim();
  const auth = createAuth();
  const db = createFirestore();

  try {
    let decodedToken;
    if (auth.isMock && process.env.NODE_ENV !== "production") {
      const payload = decodeUnverifiedJwtPayload(token);
      const headerUid = String(request.headers["x-codefora-user-id"] || "").trim();
      const headerEmail = normalizeEmail(request.headers["x-codefora-user-email"]);
      decodedToken = {
        uid: payload?.user_id || payload?.sub || headerUid || "mock-uid",
        email: normalizeEmail(payload?.email || headerEmail),
        name: payload?.name || String(request.headers["x-codefora-user-name"] || "").trim() || "Local Admin"
      };
    } else {
      decodedToken = await auth.verifyIdToken(token);
    }

    const email = normalizeEmail(decodedToken?.email);

    // 1. Super Admin Check
    if (isSuperAdminEmail(email)) {
      request.adminUser = { ...decodedToken, email, isSuperAdmin: true };
      return next();
    }

    // 2. Default Admin Email Check
    if (isDefaultAdminEmail(email)) {
      request.adminUser = { ...decodedToken, email, isSuperAdmin: false };
      return next();
    }

    // 3. Dynamic Admin Check (Firestore or local dev fallback)
    if (db && !db.isMock && decodedToken?.uid) {
      const userDoc = await db.collection("users").doc(decodedToken.uid).get();
      if (userDoc.exists && userDoc.data().profile?.role === "admin") {
        request.adminUser = { ...decodedToken, email, isSuperAdmin: false };
        return next();
      }
    } else if (process.env.NODE_ENV !== "production" && decodedToken?.uid) {
      const localRole = await readLocalUserRole(decodedToken.uid);
      if (localRole === "admin") {
        request.adminUser = { ...decodedToken, email, isSuperAdmin: false };
        return next();
      }
    }

    return response.status(403).json({ error: "Forbidden. You are not an authorized admin." });
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return response.status(401).json({ error: "Invalid or expired admin token." });
  }
}
