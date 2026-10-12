const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const source = fs.readFileSync(path.join(__dirname, "../src/lib/offerExpiry.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const sandbox = { exports: {}, Date, Intl };
vm.runInNewContext(compiled, sandbox);
const status = (end, now) => sandbox.exports.offerExpiryStatus(end, Date.parse(now));

test("offers that ended after the old August audit date expire on today's date", () => {
  assert.equal(status("2026-09-30", "2026-10-11T16:00:00Z"), "expired");
  assert.equal(status("2026-12-31", "2026-10-11T16:00:00Z"), "current");
});
test("date-only deadlines include the entire final Eastern calendar day", () => {
  assert.equal(status("2026-10-11", "2026-10-12T03:59:59Z"), "current");
  assert.equal(status("2026-10-11", "2026-10-12T04:00:00Z"), "expired");
});
test("calendar-day handling follows winter time and DST changes", () => {
  assert.equal(status("2026-12-31", "2027-01-01T04:59:59Z"), "current");
  assert.equal(status("2026-12-31", "2027-01-01T05:00:00Z"), "expired");
  assert.equal(status("2026-11-01", "2026-11-02T04:59:59Z"), "current");
  assert.equal(status("2026-11-01", "2026-11-02T05:00:00Z"), "expired");
});
test("explicit timestamps respect the supplied timezone and exact expiry", () => {
  assert.equal(status("2026-10-11T12:00:00-06:00", "2026-10-11T17:59:59Z"), "current");
  assert.equal(status("2026-10-11T12:00:00-06:00", "2026-10-11T18:00:00Z"), "expired");
});
test("missing deadlines stay undated; invalid or ambiguous dates are rejected", () => {
  for (const value of [null, undefined, "", "  "]) assert.equal(status(value, "2026-10-11T16:00:00Z"), "undated");
  for (const value of ["garbage", "2026-02-30", "2026-02-30T12:00:00Z", "10/11/2026", "2026-10-11T12:00:00"]) {
    assert.equal(status(value, "2026-10-11T16:00:00Z"), "invalid");
  }
});
