import React, { useEffect, useState } from "react";

// RutinaPushPullLeg.jsx
// Single-file React component (default export) using Tailwind for styling.
// - Guarda valors a localStorage
// - Filtra per PUSH / PULL / LEG
// - Inputs numèrics per pes efectiu i pes d'aproximació

const STORAGE_PREFIX = "rutina_v1_";

const initialData = {
  PUSH: [
    {
      id: "push-press-pla-maquina",
      name: "Press plà màquina hammer",
      series: "4 x 12",
    },
    {
      id: "push-obertures-pec-fly",
      name: "Obertures màquina pec-fly",
      series: "4 x 12",
    },
    {
      id: "push-fondos-paral",
      name: "Fondos amb paral·leles",
      series: "4 x 12",
    },
    {
      id: "push-press-hombro",
      name: "Press hombro manuelles",
      series: "4 x 12",
    },
    {
      id: "push-elev-post",
      name: "Elevacions posteriors màquina",
      series: "4 x 12",
    },
    {
      id: "push-elev-lat",
      name: "Elevacions laterals manuella",
      series: "4 x 12",
    },
    { id: "push-ext-triceps", name: "Extensió de tríceps", series: "5 x 12" },
    {
      id: "push-press-frances",
      name: 'Press francès barra "Z"',
      series: "4 x 12",
    },
  ],
  PULL: [
    { id: "pull-jalones", name: "Jalones amb barra llarga", series: "4 x 12" },
    { id: "pull-rem-baix", name: "Rem baix", series: "4 x 12" },
    { id: "pull-pullover", name: "Pullover politja", series: "4 x 12" },
    {
      id: "pull-curl-recta",
      name: "Curl biceps de peu barra recta",
      series: "4 x 12",
    },
    { id: "pull-curl-aranya", name: "Curl biceps aranya", series: "5 x 12" },
    { id: "pull-crunchs", name: "Crunchs bicicleta", series: "4 x 12" },
    { id: "pull-planxa", name: "Planxa", series: "3 x 12" },
  ],
  LEG: [
    { id: "leg-squats", name: "Squats barra lliure", series: "4 x 12" },
    {
      id: "leg-extensions",
      name: "Extensions de cuádriceps màquina hammer",
      series: "4 x 12",
    },
    { id: "leg-zancadas", name: "Zancadas dinàmiques", series: "4 x 12" },
    { id: "leg-pes-mort", name: "Pes mort romanés", series: "4 x 12" },
    { id: "leg-curl", name: "Curl femoral assentat", series: "4 x 12" },
    { id: "leg-hip", name: "Hip Thrust", series: "4 x 12" },
    {
      id: "leg-elev-talo",
      name: "Elevacions de taló amb cames extensió",
      series: "6 x 20",
    },
  ],
};

function loadSaved(sectionId, field) {
  const key = STORAGE_PREFIX + sectionId + "_" + field;
  const raw = localStorage.getItem(key);
  return raw !== null && raw !== undefined && raw !== "" ? raw : "";
}

function saveValue(sectionId, field, value) {
  const key = STORAGE_PREFIX + sectionId + "_" + field;
  localStorage.setItem(key, value);
}

function clearAllStorage() {
  Object.keys(localStorage).forEach((k) => {
    if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
  });
}

export default function Rutina() {
  const [filter, setFilter] = useState(
    () => localStorage.getItem(STORAGE_PREFIX + "selected_filter") || "all"
  );

  // state for inputs: { [id]: { eff: "", warm: "" } }
  const [values, setValues] = useState(() => {
    const obj = {};
    Object.keys(initialData).forEach((section) => {
      initialData[section].forEach((ex) => {
        obj[ex.id] = {
          eff: loadSaved(ex.id, "eff"),
          warm: loadSaved(ex.id, "warm"),
        };
      });
    });
    return obj;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "selected_filter", filter);
  }, [filter]);

  // handler for numeric input
  const handleChange = (id, field, val) => {
    // allow blank or numeric (we keep as string to preserve empty)
    if (val === "" || /^\d*(?:[.,]\d+)?$/.test(val)) {
      setValues((prev) => {
        const copy = { ...prev, [id]: { ...prev[id], [field]: val } };
        return copy;
      });
      saveValue(id, field, val);
    }
  };

  const handleClear = () => {
    if (!confirm("Vols esborrar tots els valors guardats?")) return;
    clearAllStorage();
    // reset state to empty strings
    const empty = {};
    Object.keys(initialData).forEach((section) => {
      initialData[section].forEach((ex) => {
        empty[ex.id] = { eff: "", warm: "" };
      });
    });
    setValues(empty);
    setFilter("all");
  };

  const renderSection = (sectionName) => {
    const list = initialData[sectionName];
    return (
      <div key={sectionName} className="mb-6">
        <div className="text-blue-300 font-semibold text-lg mb-3">
          Exercicis {sectionName}
        </div>
        <div className="overflow-x-auto bg-slate-800 rounded-lg p-3">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-sm">
                <th className="pb-2">Exercici</th>
                <th className="pb-2">Series / Reps</th>
                <th className="pb-2 text-right">Pes efectiu (kg)</th>
                <th className="pb-2 text-right">Pes aproximació (kg)</th>
              </tr>
            </thead>
            <tbody>
              {list.map((ex) => (
                <tr key={ex.id} className="border-t border-slate-700">
                  <td className="py-3 pr-4 w-1/2">{ex.name}</td>
                  <td className="py-3 text-slate-400">{ex.series}</td>
                  <td className="py-3 text-right">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-28 text-right bg-slate-900 px-2 py-1 rounded-md border border-slate-700"
                      value={values[ex.id]?.eff || ""}
                      onChange={(e) =>
                        handleChange(
                          ex.id,
                          "eff",
                          e.target.value.replace(",", ".")
                        )
                      }
                      placeholder="kg"
                    />
                  </td>
                  <td className="py-3 text-right">
                    <input
                      type="text"
                      inputMode="decimal"
                      className="w-28 text-right bg-slate-900 px-2 py-1 rounded-md border border-slate-700"
                      value={values[ex.id]?.warm || ""}
                      onChange={(e) =>
                        handleChange(
                          ex.id,
                          "warm",
                          e.target.value.replace(",", ".")
                        )
                      }
                      placeholder="kg"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-900 text-slate-100 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Rutina: PUSH / PULL / LEG</h1>
          <p className="text-slate-400 text-sm">
            Introdueix el pes efectiu i el pes d'aproximació per cada exercici.
            Es guarda automàticament al navegador.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-slate-300">
            <input
              type="radio"
              name="sel"
              value="all"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            Tots
          </label>
          <label className="flex items-center gap-2 text-amber-300">
            <input
              type="radio"
              name="sel"
              value="PUSH"
              checked={filter === "PUSH"}
              onChange={() => setFilter("PUSH")}
            />
            PUSH
          </label>
          <label className="flex items-center gap-2 text-emerald-300">
            <input
              type="radio"
              name="sel"
              value="PULL"
              checked={filter === "PULL"}
              onChange={() => setFilter("PULL")}
            />
            PULL
          </label>
          <label className="flex items-center gap-2 text-violet-300">
            <input
              type="radio"
              name="sel"
              value="LEG"
              checked={filter === "LEG"}
              onChange={() => setFilter("LEG")}
            />
            LEG
          </label>
        </div>
      </div>

      <div>
        {(filter === "all" || filter === "PUSH") && renderSection("PUSH")}
        {(filter === "all" || filter === "PULL") && renderSection("PULL")}
        {(filter === "all" || filter === "LEG") && renderSection("LEG")}
      </div>

      <div className="flex items-center justify-end gap-3 mt-4">
        <button
          className="px-4 py-2 rounded-md border border-slate-700 text-slate-300"
          onClick={handleClear}
        >
          Esborrar valors
        </button>
        <button
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-semibold"
          onClick={() => alert("Els valors ja es guarden automàticament.")}
        >
          Desar ara
        </button>
      </div>
    </div>
  );
}
