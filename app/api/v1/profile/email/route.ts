import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { RegisterSchema } from "@/app/api/v1/auth/register/schema";

export const PATCH = async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = RegisterSchema.pick({ email: true }).safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { email: result.data.email },
      select: { email: true },
    });

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    console.error("Failed to update email:", error);

    return NextResponse.json(
      { error: "Failed to update email address." },
      { status: 500 },
    );
  }
};
