import React, { useEffect, useState } from "react";

// RutinaPushPullLeg.jsx — versió mobile-first amb Tailwind
// - Responsive, simple i clara per mòbil
// - Guarda valors a localStorage
// - Filtra per PUSH / PULL / LEG

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
      series: "5 x 12",
    },
    { id: "pull-curl-aranya", name: "Curl biceps aranya", series: "4 x 12" },
    { id: "pull-crunchs", name: "Crunchs bicicleta", series: "3 x 12" },
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

const getSaved = (id, field) =>
  localStorage.getItem(STORAGE_PREFIX + id + "_" + field) || "";
const saveValue = (id, field, val) =>
  localStorage.setItem(STORAGE_PREFIX + id + "_" + field, val);

const InputField = ({ id, field, placeholder, initialValue }) => {
  const [value, setValue] = useState(() => getSaved(id, field) || initialValue);

  const handleChange = (val) => {
    setValue(val);
    saveValue(id, field, val);
  };

  return (
    <input
      type="number"
      inputMode="decimal"
      placeholder={placeholder}
      className="w-28 bg-slate-900 border border-slate-700 rounded-lg p-2 text-right text-sm"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
};

export default function RutinaPushPullLeg() {
  const [filter, setFilter] = useState(
    () => localStorage.getItem(STORAGE_PREFIX + "selected_filter") || "PUSH"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + "selected_filter", filter);
  }, [filter]);

  const Section = ({ name }) => (
    <div className="mb-6">
      <h2 className="text-blue-400 font-semibold text-lg mb-3 text-center md:text-left">
        Exercicis {name}
      </h2>
      <div className="flex flex-col gap-3">
        {initialData[name].map((ex) => (
          <div
            key={ex.id}
            className="bg-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">{ex.name}</span>
              <span className="text-slate-400 text-sm">{ex.series}</span>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <InputField
                id={ex.id}
                field="eff"
                placeholder="Efectiu (kg)"
                initialValue=""
              />
              <InputField
                id={ex.id}
                field="warm"
                placeholder="Aprox. (kg)"
                initialValue=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="max-w-2xl mx-auto p-4 bg-slate-900 text-slate-100 min-h-screen">
      <header className="mb-4 text-center">
        <h3 className="text-xl font-semibold">Rutina: PUSH / PULL / LEG</h3>
        <p className="text-slate-400 text-sm">
          Afegeix el pes efectiu i d'aproximació. Es guarda automàticament.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["PUSH", "PULL", "LEG"].map((v) => (
          <label
            key={v}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer ${
              filter === v ? "bg-blue-600" : "bg-slate-700"
            }`}
          >
            <input
              type="radio"
              name="filter"
              value={v}
              checked={filter === v}
              onChange={() => setFilter(v)}
              className="hidden"
            />
            {v.toUpperCase()}
          </label>
        ))}
      </div>

      {filter === "PUSH" && <Section name="PUSH" />}
      {filter === "PULL" && <Section name="PULL" />}
      {filter === "LEG" && <Section name="LEG" />}
    </main>
  );
}
