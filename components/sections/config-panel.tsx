"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Settings = {
  animacoes: boolean;
  densidade: "normal" | "compacto";
  ticker: boolean;
  contraste: boolean;
};

const DEFAULT: Settings = {
  animacoes: true,
  densidade: "normal",
  ticker: true,
  contraste: false,
};
const KEY = "cockpit_cfg";

function load(): Settings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
  } catch {
    return DEFAULT;
  }
}

function applyBody(s: Settings) {
  const b = document.body.classList;
  b.toggle("cfg-no-anim", !s.animacoes);
  b.toggle("cfg-compact", s.densidade === "compacto");
  b.toggle("cfg-no-ticker", !s.ticker);
  b.toggle("cfg-contrast", s.contraste);
}

export function ConfigPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [s, setS] = useState<Settings>(() => load());

  // Aplica/persiste (DOM + localStorage, sem setState → ok com as regras React 19).
  useEffect(() => {
    applyBody(s);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s]);

  return (
    <div className={`cfg-overlay ${open ? "visible" : ""}`} onClick={onClose}>
      <div
        className="cfg-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Configurações"
      >
        <div className="cfg-head">
          <div className="cfg-title">Configurações do Cockpit</div>
          <button
            className="cfg-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <label className="cfg-row">
          <div>
            <div className="cfg-label">Animações</div>
            <div className="cfg-desc">Transições e gráficos animados</div>
          </div>
          <input
            type="checkbox"
            checked={s.animacoes}
            onChange={(e) => setS({ ...s, animacoes: e.target.checked })}
          />
        </label>
        <label className="cfg-row">
          <div>
            <div className="cfg-label">Ticker no topo</div>
            <div className="cfg-desc">Faixa de indicadores ao vivo</div>
          </div>
          <input
            type="checkbox"
            checked={s.ticker}
            onChange={(e) => setS({ ...s, ticker: e.target.checked })}
          />
        </label>
        <label className="cfg-row">
          <div>
            <div className="cfg-label">Alto contraste</div>
            <div className="cfg-desc">Realça bordas e texto</div>
          </div>
          <input
            type="checkbox"
            checked={s.contraste}
            onChange={(e) => setS({ ...s, contraste: e.target.checked })}
          />
        </label>
        <label className="cfg-row">
          <div>
            <div className="cfg-label">Densidade</div>
            <div className="cfg-desc">Espaçamento dos painéis</div>
          </div>
          <select
            className="field-input"
            style={{ width: 130 }}
            value={s.densidade}
            onChange={(e) =>
              setS({ ...s, densidade: e.target.value as Settings["densidade"] })
            }
          >
            <option value="normal">Normal</option>
            <option value="compacto">Compacto</option>
          </select>
        </label>

        <div className="cfg-actions">
          <button
            className="btn-cancel"
            type="button"
            onClick={() => setS(DEFAULT)}
          >
            Restaurar padrão
          </button>
          <button className="btn-primary" type="button" onClick={onClose}>
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
