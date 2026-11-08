"use client";

import Link from "next/link";
import React, { useState } from "react";
import PasswordInput from "../InputFields/PasswordInput";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const onSubmitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/main",
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(result.url ?? "/main");
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
        <legend className="fieldset-legend">Login</legend>

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

        <label className="flex items-start gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-xs mt-1"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
          />
          <span className="label-text leading-relaxed">Keep me logged in</span>
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
          {isLoading ? "Logging in..." : "Log in"}
        </button>

        <span>
          Need an account?{" "}
          <Link href="/auth/signup" className="link link-primary">
            Register
          </Link>
        </span>
      </fieldset>
    </form>
  );
};

export default LoginForm;
