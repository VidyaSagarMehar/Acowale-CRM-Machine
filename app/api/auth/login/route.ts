import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { AUTH_COOKIE_NAME } from "@/features/auth/constants";
import { loginSchema } from "@/features/auth/schema";
import { apiError, apiSuccess } from "@/lib/api-response";
import { connectToDatabase, ensureSeededAdmin } from "@/lib/db";
import { signAuthToken } from "@/lib/jwt";
import { getZodErrorMessages } from "@/lib/validation";
import { UserModel } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Validation failed.", getZodErrorMessages(parsed.error), 422);
    }

    await connectToDatabase();
    await ensureSeededAdmin();

    const user = await UserModel.findOne({ email: parsed.data.email.toLowerCase() });

    if (!user) {
      return apiError("Invalid email or password.", [], 401);
    }

    const isValidPassword = await bcrypt.compare(parsed.data.password, user.password);

    if (!isValidPassword) {
      return apiError("Invalid email or password.", [], 401);
    }

    const authUser = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const token = await signAuthToken(authUser);
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return apiSuccess({ user: authUser }, "Login successful.");
  } catch (error) {
    return apiError("Unable to log in.", [error instanceof Error ? error.message : "Unknown error"], 500);
  }
}
