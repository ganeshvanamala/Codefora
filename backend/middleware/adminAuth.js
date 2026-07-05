import { admin } from "../config/firebase.js";

export async function adminAuth(request, response, next) {
  const token = request.headers["x-admin-token"];
  
  if (!token) {
    return response.status(401).json({ error: "Access denied. Admin token required." });
  }

  // Allow static secret for simple local dev, but strictly require JWT for prod
  const staticSecret = process.env.ADMIN_SECRET;
  if (staticSecret && token === staticSecret) {
    return next();
  }

  try {
    // 1. Verify the JWT
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // 2. Check if the decoded uid is in our allowed list
    const allowedUidsStr = process.env.ADMIN_UIDS || "";
    const allowedUids = allowedUidsStr.split(",").map(uid => uid.trim());

    if (!allowedUids.includes(decodedToken.uid)) {
      return response.status(403).json({ error: "Forbidden. You are not an authorized admin." });
    }

    // Pass the user info to the next middleware if needed
    request.adminUser = decodedToken;
    next();
  } catch (error) {
    console.error("Admin Auth Error:", error.message);
    return response.status(403).json({ error: "Invalid or expired admin token." });
  }
}
