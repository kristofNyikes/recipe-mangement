"use client";
import Link from "next/link";
import React, { useState } from "react";
import PasswordInput from "../InputFields/PasswordInput";
import { useRouter } from "next/navigation";

const SignUpForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordAgain, setPasswordAgain] = useState<string>("");
  const [checkBox, setCheckBox] = useState<boolean>(false);

  const router = useRouter();

  const onSubmitHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    /* 
    TODO form submission logic:
    check empty fields
    validate value (email must have @, etc)
    send sing up request
    handle response
    */
    router.push("/main");
  };

  return (
    <form onSubmit={(e) => onSubmitHandler(e)}>
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend className="fieldset-legend">Sign up</legend>

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
            <Link href={"/privacy"} className="link link-primary">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href={"/terms"} className="link link-primary">
              Terms of Service
            </Link>
            .
          </span>
        </label>

        <button className="btn btn-primary mt-4">Sign up</button>
        <span>
          Already have an account?{" "}
          <Link href={"/auth/login"} className="link link-primary">
            Log in!
          </Link>
        </span>
      </fieldset>
    </form>
  );
};

export default SignUpForm;
