import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "../config/supabase";
import { api } from "../config/api";

const LoketContext = createContext(null);

export function LoketProvider({ children }) {
  const [masterLoket, setMasterLoket] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMasterLoket = useCallback(async () => {
    try {
      const resData = await api.get("/api/loket");
      if (resData.success) {
        setMasterLoket(resData.data.map(l => ({
          ...l,
          kode: l.kode_loket,
          nama: l.nama_loket,
          kategori: l.layanan?.nama_layanan || "",
          estimasi_waktu: l.layanan?.estimasi_waktu || 3,
          aktif: "—",
          sisa: 0,
          selanjutnya: [],
          estimasi: 0,
        })));
      }
    } catch (err) {
      console.error("Gagal memuat master loket dari context:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterLoket();
  }, [fetchMasterLoket]);

  useEffect(() => {
    const channels = [
      supabase.channel("context_loket")
        .on("postgres_changes", { event: "*", schema: "public", table: "loket" }, fetchMasterLoket)
        .subscribe(),
      supabase.channel("realtime_sync")
        .on("broadcast", { event: "loket_berubah" }, fetchMasterLoket)
        .subscribe(),
    ];
    return () => channels.forEach((c) => supabase.removeChannel(c));
  }, [fetchMasterLoket]);

  return (
    <LoketContext.Provider value={{ masterLoket, setMasterLoket, loading }}>
      {children}
    </LoketContext.Provider>
  );
}

export function useLoket() {
  const ctx = useContext(LoketContext);
  if (!ctx) throw new Error("useLoket must be used within LoketProvider");
  return ctx;
}
