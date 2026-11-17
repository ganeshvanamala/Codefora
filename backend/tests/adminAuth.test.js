import assert from "node:assert/strict";
import test from "node:test";

process.env.CODEFORA_LOCAL_MODE = "true";
process.env.NODE_ENV = "test";

const { adminAuth, isDefaultAdminEmail, isSuperAdminEmail } = await import("../middleware/adminAuth.js");
const { createAdminController } = await import("../controllers/adminController.js");
const { createFeedbackController } = await import("../controllers/feedbackController.js");

function makeJwt(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.sig`;
}

function mockResponse() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };
}

test("adminAuth allows super admin case-insensitively in local mock mode", async () => {
  const token = makeJwt({ user_id: "uid-super", email: "GaneshVanamala16@gmail.com", name: "Ganesh" });
  const request = { headers: { authorization: `Bearer ${token}` } };
  const response = mockResponse();
  let nextCalled = false;

  await adminAuth(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, 200);
  assert.equal(request.adminUser.isSuperAdmin, true);
  assert.equal(request.adminUser.email, "ganeshvanamala16@gmail.com");
});

test("adminAuth allows default co-admin email without super admin privileges", async () => {
  const token = makeJwt({ user_id: "uid-coadmin", email: "roopasri061216@gmail.com" });
  const request = { headers: { authorization: `Bearer ${token}` } };
  const response = mockResponse();
  let nextCalled = false;

  await adminAuth(request, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(request.adminUser.isSuperAdmin, false);
  assert.equal(isDefaultAdminEmail("ROOPASRI061216@gmail.com"), true);
  assert.equal(isSuperAdminEmail("roopasri061216@gmail.com"), false);
});

test("adminAuth rejects regular users with 403 and missing token with 401", async () => {
  const missingReq = { headers: {} };
  const missingRes = mockResponse();
  await adminAuth(missingReq, missingRes, () => {});
  assert.equal(missingRes.statusCode, 401);

  const userToken = makeJwt({ user_id: "uid-regular-user", email: "someone@example.com" });
  const userReq = { headers: { authorization: `Bearer ${userToken}` } };
  const userRes = mockResponse();
  await adminAuth(userReq, userRes, () => {});
  assert.equal(userRes.statusCode, 403);
});

test("adminController stats, users, and feedbackController work in local mock mode", async () => {
  const mockRepo = { listAll: () => [] };
  const adminController = createAdminController(mockRepo);
  const feedbackController = createFeedbackController();

  const statsRes = mockResponse();
  await adminController.getStats({ adminUser: { isSuperAdmin: true } }, statsRes);
  assert.equal(statsRes.statusCode, 200);
  assert.equal(typeof statsRes.payload.totalUsers, "number");
  assert.equal(statsRes.payload.isSuperAdmin, true);

  const usersRes = mockResponse();
  await adminController.getUsers({ adminUser: { isSuperAdmin: true } }, usersRes);
  assert.equal(usersRes.statusCode, 200);
  assert.equal(Array.isArray(usersRes.payload), true);

  const feedbackRes = mockResponse();
  await feedbackController.getAll({}, feedbackRes);
  assert.equal(feedbackRes.statusCode, 200);
  assert.equal(Array.isArray(feedbackRes.payload), true);
});
