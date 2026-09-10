"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminLogin.module.css";

/**
 * AdminLoginForm
 *
 * Client-side prototype authentication component for OSPREY.
 * Handles credential input, field validation, show/hide password toggle,
 * brief submission transition, and direct navigation to /dashboard.
 */
export default function AdminLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your Admin ID or authorized email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);

    // Brief transition before directing to the investigation workspace
    setTimeout(() => {
      router.push("/dashboard");
    }, 450);
  };

  return (
    <div className={styles.loginCard}>
      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.brandGroup}>
          <div className={styles.brandEmblemWrapper}>
            <svg
              className={styles.brandEmblemIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L3 8l9 4 9-4-9-6z" />
              <path d="M3 8v5l9 6 9-6V8" />
              <path d="M12 12l-4 3 4 3 4-3-4-3z" />
            </svg>
          </div>
          <span className={styles.brandName}>OSPREY</span>
        </div>

        <div className={styles.eyebrowBadge}>
          <span className={styles.eyebrowDot} />
          <span>ADMIN ACCESS</span>
        </div>

        <h1 className={styles.cardTitle}>Enter the Investigation Console</h1>
        <p className={styles.cardSubtitle}>
          Authorized access required for satellite SAR surveillance, vessel correlation, and incident attribution intelligence.
        </p>
      </div>

      {/* Login Form */}
      <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
        {/* Error Alert */}
        {error && (
          <div className={styles.errorBanner} role="alert">
            <span aria-hidden="true">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Identifier Input */}
        <div className={styles.formGroup}>
          <label htmlFor="admin-identifier" className={styles.fieldLabel}>
            <span>Admin ID / Email</span>
            <span className={styles.fieldHint}>Authorized Personnel</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon} aria-hidden="true">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              id="admin-identifier"
              type="text"
              name="identifier"
              autoComplete="username"
              className={`${styles.formInput} ${
                error && !identifier.trim() ? styles.formInputError : ""
              }`}
              placeholder="admin@osprey.maritime.org"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError("");
              }}
              aria-required="true"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className={styles.formGroup}>
          <label htmlFor="admin-password" className={styles.fieldLabel}>
            <span>Access Key / Password</span>
            <span className={styles.fieldHint}>Encrypted</span>
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon} aria-hidden="true">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              className={`${styles.formInput} ${
                error && !password ? styles.formInputError : ""
              }`}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              aria-required="true"
            />
            <button
              type="button"
              className={styles.togglePasswordBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Entering Investigation Console...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>

      {/* Security Footnote */}
      <div className={styles.securityFootnote}>
        <span className={styles.lockIcon} aria-hidden="true">🔒</span>
        <span>ISO-27001 &amp; SOC-2 Ready Architecture // 256-Bit SSL</span>
      </div>
    </div>
  );
}
