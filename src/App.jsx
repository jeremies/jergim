import { useState } from "react";
import PWABadge from "./PWABadge.jsx";
import "./App.css";
import Rutina from "./Rutina.jsx";

function App() {
  const [currentView, setCurrentView] = useState("rutina");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Header / Navigation Bar */}
      <nav className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Jergim
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentView("rutina")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === "rutina" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Rutina
          </button>
          <button
            onClick={() => setCurrentView("historial")}
            className={`text-sm font-medium transition-colors cursor-pointer ${
              currentView === "historial" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Historial
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        {currentView === "rutina" ? (
          <Rutina />
        ) : (
          <div className="max-w-2xl mx-auto p-8 text-center text-slate-400">
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Historial d&apos;Entrenaments</h2>
            <p>Aquesta secció s&apos;implementarà properament.</p>
          </div>
        )}
      </div>

      <PWABadge />
    </div>
  );
}

export default App;
