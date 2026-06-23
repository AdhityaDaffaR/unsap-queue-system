import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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

  const fetchMonitorData = useCallback(async () => {
    try {
      const resData = await api.get("/api/antrean/monitor");
      if (resData.success) {
        const { sedangDipanggil, sedangMenunggu } = resData.data;
        setMasterLoket((prev) =>
          prev.map((loket) => {
            const dipanggil = sedangDipanggil.find((a) => a.nomor_loket === loket.kode);
            const menunggu = sedangMenunggu.filter((a) => a.id_layanan === loket.id_layanan).map((a) => a.nomor_display);
            return { ...loket, aktif: dipanggil ? dipanggil.nomor_display : "—", selanjutnya: menunggu, sisa: menunggu.length, estimasi: Math.ceil(menunggu.length * (loket.estimasi_waktu || 3)) };
          })
        );
      }
    } catch (err) {
      console.error("Gagal sinkronisasi monitor dari context:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchMasterLoket();
  }, [fetchMasterLoket]);

  useEffect(() => {
    fetchMonitorData();
    const channels = [
      supabase.channel("context_loket")
        .on("postgres_changes", { event: "*", schema: "public", table: "loket" }, fetchMasterLoket)
        .subscribe(),
      supabase.channel("context_antrean")
        .on("postgres_changes", { event: "*", schema: "public", table: "antrean" }, fetchMonitorData)
        .subscribe(),
      supabase.channel("realtime_sync")
        .on("broadcast", { event: "loket_berubah" }, fetchMasterLoket)
        .on("broadcast", { event: "antrean_berubah" }, fetchMonitorData)
        .subscribe(),
    ];
    return () => channels.forEach((c) => supabase.removeChannel(c));
  }, [fetchMasterLoket, fetchMonitorData]);

  const layananList = useMemo(() => {
    const groups = {};
    masterLoket.forEach(l => {
      if (!groups[l.id_layanan]) groups[l.id_layanan] = [];
      groups[l.id_layanan].push(l);
    });
    return Object.values(groups).map(group => {
      const first = group[0];
      const kategori = first.kategori;
      const aktifLoket = group.find(l => l.aktif !== "—" && l.status === "buka");
      const aktifVal = group.find(l => l.aktif !== "—")?.aktif || "—";
      return {
        id: first.id_layanan,
        kategori,
        judulTampilan: kategori.toUpperCase(),
        judul: kategori.toUpperCase(),
        kodeDisplay: "LOKET " + group.map(l => l.kode).join(" / "),
        subTeks: first.nama || "",
        subLayanan: first.nama || "",
        status: group.some(l => l.status === "buka") ? "Buka" : "Tutup",
        sisa: first.sisa || 0,
        sisaAntrean: first.sisa || 0,
        estimasi: first.estimasi || 0,
        aktifDisplay: aktifVal,
        nomorAktif: aktifVal,
        selanjutnyaList: first.selanjutnya || [],
        konterFisikAktif: aktifLoket?.kode || null,
      };
    });
  }, [masterLoket]);

  return (
    <LoketContext.Provider value={{ masterLoket, setMasterLoket, loading, refreshMonitorData: fetchMonitorData, layananList }}>
      {children}
    </LoketContext.Provider>
  );
}

export function useLoket() {
  const ctx = useContext(LoketContext);
  if (!ctx) throw new Error("useLoket must be used within LoketProvider");
  return ctx;
}
