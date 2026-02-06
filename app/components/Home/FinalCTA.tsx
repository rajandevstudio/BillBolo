"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-28 bg-blue-600 text-white text-center">
      <h3 className="text-4xl font-bold mb-6">
        Start billing with your voice today.
      </h3>

      <p className="text-lg mb-10 opacity-90">
        No training. No software. Just WhatsApp.
      </p>

      <SignedIn>
        <Link href="/dashboard">
          <button className="bg-white text-blue-600 text-xl px-10 py-4 rounded-xl font-semibold shadow-lg">
            Open Dashboard →
          </button>
        </Link>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="bg-white text-blue-600 text-xl px-10 py-4 rounded-xl font-semibold shadow-lg">
            Get Started Free
          </button>
        </SignInButton>
      </SignedOut>
    </section>
  );
}
