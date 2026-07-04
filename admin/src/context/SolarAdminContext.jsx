import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const SolarAdminContext = createContext();

const SolarAdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem("aToken") ? localStorage.getItem("aToken") : "");
  const [telemetrie, setTelemetrie] = useState([]);
  const [incarcare, setIncarcare] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const obtineDateTelemetrie = async () => {
    try {
      setIncarcare(true);
      const { data } = await axios.get(`${backendUrl}/api/telemetrie/list`, {
        headers: { aToken }
      });

      if (data.success) {
        setTelemetrie(data.date);
      } else {
        toast.error(data.message || "Eroare la preluarea datelor.");
      }
    } catch (error) {
      console.error("Eroare la încărcarea telemetriei:", error);
      toast.error(error.response?.data?.message || "Nu s-a putut contacta serverul.");
    } finally {
      setIncarcare(false);
    }
  };

  const schimbaModHardware = async (noulMod) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/operator/set-mod`, { mod: noulMod }, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(`Modul ${noulMod} salvat cu succes pe server!`);
      } else {
        toast.error("Serverul a respins schimbarea modului.");
      }
    } catch (error) {
      console.error("Eroare la trimiterea modului:", error);
      toast.error("Eroare de rețea. Nu s-a putut trimite comanda.");
    }
  };

  const trimiteUnghiuriHardware = async (h, v) => {
    try {
      await axios.post(`${backendUrl}/api/operator/set-unghiuri`, { unghiH: h, unghiV: v }, {
        headers: { aToken }
      });
    } catch (error) {
      console.error("Eroare la trimiterea unghiurilor manuale:", error);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    telemetrie,
    obtineDateTelemetrie,
    schimbaModHardware,
    trimiteUnghiuriHardware,
    incarcare
  };

  return (
    <SolarAdminContext.Provider value={value}>
      {children}
    </SolarAdminContext.Provider>
  );
};

export default SolarAdminContextProvider;