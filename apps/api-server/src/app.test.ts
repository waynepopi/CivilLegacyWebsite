import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import type { Express } from "express";

describe("CORS configuration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("when ALLOWED_ORIGIN is set", () => {
    it("should set Access-Control-Allow-Origin to the configured origin", async () => {
      vi.stubEnv("ALLOWED_ORIGIN", "https://example.com");
      const { default: app } = (await import("./app")) as { default: Express };

      const response = await request(app)
        .get("/api/healthz")
        .set("Origin", "https://example.com");

      expect(response.headers["access-control-allow-origin"]).toBe(
        "https://example.com"
      );
    });

    it("should restrict CORS to only the configured origin", async () => {
      vi.stubEnv("ALLOWED_ORIGIN", "https://example.com");
      const { default: app } = (await import("./app")) as { default: Express };

      const response = await request(app)
        .get("/api/healthz")
        .set("Origin", "https://malicious.com");

      // When a static origin is configured, the cors middleware still sets the header
      // but browsers will block cross-origin requests that don't match
      expect(response.headers["access-control-allow-origin"]).toBe(
        "https://example.com"
      );
    });
  });

  describe("when ALLOWED_ORIGIN is not set", () => {
    it("should not allow any origin (CORS headers undefined)", async () => {
      vi.unstubAllEnvs();
      delete process.env.ALLOWED_ORIGIN;
      const { default: app } = (await import("./app")) as { default: Express };

      const response = await request(app)
        .get("/api/healthz")
        .set("Origin", "https://anyorigin.com");

      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });
});

describe("Health check endpoint", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should return ok status", async () => {
    const { default: app } = (await import("./app")) as { default: Express };
    const response = await request(app).get("/api/healthz");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
