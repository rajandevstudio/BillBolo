import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">VoiceOS 🤖</h1>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto mt-10 p-6 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Run your Business with your Voice.
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Stop typing. Just speak. Generate invoices, track udhaar, and manage stock instantly.
        </p>

        <SignedIn>
          <Link href="/dashboard">
            <button className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-4 rounded-xl shadow-lg transition">
              Go to Dashboard →
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <div className="bg-white p-6 rounded-xl shadow-md inline-block">
            <p className="text-gray-500">Sign in to manage your shop.</p>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}