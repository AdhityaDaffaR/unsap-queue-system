import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoket } from "../../context/LoketContext";

const formatNamaMahasiswa = (namaLengkap) => {
  if (!namaLengkap) return "Guest Civitas";
  const kata = namaLengkap.trim().split(/\s+/);
  if (kata.length <= 2) return namaLengkap;
  const duaKataPertama = kata.slice(0, 2).join(" ");
  const sisaInisial = kata.slice(2).map((k) => `${k.charAt(0).toUpperCase()}.`).join(" ");
  return `${duaKataPertama} ${sisaInisial}`;
};

const getIsLoggedIn = () => localStorage.getItem("isLoggedInUser") === "true";
const getProfile = () => {
  const saved = localStorage.getItem("userProfileData");
  if (saved) {
    const parsed = JSON.parse(saved);
    return { nama: formatNamaMahasiswa(parsed.nama), nim: parsed.npm || "—" };
  }
  return { nama: "Guest Civitas", nim: "—" };
};

export default function useStatusLoket() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);
  const [userProfile, setUserProfile] = useState(getProfile);

  useEffect(() => {
    const sync = () => { setIsLoggedIn(getIsLoggedIn()); setUserProfile(getProfile()); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

  const { masterLoket, layananList } = useLoket();

  const handleLogout = () => {
    ["tokenMahasiswa", "isLoggedInUser", "userProfileData", "nomorTiketAktif", "idAntreanAktif"].forEach((k) => localStorage.removeItem(k));
    setIsLoggedIn(false);
    navigate("/");
  };

  const layananTersaring = layananList.filter(
    (layanan) =>
      layanan.subTeks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.kodeDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layanan.kategori.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return { isLoggedIn, userProfile, handleLogout, searchQuery, setSearchQuery, daftarLoket: layananTersaring };
}
