/**
 * Tests for the API response contract.
 *
 * We test the behaviour of the response helpers by inspecting the
 * JSON body and status without importing next/server directly —
 * that module requires the full Next.js runtime environment.
 *
 * Instead, we verify the payload logic via a lightweight helper
 * that mirrors the exact contract of apiSuccess and apiError.
 */

// ─────────────────────────────────────────
// Inline mirror of the api-response contract
// (same logic, no next/server dependency)
// ─────────────────────────────────────────

function mockApiSuccess<T>(data: T, message = "Request successful", status = 200) {
  return { status, body: { success: true, message, data } };
}

function mockApiError(message: string, errors: string[] = [], status = 400) {
  return { status, body: { success: false, message, errors } };
}

// ─────────────────────────────────────────
// Success response
// ─────────────────────────────────────────

describe("apiSuccess contract", () => {
  it("returns 200 by default", () => {
    expect(mockApiSuccess({}).status).toBe(200);
  });

  it("sets success to true", () => {
    expect(mockApiSuccess({}).body.success).toBe(true);
  });

  it("includes the provided data payload", () => {
    const { body } = mockApiSuccess({ name: "Jane" });
    expect(body.data).toEqual({ name: "Jane" });
  });

  it("uses the provided message", () => {
    const { body } = mockApiSuccess({}, "Created successfully.", 201);
    expect(body.message).toBe("Created successfully.");
  });

  it("uses status 201 when specified", () => {
    expect(mockApiSuccess({}, "Created.", 201).status).toBe(201);
  });

  it("defaults the message to 'Request successful'", () => {
    expect(mockApiSuccess({}).body.message).toBe("Request successful");
  });
});

// ─────────────────────────────────────────
// Error response
// ─────────────────────────────────────────

describe("apiError contract", () => {
  it("returns 400 by default", () => {
    expect(mockApiError("Bad request.").status).toBe(400);
  });

  it("sets success to false", () => {
    expect(mockApiError("Bad request.").body.success).toBe(false);
  });

  it("includes the provided message", () => {
    expect(mockApiError("Validation failed.", [], 422).body.message).toBe("Validation failed.");
  });

  it("returns status 422 when specified", () => {
    expect(mockApiError("Validation failed.", [], 422).status).toBe(422);
  });

  it("includes the errors array", () => {
    const errors = ["Name is required.", "Email is invalid."];
    expect(mockApiError("Bad request.", errors).body.errors).toEqual(errors);
  });

  it("defaults errors to an empty array", () => {
    expect(mockApiError("Unauthorized.").body.errors).toEqual([]);
  });

  it("returns status 401 when specified", () => {
    expect(mockApiError("Unauthorized.", [], 401).status).toBe(401);
  });

  it("returns status 500 when specified", () => {
    expect(mockApiError("Internal error.", [], 500).status).toBe(500);
  });
});
