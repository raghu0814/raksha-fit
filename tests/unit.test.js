import test from "node:test";
import assert from "node:assert/strict";
import { normalizePhone, membershipState } from "../src/controllers/api.controller.js";

test("normalizes Indian mobile numbers", () => {
  assert.equal(normalizePhone("+91 98765-43210"), "9876543210");
  assert.equal(normalizePhone("not a phone"), "");
});

test("membership state protects inactive and expired members", () => {
  assert.equal(membershipState({ status: "inactive", valid_till: null }), "Inactive");
  assert.equal(membershipState({ status: "active", valid_till: "2000-01-01" }), "Expired");
  assert.equal(membershipState({ status: "active", valid_till: null }), "Active");
});
