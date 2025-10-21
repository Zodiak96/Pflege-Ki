import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Stethoscope, Upload, ShieldCheck, Database, MessageSquarePlus, Loader2 } from "lucide-react";

export default function PflegeKIWundassistent() {
  const [profile, setProfile] = useState({
    bereich: "Wundversorgung",
    disclaimerAkzeptiert: false,
  });

  const [form, setForm] = useState({
    wundart: "",
    lokalisation: "",
    groesse: "",
    exsudat: "",
    geruch: "",
    wundrand: "",
    wundgrund: "",
    schmerz: "",
    infektion: "",
    komorbid: "",
    allergien: "",
    medikation: "",
    ziel: "Beratung zur nächsten pflegerischen Maßnahme",
  });

  const [imageName, setImageName] = useState(null);
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hallo 👋 Ich bin dein KI-Wundassistent. Beschreibe deine Situation oder fülle links das Formular aus, um pflegerische Hinweise zu erhalten.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text) {
    const userText = (text ?? input).trim();
    if (!userText) return;
    if (!profile.disclaimerAkzeptiert) {
      alert("Bitte zuerst den Haftungsausschluss akzeptieren.");
      return;
    }

    const newMessages = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Verbindung zur KI fehlgeschlagen." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white grid place-items-center">
          <Stethoscope size={20} />
        </div>
        <h1 className="font-semibold text-lg">
          Amanah Pflege – KI-Wundassistent
        </h1>
      </header>

      <main className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-4 p-4">
        <section className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <MessageSquarePlus size={18} /> Wundangaben
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Wundart", "wundart"],
              ["Lokalisation", "lokalisation"],
              ["Größe", "groesse"],
              ["Exsudat", "exsudat"],
              ["Geruch", "geruch"],
              ["Wundrand", "wundrand"],
              ["Wundgrund", "wundgrund"],
              ["Schmerz", "schmerz"],
              ["Infektion", "infektion"],
            ].map(([label, key]) => (
              <label key={key} className="text-sm">
                <span>{label}</span>
                <input
                  className="w-full border rounded-lg px-2 py-1"
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                />
              </label>
            ))}
            <label className="col-span-2 flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={profile.disclaimerAkzeptiert}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    disclaimerAkzeptiert: e.target.checked,
                  }))
                }
              />
              Ich bestätige, dass dies keine ärztliche Diagnose ersetzt.
            </label>
          </div>
          <button
            onClick={() =>
              sendMessage(
                "Bitte gib mir pflegerische Hinweise zur Wundbeobachtung und Versorgung."
              )
            }
            className="mt-3 bg-blue-600 text-white rounded-lg px-3 py-2 text-sm"
          >
            Vorschläge generieren
          </button>
        </section>

        <section className="bg-white p-4 rounded-xl shadow flex flex-col">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Bot size={18} /> Chat
          </h2>
          <div className="flex-1 overflow-auto space-y-2 border rounded-lg p-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${
                  m.role === "user"
                    ? "text-right text-blue-700"
                    : "text-left text-gray-800"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm">Denke nach …</div>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 border rounded-lg px-2 py-1"
              placeholder="Nachricht eingeben…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={() => sendMessage()}
              className="bg-blue-600 text-white rounded-lg px-3 py-1 flex items-center gap-1"
            >
              <Send size={16} /> Senden
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
