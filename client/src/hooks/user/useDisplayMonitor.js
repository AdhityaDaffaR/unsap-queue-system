import { useState, useEffect, useRef } from "react";
import { supabase } from "../../config/supabase";
import { useLoket } from "../../context/LoketContext";

export default function useDisplayMonitor() {
  const { masterLoket, layananList } = useLoket();

  const previousNomorRef = useRef({});
  const audioReadyRef = useRef(false);
  const preferredVoiceRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);

  const getPreferredVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const indo = voices.find((v) => v.lang.startsWith("id"));
    if (indo) return indo;
    const msMy = voices.find((v) => v.lang.startsWith("ms"));
    if (msMy) return msMy;
    return voices.find((v) => v.lang.startsWith("en")) || null;
  };

  useEffect(() => {
    const loadVoices = () => { preferredVoiceRef.current = getPreferredVoice(); };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const activateAudio = () => {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      window.speechSynthesis.speak(u);
      audioReadyRef.current = true;
      setAudioReady(true);
    } catch (err) { console.error("❌ Gagal mengaktifkan audio:", err); }
  };

  const playAnnouncementAudio = (nomorDisplay, loketKode) => {
    if (!audioReadyRef.current) return;
    try {
      const message = `Nomor antrian ${nomorDisplay}, silahkan menuju loket ${loketKode}`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      if (preferredVoiceRef.current) utterance.voice = preferredVoiceRef.current;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch (err) { console.error("❌ Gagal memainkan audio:", err); }
  };

  useEffect(() => {
    masterLoket.forEach((loket) => {
      const nomorLama = previousNomorRef.current[loket.kode] || "—";
      const nomorBaru = loket.aktif;
      if (nomorBaru !== "—" && nomorBaru !== nomorLama) {
        playAnnouncementAudio(nomorBaru, loket.kode);
      }
      previousNomorRef.current[loket.kode] = nomorBaru;
    });
  }, [masterLoket]);

  useEffect(() => {
    const channel = supabase.channel("recall_announcement")
      .on("broadcast", { event: "panggil_ulang" }, (payload) => {
        playAnnouncementAudio(payload.payload.nomor_display, payload.payload.loket);
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  return { masterLoket, layananList, audioReady, activateAudio };
}
