"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { DEMO_CREDENTIALS, useAuth } from "./auth-provider";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {hidden ? (
        <>
          <path d="m3 3 18 18" />
          <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
          <path d="M9.9 4.2A10.2 10.2 0 0 1 12 4c5 0 8.5 4.4 9.7 6.2a1.6 1.6 0 0 1 0 1.6 17.4 17.4 0 0 1-2.2 2.7" />
          <path d="M6.2 6.2A17.7 17.7 0 0 0 2.3 10.2a1.6 1.6 0 0 0 0 1.6C3.5 13.6 7 18 12 18a10.7 10.7 0 0 0 4.1-.8" />
        </>
      ) : (
        <>
          <path d="M2.3 10.2a1.6 1.6 0 0 0 0 1.6C3.5 13.6 7 18 12 18s8.5-4.4 9.7-6.2a1.6 1.6 0 0 0 0-1.6C20.5 8.4 17 4 12 4s-8.5 4.4-9.7 6.2Z" />
          <circle cx="12" cy="11" r="3" />
        </>
      )}
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.4h3.1c1.8-1.7 3.1-4.1 3.1-7.1Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.6-2.6l-3.1-2.4c-.9.6-2 .9-3.5.9a6.1 6.1 0 0 1-5.7-4.2H3.1v2.5A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.3 13.7a6 6 0 0 1 0-3.4V7.8H3.1a10 10 0 0 0 0 8.4l3.2-2.5Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.5 9.5 0 0 0 12 2a10 10 0 0 0-8.9 5.8l3.2 2.5A6.1 6.1 0 0 1 12 6.1Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#1877f2] text-sm font-bold leading-none text-white"
    >
      f
    </span>
  );
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [confirmPassword, setConfirmPassword] = useState(DEMO_CREDENTIALS.password);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const isLogin = mode === "login";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");

    if (isLogin) {
      const result = signIn(email, password);

      if (!result.success) {
        setErrorMessage(result.message ?? "Unable to sign in.");
        return;
      }

      onClose();
      router.push("/account");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords need to match before we can create the account.");
      return;
    }

    const result = signUp({
      name: fullName,
      email,
      password,
    });

    if (!result.success) {
      setErrorMessage(result.message ?? "Unable to create account.");
      return;
    }

    onClose();
    router.push("/account");
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 px-3 py-3 sm:px-4 lg:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        aria-label="Close login popup"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <div className="relative grid max-h-[90vh] w-full max-w-[960px] overflow-y-auto rounded-[1.15rem] bg-[#050505] shadow-2xl xl:grid-cols-[44%_56%]">
        <button
          type="button"
          aria-label="Close login popup"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white transition-colors hover:bg-white/15"
        >
          <CloseIcon />
        </button>

        <div
          className="relative min-h-[180px] overflow-hidden bg-black bg-left-top bg-cover bg-no-repeat sm:min-h-[220px] xl:min-h-full xl:bg-left"
          style={{ backgroundImage: "url('/auth/login-container.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:hidden" />
          <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-end px-5 py-5 text-white sm:min-h-[220px] sm:px-6 xl:hidden">
            <p className="text-base font-extrabold text-white sm:text-lg">Theni Store</p>
            <h3 className="mt-2 max-w-sm text-2xl font-extrabold leading-tight sm:text-3xl">
              Fresh from Farm to Your Kitchen
            </h3>
            <p className="mt-2 max-w-md text-sm font-medium leading-6 text-white/85">
              Enjoy naturally grown millets, flours, and health mixes made for
              everyday meals.
            </p>
          </div>
        </div>

        <section className="flex min-h-0 flex-col bg-[#050505] px-5 py-6 text-white sm:px-7 sm:py-7 xl:px-12 xl:py-10">
          <div className="mb-6 grid grid-cols-2 border-b border-white/80 text-sm font-semibold">
            <button
              type="button"
              className={`pb-4 text-center transition-colors ${
                isLogin
                  ? "border-b-2 border-[#4f7d49] text-[#4f7d49]"
                  : "text-[#97a7c0] hover:text-white"
              }`}
              onClick={() => {
                setMode("login");
                setEmail(DEMO_CREDENTIALS.email);
                setPassword(DEMO_CREDENTIALS.password);
                setConfirmPassword(DEMO_CREDENTIALS.password);
                setPasswordVisible(false);
                setErrorMessage("");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`pb-4 text-center transition-colors ${
                !isLogin
                  ? "border-b-2 border-[#4f7d49] text-[#4f7d49]"
                  : "text-[#97a7c0] hover:text-white"
              }`}
              onClick={() => {
                setMode("signup");
                setPasswordVisible(false);
                setErrorMessage("");
              }}
            >
              Sign Up
            </button>
          </div>

          <div>
            <h2
              id="auth-modal-title"
              className="text-2xl font-extrabold leading-tight text-white sm:text-[2rem] xl:text-[2.5rem]"
            >
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 max-w-md text-sm font-medium leading-6 text-[#9dadc6] sm:text-[0.95rem]">
              {isLogin
                ? "Enter your details to manage your orders and explore fresh arrivals."
                : "Join Theni Store to save your details, track orders, and discover fresh arrivals."}
            </p>
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-[#36562f] bg-[#0d1c0b] px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8ec584]">
                  Demo Login
                </p>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {DEMO_CREDENTIALS.email}
                </p>
                <p className="mt-1 text-sm font-medium text-white/90">
                  {DEMO_CREDENTIALS.password}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setEmail(DEMO_CREDENTIALS.email);
                  setPassword(DEMO_CREDENTIALS.password);
                  setConfirmPassword(DEMO_CREDENTIALS.password);
                  setPasswordVisible(false);
                  setErrorMessage("");
                }}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#477640] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#3a6335]"
              >
                Use Demo Account
              </button>
            </div>
          </div>

          <form className="mt-6 space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            {!isLogin ? (
              <label className="block">
                <span className="text-sm font-semibold text-[#dce6f5]">
                  Full name
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#dce5ef] bg-white px-4 text-sm text-[#16213b] outline-none transition-colors focus:border-[#4f7d49] focus:ring-2 focus:ring-[#4f7d49]/20 sm:text-base"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-semibold text-[#dce6f5]">
                Email address
              </span>
              <input
                type="email"
                autoComplete={isLogin ? "email" : "username"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-[#dce5ef] bg-white px-4 text-sm text-[#16213b] outline-none transition-colors focus:border-[#4f7d49] focus:ring-2 focus:ring-[#4f7d49]/20 sm:text-base"
              />
            </label>

            <label className="block">
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-[#dce6f5]">
                <span>Password</span>
                {isLogin ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#4f7d49] hover:text-[#6a985d]"
                  >
                    Forgot password?
                  </button>
                ) : null}
              </span>
              <span className="mt-2 flex h-11 items-center rounded-xl border border-[#dce5ef] bg-white pr-2 transition-colors focus-within:border-[#4f7d49] focus-within:ring-2 focus-within:ring-[#4f7d49]/20">
                <input
                  type={passwordVisible ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-full min-w-0 flex-1 rounded-xl border-none bg-transparent px-4 text-sm text-[#16213b] outline-none sm:text-base"
                />
                <button
                  type="button"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                  onClick={() => setPasswordVisible((value) => !value)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#9aa8bc] transition-colors hover:bg-[#edf2f7] hover:text-[#4f7d49]"
                >
                  <EyeIcon hidden={passwordVisible} />
                </button>
              </span>
            </label>

            {!isLogin ? (
              <label className="block">
                <span className="text-sm font-semibold text-[#dce6f5]">
                  Confirm password
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-[#dce5ef] bg-white px-4 text-sm text-[#16213b] outline-none transition-colors focus:border-[#4f7d49] focus:ring-2 focus:ring-[#4f7d49]/20 sm:text-base"
                />
              </label>
            ) : null}

            {isLogin ? (
              <label className="inline-flex cursor-pointer items-center gap-3 text-sm font-medium text-[#9dadc6]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-[#dce5ef] accent-[#4f7d49]"
                />
                <span>Remember me for 30 days</span>
              </label>
            ) : null}

            {errorMessage ? (
              <p className="rounded-xl border border-[#7a2f2f] bg-[#2a1010] px-4 py-3 text-sm font-medium text-[#ffb4b4]">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="h-11 w-full rounded-xl bg-[#477640] text-sm font-bold text-white transition-colors hover:bg-[#3a6335] sm:text-base"
            >
              {isLogin ? "Sign in to Store" : "Create Account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 sm:my-7">
            <span className="h-px flex-1 bg-white/75" />
            <span className="rounded-sm bg-white px-4 py-1 text-xs font-medium text-[#60708e] sm:px-5 sm:text-sm">
              Or continue with
            </span>
            <span className="h-px flex-1 bg-white/75" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                const result = signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

                if (!result.success) {
                  setErrorMessage(result.message ?? "Unable to sign in.");
                  return;
                }

                onClose();
                router.push("/account");
              }}
              className="inline-flex h-10 items-center justify-center gap-3 rounded-xl border border-[#dce5ef] bg-white text-sm font-bold text-[#16213b] transition-colors hover:border-[#b8cfb2] sm:h-11"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const result = signIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);

                if (!result.success) {
                  setErrorMessage(result.message ?? "Unable to sign in.");
                  return;
                }

                onClose();
                router.push("/account");
              }}
              className="inline-flex h-10 items-center justify-center gap-3 rounded-xl border border-[#dce5ef] bg-white text-sm font-bold text-[#16213b] transition-colors hover:border-[#b8cfb2] sm:h-11"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-[#97a7c0]">
            {isLogin ? "Not a member? " : "Already have an account? "}
            <button
              type="button"
              className="text-[#4f7d49] hover:text-[#6a985d]"
              onClick={() => {
                const nextMode = isLogin ? "signup" : "login";
                setMode(nextMode);
                setPasswordVisible(false);
                setErrorMessage("");

                if (nextMode === "login") {
                  setEmail(DEMO_CREDENTIALS.email);
                  setPassword(DEMO_CREDENTIALS.password);
                  setConfirmPassword(DEMO_CREDENTIALS.password);
                }
              }}
            >
              {isLogin ? "Create an account for free" : "Sign in"}
            </button>
          </p>

          <footer className="mt-6 grid gap-3 border-t border-white/80 pt-5 text-[0.7rem] font-semibold text-[#97a7c0] sm:mt-auto sm:grid-cols-[1fr_auto] sm:items-center sm:text-xs">
            <p>&copy; 2026 Theni Stores. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              <button type="button" className="hover:text-white">
                Privacy
              </button>
              <button type="button" className="hover:text-white">
                Terms
              </button>
              <button type="button" className="hover:text-white">
                Help
              </button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}
