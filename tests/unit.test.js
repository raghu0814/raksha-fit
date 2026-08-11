import test from "node:test";
import assert from "node:assert/strict";
import { normalizePhone, membershipState } from "../src/controllers/api.controller.js";
import { render } from "../src/services/automation.js";
import { requireAuth, allowRoles } from "../src/middleware/auth.middleware.js";

test("normalizes Indian mobile numbers", () => {
  assert.equal(normalizePhone("+91 98765-43210"), "9876543210");
  assert.equal(normalizePhone("not a phone"), "");
});

test("membership state protects inactive and expired members", () => {
  assert.equal(membershipState({ status: "inactive", valid_till: null }), "Inactive");
  assert.equal(membershipState({ status: "active", valid_till: "2000-01-01" }), "Expired");
  assert.equal(membershipState({ status: "active", valid_till: null }), "Active");
});

test("notification templates render only supported variables", () => {
  assert.equal(render("Hi {{member_name}} from {{gym_name}}: {{plan_name}}", { member_name: "Asha", gym_name: "Raksha", plan_name: "Annual" }), "Hi Asha from Raksha: Annual");
});

test("auth middleware rejects requests without a bearer token", () => {
  let result; requireAuth({ headers: {} }, { status: code => ({ json: body => { result = { code, body }; } }) }, () => assert.fail("next must not run"));
  assert.deepEqual(result, { code: 401, body: { message: "Authentication required" } });
});

test("role middleware prevents staff from owner-only APIs", () => {
  let result; allowRoles("owner")({ user: { role: "staff" } }, { status: code => ({ json: body => { result = { code, body }; } }) }, () => assert.fail("next must not run"));
  assert.equal(result.code, 403);
});
