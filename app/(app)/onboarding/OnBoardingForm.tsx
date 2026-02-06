"use client";

import { useState } from "react";

export default function OnboardingForm({ userId }: { userId: string}) {
  const [phone, setPhone] = useState("");

  const handleSavePhone = async () => {
    await fetch("/api/user/update", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    window.location.href = "/dashboard";
  };


  return (
    <div className="max-w-lg mx-auto mt-24 bg-white p-10 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Enter your WhatsApp Number
      </h2>

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="91XXXXXXXXXX"
        className="w-full border p-3 rounded mb-6 text-gray-700"
      />

      <button
        onClick={handleSavePhone}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full text-center"
      >
        Save & Continue
      </button>
    </div>
  );
}
