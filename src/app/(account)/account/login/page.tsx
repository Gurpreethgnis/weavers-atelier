"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { linkGuestOrdersToAccount } from "@/lib/actions/account";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "magic-link" | "signup">("login");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const prefillEmail = searchParams.get("email") || "";

  const supabase = createClient();

  // Prefill email from URL param (e.g., from checkout success page)
  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Link any guest orders to this account
      const linkResult = await linkGuestOrdersToAccount(email);
      if (linkResult.linkedCount > 0) {
        toast.success(`Signed in! Linked ${linkResult.linkedCount} previous order(s) to your account.`);
      } else {
        toast.success("Signed in successfully");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
      toast.success("Check your email for the login link");
    } catch (error) {
      console.error("Magic link error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send magic link"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) throw error;

      toast.success("Check your email to confirm your account");
      setMagicLinkSent(true);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  if (magicLinkSent) {
    return (
      <div className="container-atelier py-8 md:py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="text-2xl font-heading font-semibold mb-4">
            Check your email
          </h1>
          <p className="text-on-surface-variant mb-6">
            We&apos;ve sent a {mode === "signup" ? "confirmation" : "login"} link
            to <strong>{email}</strong>
          </p>
          <p className="text-sm text-on-surface-variant">
            Didn&apos;t receive it?{" "}
            <button
              onClick={() => {
                setMagicLinkSent(false);
                setMode("magic-link");
              }}
              className="text-secondary hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-atelier py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue shopping
        </Link>

        <h1 className="text-3xl font-heading font-semibold mb-2">
          {mode === "signup" ? "Create Account" : "Sign In"}
        </h1>
        <p className="text-on-surface-variant mb-8">
          {mode === "signup"
            ? "Create an account to save your measurements and track orders"
            : "Sign in to access your account, orders, and saved measurements"}
        </p>

        {mode === "magic-link" ? (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="you@example.com"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Magic Link"
              )}
            </Button>

            <p className="text-center text-sm text-on-surface-variant">
              Or{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-secondary hover:underline"
              >
                sign in with password
              </button>
            </p>
          </form>
        ) : (
          <form
            onSubmit={mode === "signup" ? handleSignup : handlePasswordLogin}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary/20"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "signup" ? "Creating account..." : "Signing in..."}
                </>
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="space-y-2 text-center text-sm text-on-surface-variant">
              <p>
                <button
                  type="button"
                  onClick={() => setMode("magic-link")}
                  className="text-secondary hover:underline"
                >
                  Sign in with magic link instead
                </button>
              </p>
              <p>
                {mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="text-secondary hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-secondary hover:underline"
                    >
                      Create one
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
