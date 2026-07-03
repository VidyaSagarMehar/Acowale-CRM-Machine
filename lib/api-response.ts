import { NextResponse } from "next/server";

type SuccessPayload<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorPayload = {
  success: false;
  message: string;
  errors: string[];
};

export function apiSuccess<T>(data: T, message = "Request successful", status = 200) {
  return NextResponse.json<SuccessPayload<T>>(
    {
      success: true,
      message,
      data
    },
    { status }
  );
}

export function apiError(message: string, errors: string[] = [], status = 400) {
  return NextResponse.json<ErrorPayload>(
    {
      success: false,
      message,
      errors
    },
    { status }
  );
}
