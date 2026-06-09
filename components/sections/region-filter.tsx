"use client";

import { REGION_OPTIONS } from "@/lib/mock/rj-regions";
import type { RegionId } from "@/lib/mock/types";

type RegionFilterProps = {
  value: RegionId;
  onChange: (id: RegionId) => void;
};

export function RegionFilter({ value, onChange }: RegionFilterProps) {
  return (
    <label className="region-filter" title="Filtrar por região do RJ">
      <i data-lucide="map-pin" />
      <select
        className="region-select"
        value={value}
        onChange={(e) => onChange(e.target.value as RegionId)}
        aria-label="Filtrar por região do Rio de Janeiro"
      >
        {REGION_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.nome}
          </option>
        ))}
      </select>
    </label>
  );
}
