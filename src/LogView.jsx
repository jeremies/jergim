import React, { useState, useEffect } from "react";

const STORAGE_PREFIX = "rutina_v1_";

export default function LogView() {
  const [logs, setLogs] = useState([]);

  const loadLogs = () => {
    const logsStr = localStorage.getItem(STORAGE_PREFIX + "change_logs");
    if (logsStr) {
      try {
        setLogs(JSON.parse(logsStr));
      } catch (e) {
        console.error("Error parsing logs from localStorage", e);
      }
    } else {
      setLogs([]);
    }
  };

  useEffect(() => {
    loadLogs();

    // Listen for updates from other views (like when updating values in Rutina tab)
    window.addEventListener("rutina_log_updated", loadLogs);
    return () => {
      window.removeEventListener("rutina_log_updated", loadLogs);
    };
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Segur que vols esborrar tot l'historial de canvis?")) {
      localStorage.removeItem(STORAGE_PREFIX + "change_logs");
      setLogs([]);
    }
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("ca-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-slate-900 text-slate-100 min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Historial de Canvis</h2>
          <p className="text-slate-400 text-sm">
            Registre de tots els valors guardats automàticament.
          </p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800/70 border border-red-700/50 hover:border-red-600 rounded-xl text-red-200 text-xs font-semibold transition-all shadow-md self-start sm:self-center cursor-pointer"
          >
            Esborrar registre
          </button>
        )}
      </header>

      {logs.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 border border-dashed border-slate-700/50 rounded-2xl">
          <p className="text-slate-400 mb-2">No hi ha cap canvi registrat encara.</p>
          <p className="text-slate-500 text-xs">
            Els canvis apareixeran aquí a mesura que modifiquis els pesos dels exercicis.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-800/80 border border-slate-700/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-sm transition-all hover:bg-slate-800 hover:border-slate-700"
            >
              <div className="flex flex-col">
                <span className="font-medium text-slate-200">{log.exerciseName}</span>
                <span className="text-slate-500 text-xs mt-0.5">
                  {formatDate(log.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 sm:mt-0 self-start sm:self-center">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    log.field === "Efectiu"
                      ? "bg-blue-950/40 text-blue-300 border-blue-800/40"
                      : "bg-amber-950/40 text-amber-300 border-amber-800/40"
                  }`}
                >
                  {log.field}
                </span>
                <span className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 font-bold text-sm text-blue-400 text-right min-w-[70px]">
                  {log.value || "—"} <span className="text-[10px] text-slate-500 font-normal">kg</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
