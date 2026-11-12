"use client";

import Link from "next/link";
import React, { useState } from "react";
import PasswordInput from "../InputFields/PasswordInput";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignUpForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password || !passwordAgain) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== passwordAgain) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 7) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!checkBox) {
      setError("You must accept the Privacy Policy and Terms of Service.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to create account.");
        return;
      }

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/main",
      });

      if (!loginResult || loginResult.error) {
        setError("Account created, but automatic login failed. Please log in.");
        return;
      }

      router.push("/main");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Sign up</legend>

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordInput
          label="Password again"
          placeholder="Password again"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
        />

        <label className="flex items-start gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-xs mt-1"
            checked={checkBox}
            onChange={(e) => setCheckBox(e.target.checked)}
          />
          <span className="label-text leading-relaxed">
            I have read and accept to Recipe Management{" "}
            <Link href="/privacy" className="link link-primary">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="link link-primary">
              Terms of Service
            </Link>
            .
          </span>
        </label>

        {error && (
          <p className="text-error text-sm mt-2" role="alert">
            {error}
          </p>
        )}

        <button
          className="btn btn-primary mt-4"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Sign up"}
        </button>

        <span>
          Already have an account?{" "}
          <Link href="/auth/login" className="link link-primary">
            Log in!
          </Link>
        </span>
      </fieldset>
    </form>
  );
};

export default SignUpForm;
