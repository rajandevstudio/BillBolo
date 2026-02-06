"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-200 opacity-30 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <span className="inline-block mb-6 bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-semibold">
          Works directly on WhatsApp
        </span>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Bolo. <span className="text-blue-600">Bill</span> ho jayega.
        </h1>

        {/* Subtext */}
        <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
          Kirana, chai, bakery — just send a voice note.  
          BillBolo creates and sends a professional GST invoice in seconds.
        </p>

        {/* CTA */}
        <div className="mt-12 flex justify-center gap-6">
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-4 rounded-xl shadow-xl transition">
                Open Dashboard →
              </button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-black hover:bg-gray-900 text-white text-lg px-10 py-4 rounded-xl shadow-xl transition">
                Get Started Free
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-gray-400">
          No typing. No software. No learning.
        </p>
      </div>
    </section>
  );
}
