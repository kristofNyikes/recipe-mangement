import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";
import prisma from "@/prisma/client";
import { RegisterSchema } from "./schema";

export const POST = async (req: NextRequest) => {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = RegisterSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error:
          "Please provide a valid email and a password of at least 8 characters.",
      },
      { status: 400 },
    );
  }

  const { email, password } = result.data;

  try {
    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user }, { status: 201 });
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

    console.error("Failed to register user:", error);

    return NextResponse.json(
      { error: "Failed to create account." },
      { status: 500 },
    );
  }
};
