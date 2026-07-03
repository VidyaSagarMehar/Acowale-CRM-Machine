import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/features/auth/constants";
import { apiError, apiSuccess } from "@/lib/api-response";
import { verifyAuthToken } from "@/lib/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return apiError("Unauthorized.", [], 401);
    }

    const payload = await verifyAuthToken(token);

    return apiSuccess(
      {
        user: {
          id: payload.id,
          email: payload.email,
          role: payload.role
        }
      },
      "Current user fetched successfully."
    );
  } catch {
    return apiError("Unauthorized.", [], 401);
  }
}
