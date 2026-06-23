import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";

export default function useLoginAdmin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showSelectLoketModal, setShowSelectLoketModal] = useState(false);
  const [listLoketTugas, setListLoketTugas] = useState([]);
  const [fetchError, setFetchError] = useState("");

  const isAdminLoggedIn = !!sessionStorage.getItem("tokenAdmin");

  const fetchLoketList = async () => {
    try {
      setFetchError("");
      const resData = await api.get("/api/loket");
      if (resData.success) {
        setListLoketTugas(resData.data);
      } else {
        setFetchError(resData.message || "Gagal memuat daftar loket.");
      }
    } catch (err) {
      setFetchError("Koneksi ke server gagal. Pastikan server menyala.");
      console.error("Gagal memuat daftar loket:", err);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan Kata Sandi wajib diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const resData = await api.post("/api/auth/login", { username, password });

      if (!resData.success) {
        throw new Error(resData.message || "Akses Ditolak!");
      }

      sessionStorage.removeItem("loket_tugas_aktif");
      sessionStorage.setItem("tokenAdmin", resData.token);
      sessionStorage.setItem("adminProfileData", JSON.stringify({
        id: resData.data.id,
        username: resData.data.username,
        nama: resData.data.nama_staf,
        id_layanan: resData.data.id_layanan,
        nama_layanan: resData.data.nama_layanan,
      }));

      setShowSelectLoketModal(true);
      fetchLoketList();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePilihLoket = async (loket) => {
    const token = sessionStorage.getItem("tokenAdmin");
    if (!token) return;

    try {
      const resData = await api.patch("/api/loket/pilih", { id_loket: loket.id }, token);

      if (!resData.success) {
        throw new Error(resData.message || "Gagal memilih loket.");
      }

      sessionStorage.setItem("loket_tugas_aktif", JSON.stringify({
        id: resData.data.id,
        kode: resData.data.kode_loket,
        nama: resData.data.nama_loket,
        id_layanan: resData.data.id_layanan,
        status: resData.data.status,
      }));

      setShowSelectLoketModal(false);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleAdminLogin,
    showSelectLoketModal,
    setShowSelectLoketModal,
    listLoketTugas,
    handlePilihLoket,
    fetchError,
    fetchLoketList,
    isAdminLoggedIn,
    navigate,
  };
}
