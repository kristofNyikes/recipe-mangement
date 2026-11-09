import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";
import { z } from "zod";

const PasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(7).max(128),
});

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

  const result = PasswordSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "New password must be between 8 and 128 characters." },
      { status: 400 },
    );
  }

  const { currentPassword, newPassword } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      currentPassword,
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current password." },
        { status: 400 },
      );
    }

    const passwordHash = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update password:", error);

    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 },
    );
  }
};
