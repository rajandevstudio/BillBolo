import VoiceChat from "@/app/components/VoiceChat";

export default function VoicePage() {
  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Voice Invoice Assistant</h1>
      <div className="flex-1 flex items-center justify-center">
        <VoiceChat />
      </div>
    </div>
  );
}