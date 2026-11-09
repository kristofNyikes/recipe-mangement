"use client";

import { FormEvent, useState } from "react";

interface ProfileSettingsProps {
  initialEmail: string;
}

const ProfileSettings = ({ initialEmail }: ProfileSettingsProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEmailChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEmailMessage("");
    setEmailError("");

    if (newEmail.trim().toLowerCase() === email.toLowerCase()) {
      setEmailError("This is already your current email address.");
      return;
    }

    setEmailLoading(true);

    try {
      const response = await fetch("/api/v1/profile/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        setEmailError(result.error ?? "Failed to update email address.");
        return;
      }

      setEmail(result.data.email);
      setNewEmail("");
      setEmailMessage("Email address updated successfully.");
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("The new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from the current password.",
      );
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch("/api/v1/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setPasswordError(result.error ?? "Failed to update password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch {
      setPasswordError("Something went wrong. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Email settings */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Change Email Address</h2>

          <div>
            <p className="text-sm text-base-content/60">
              Current email address
            </p>
            <p className="font-medium">{email}</p>
          </div>

          <form onSubmit={handleEmailChange} className="flex flex-col gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">New email address</legend>
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Enter new email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                maxLength={254}
                required
              />
            </fieldset>

            {emailError && <p className="text-error text-sm">{emailError}</p>}

            {emailMessage && (
              <p className="text-success text-sm">{emailMessage}</p>
            )}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={emailLoading || !newEmail.trim()}
              >
                {emailLoading ? "Updating..." : "Update Email"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Password settings */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Change Password</h2>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Current password</legend>
              <input
                type="password"
                className="input input-bordered w-full"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">New password</legend>
              <input
                type="password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={7}
                maxLength={128}
                autoComplete="new-password"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Confirm new password</legend>
              <input
                type="password"
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={7}
                maxLength={128}
                autoComplete="new-password"
                required
              />
            </fieldset>

            {passwordError && (
              <p className="text-error text-sm">{passwordError}</p>
            )}

            {passwordMessage && (
              <p className="text-success text-sm">{passwordMessage}</p>
            )}

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  passwordLoading ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
