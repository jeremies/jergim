import React, { useState, useEffect } from "react";

const STORAGE_PREFIX = "rutina_v1_";

export default function Calendari() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutLogs, setWorkoutLogs] = useState([]);

  const loadWorkoutLogs = () => {
    const logsStr = localStorage.getItem(STORAGE_PREFIX + "workout_logs");
    if (logsStr) {
      try {
        setWorkoutLogs(JSON.parse(logsStr));
      } catch (e) {
        console.error("Error parsing workout logs", e);
      }
    } else {
      setWorkoutLogs([]);
    }
  };

  useEffect(() => {
    loadWorkoutLogs();
    window.addEventListener("rutina_workout_logged", loadWorkoutLogs);
    return () => {
      window.removeEventListener("rutina_workout_logged", loadWorkoutLogs);
    };
  }, []);

  const handleClearLogs = () => {
    if (window.confirm("Vols esborrar tot l'historial de rutines del calendari?")) {
      localStorage.removeItem(STORAGE_PREFIX + "workout_logs");
      setWorkoutLogs([]);
    }
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    // 0: Sunday, 1: Monday, ... 6: Saturday
    // Let's adjust to 0: Monday, 6: Sunday for a European calendar layout
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
    "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
  ];

  const weekdayNames = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];

  // Create an array for the calendar grid
  const calendarDays = [];
  
  // Fill previous month padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }

  // Fill current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Helper to format a day to YYYY-MM-DD
  const formatDateStr = (dayNum) => {
    if (!dayNum) return null;
    const dStr = String(dayNum).padStart(2, "0");
    const mStr = String(month + 1).padStart(2, "0");
    return `${year}-${mStr}-${dStr}`;
  };

  const getRoutinesForDay = (dayNum) => {
    const dateStr = formatDateStr(dayNum);
    if (!dateStr) return [];
    return workoutLogs.filter((log) => log.date === dateStr).map((log) => log.type);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto p-4 bg-slate-900 text-slate-100 min-h-screen">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Calendari de Rutines</h2>
          <p className="text-slate-400 text-sm">
            Visualitza els dies que has entrenat cada rutina.
          </p>
        </div>
        {workoutLogs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="px-4 py-2 bg-red-900/50 hover:bg-red-800/70 border border-red-700/50 hover:border-red-600 rounded-xl text-red-200 text-xs font-semibold transition-all shadow-md self-start sm:self-center cursor-pointer"
          >
            Esborrar calendar
          </button>
        )}
      </header>

      {/* Calendar Header Navigation */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            &larr; Prev
          </button>
          <h3 className="text-lg font-bold text-slate-100">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Seg &rarr;
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
          {weekdayNames.map((name) => (
            <div key={name} className="py-1">
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square bg-slate-900/20" />;
            }

            const dayDateStr = formatDateStr(day);
            const isToday = dayDateStr === todayStr;
            const routines = getRoutinesForDay(day);

            return (
              <div
                key={`day-${day}`}
                className={`aspect-square rounded-xl flex flex-col items-center justify-between p-1.5 border relative transition-all ${
                  isToday
                    ? "bg-slate-750 border-blue-500 shadow-md shadow-blue-500/10"
                    : "bg-slate-900/40 border-slate-850 hover:bg-slate-750/50"
                }`}
              >
                <span
                  className={`text-xs font-medium ${
                    isToday ? "text-blue-400 font-bold" : "text-slate-300"
                  }`}
                >
                  {day}
                </span>

                {/* Dot Container */}
                <div className="flex justify-center gap-1 mt-auto pb-0.5">
                  {routines.includes("PUSH") && (
                    <span
                      title="PUSH"
                      className="w-2 h-2 rounded-full bg-blue-500 block shadow-sm shadow-blue-500/50"
                    />
                  )}
                  {routines.includes("PULL") && (
                    <span
                      title="PULL"
                      className="w-2 h-2 rounded-full bg-emerald-500 block shadow-sm shadow-emerald-500/50"
                    />
                  )}
                  {routines.includes("LEG") && (
                    <span
                      title="LEG"
                      className="w-2 h-2 rounded-full bg-amber-500 block shadow-sm shadow-amber-500/50"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-slate-800/40 border border-slate-800/80 rounded-xl p-4 flex flex-wrap gap-4 justify-around text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 block" />
          <span>PUSH</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
          <span>PULL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 block" />
          <span>LEG</span>
        </div>
      </div>
    </div>
  );
}
