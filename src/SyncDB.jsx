import { useState, useEffect } from "react";

const TOKEN_KEY = "jergim_github_token";
const GIST_ID_KEY = "jergim_gist_id";
const DB_FILENAME = "jergim-db.json";
const DB_PREFIX = "rutina_v1_";

export default function SyncDB() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [gistId, setGistId] = useState(() => localStorage.getItem(GIST_ID_KEY) || "");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const saveConfig = () => {
    localStorage.setItem(TOKEN_KEY, token.trim());
    localStorage.setItem(GIST_ID_KEY, gistId.trim());
    setStatus({ type: "success", message: "Configuration saved successfully!" });
  };

  const getLocalStorageData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(DB_PREFIX)) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  };

  const pushToGist = async () => {
    if (!token.trim() || !gistId.trim()) {
      setStatus({ type: "error", message: "Token and Gist ID are required to push." });
      return;
    }
    if (!confirm("Are you sure you want to push your local data to the Gist? This will overwrite the Gist data.")) {
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const localData = getLocalStorageData();
      const response = await fetch(`https://api.github.com/gists/${gistId.trim()}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          files: {
            [DB_FILENAME]: {
              content: JSON.stringify(localData, null, 2),
            },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      setStatus({ type: "success", message: "Data successfully pushed to GitHub Gist!" });
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: `Failed to push: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const pullFromGist = async () => {
    if (!gistId.trim()) {
      setStatus({ type: "error", message: "Gist ID is required to pull data." });
      return;
    }
    if (!confirm("Are you sure you want to pull data from the Gist? This will overwrite your current local workout data.")) {
      return;
    }

    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const headers = {};
      if (token.trim()) {
        headers["Authorization"] = `Bearer ${token.trim()}`;
      }

      const response = await fetch(`https://api.github.com/gists/${gistId.trim()}`, {
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const gist = await response.json();
      const file = gist.files[DB_FILENAME];

      if (!file || !file.content) {
        throw new Error(`File '${DB_FILENAME}' not found in the specified Gist.`);
      }

      const remoteData = JSON.parse(file.content);

      // Clear existing local storage data starting with DB_PREFIX
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(DB_PREFIX)) {
          localStorage.removeItem(key);
        }
      }

      // Write retrieved data
      for (const [key, val] of Object.entries(remoteData)) {
        if (key.startsWith(DB_PREFIX) && typeof val === "string") {
          localStorage.setItem(key, val);
        }
      }

      setStatus({ type: "success", message: "Data successfully pulled! Reloading page..." });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: `Failed to pull: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        GitHub Gist Sync
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            GitHub Personal Access Token
          </label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="ghp_..."
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Gist ID
          </label>
          <input
            type="text"
            value={gistId}
            onChange={(e) => setGistId(e.target.value)}
            placeholder="e.g. dbd336c784768f3f8d0fbb3cbbe060c7"
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
          />
        </div>

        <button
          onClick={saveConfig}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm transition-colors border border-slate-700 hover:border-slate-600 cursor-pointer"
        >
          Save Configuration
        </button>
      </div>

      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">Actions</span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={pushToGist}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Push to Gist
        </button>

        <button
          onClick={pullFromGist}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-indigo-900/20 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Pull from Gist
        </button>
      </div>

      {status.message && (
        <div
          className={`mt-6 p-4 rounded-lg text-sm flex gap-3 items-start border ${
            status.type === "success"
              ? "bg-emerald-950/40 border-emerald-800/50 text-emerald-300"
              : "bg-rose-950/40 border-rose-800/50 text-rose-300"
          }`}
        >
          {status.type === "success" ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
