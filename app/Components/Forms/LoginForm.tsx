"use client";
import Link from "next/link";
import React, { useState } from "react";
import PasswordInput from "../InputFields/PasswordInput";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [keepLoggedIn, setKeepLoggedIn] = useState<boolean>(false);

  const router = useRouter();

  const onSubmitHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    /* 
    TODO form submission logic:
    check empty fields
    validate value (email must have @, etc)
    send login request
    handle response
    */
    router.push("/main");
  };

  return (
    <form onSubmit={(e) => onSubmitHandler(e)}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <button className="btn btn-primary mt-4">Log in</button>
        <span>
          Need an account?{" "}
          <Link href={"/auth/signup"} className="link link-primary">
            Register
          </Link>
        </span>
      </fieldset>
    </form>
  );
};

export default LoginForm;
