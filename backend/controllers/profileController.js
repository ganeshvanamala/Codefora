import { createFirestore, admin } from "../config/firebase.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localProfilesPath = path.join(__dirname, "../data/manualUsers.json");

async function readLocalUsers() {
  try {
    return JSON.parse(await fs.readFile(localProfilesPath, "utf8"));
  } catch {
    return {};
  }
}

async function writeLocalUsers(users) {
  await fs.mkdir(path.dirname(localProfilesPath), { recursive: true });
  await fs.writeFile(localProfilesPath, JSON.stringify(users, null, 2));
}

export function createProfileController() {
  const db = createFirestore();

  return {
    get: async (request, response) => {
      const userId = String(request.params.userId || "").trim();
      if (!userId) return response.status(400).json({ error: "Missing userId" });
      try {
        if (!db) {
          const users = await readLocalUsers();
          const user = users[userId] || {};
          return response.json(user.profile || {});
        }

        const doc = await db.collection("users").doc(userId).get();
        if (!doc.exists) return response.status(404).json({ error: "Profile not found" });
        const data = doc.data() || {};
        return response.json(data.profile || {});
      } catch (error) {
        console.warn(`Profile get failed: ${error.message}`);
        return response.status(500).json({ error: error.message });
      }
    },

    save: async (request, response) => {
      const userId = String(request.params.userId || "").trim();
      const profile = request.body || {};
      if (!userId) return response.status(400).json({ error: "Missing userId" });
      try {
        if (!db) {
          const users = await readLocalUsers();
          users[userId] = {
            ...(users[userId] || {}),
            profile: { ...((users[userId] || {}).profile || {}), ...profile },
            updatedAt: Date.now()
          };
          await writeLocalUsers(users);
          return response.json({ ok: true });
        }

        await db.collection("users").doc(userId).set({ profile, updatedAt: Date.now() }, { merge: true });
        return response.json({ ok: true });
      } catch (error) {
        console.warn(`Profile save failed: ${error.message}`);
        return response.status(500).json({ error: error.message });
      }
    },

    saveWork: async (request, response) => {
      const userId = String(request.params.userId || "").trim();
      const work = request.body || {};
      if (!userId) return response.status(400).json({ error: "Missing userId" });
      
      const newWork = {
        ...work,
        id: `work-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now()
      };

      try {
        if (!db) {
          const users = await readLocalUsers();
          if (!users[userId]) users[userId] = { profile: {}, works: [] };
          if (!users[userId].works) users[userId].works = [];
          users[userId].works.push(newWork);
          await writeLocalUsers(users);
          return response.json({ ok: true, work: newWork });
        }

        await db.collection("users").doc(userId).set({
          works: admin.firestore.FieldValue.arrayUnion(newWork)
        }, { merge: true });
        
        return response.json({ ok: true, work: newWork });
      } catch (error) {
        console.warn(`Work save failed: ${error.message}`);
        return response.status(500).json({ error: error.message });
      }
    },

    listWorks: async (request, response) => {
      const userId = String(request.params.userId || "").trim();
      if (!userId) return response.status(400).json({ error: "Missing userId" });
      try {
        if (!db) {
          const users = await readLocalUsers();
          const user = users[userId] || {};
          return response.json(user.works || []);
        }

        const doc = await db.collection("users").doc(userId).get();
        if (!doc.exists) return response.json([]);
        const data = doc.data() || {};
        return response.json(data.works || []);
      } catch (error) {
        console.warn(`Works list failed: ${error.message}`);
        return response.status(500).json({ error: error.message });
      }
    },

    incrementStat: async (userId, statName, amount = 1) => {
      if (!userId || !db) return;
      try {
        const docRef = db.collection("users").doc(userId);
        const doc = await docRef.get();
        const data = doc.exists ? doc.data() : { profile: { stats: {} } };
        const stats = data.profile?.stats || {};
        stats[statName] = (Number(stats[statName]) || 0) + amount;
        
        await docRef.set({ 
          profile: { ...data.profile, stats },
          updatedAt: Date.now() 
        }, { merge: true });
      } catch (error) {
        console.warn(`Stat increment failed for ${userId}: ${error.message}`);
      }
    }
  };
}
