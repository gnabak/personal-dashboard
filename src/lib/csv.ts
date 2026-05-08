/**
 * Minimal CSV parser. Handles quoted fields, escaped quotes, commas
 * and semicolons (auto-detected) and CRLF/LF line endings.
 */

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
  delimiter: "," | ";";
}

export function parseCsv(text: string): ParsedCsv {
  const cleaned = text.replace(/﻿/g, ""); // strip BOM
  const delimiter = detectDelimiter(cleaned);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;
  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (inQuotes) {
      if (ch === '"') {
        if (cleaned[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === delimiter) {
      row.push(cell);
      cell = "";
      i++;
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      // consume CRLF
      if (ch === "\r" && cleaned[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i++;
      continue;
    }
    cell += ch;
    i++;
  }
  // last cell
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  // drop trailing empty rows
  while (rows.length && rows[rows.length - 1].every((c) => c.trim() === "")) {
    rows.pop();
  }
  if (rows.length === 0) {
    return { headers: [], rows: [], delimiter };
  }
  const headers = rows[0].map((h) => h.trim());
  return { headers, rows: rows.slice(1), delimiter };
}

function detectDelimiter(text: string): "," | ";" {
  // Sample first non-empty line
  const line = text.split(/\r?\n/).find((l) => l.trim().length > 0) ?? "";
  const commas = (line.match(/,/g) ?? []).length;
  const semis = (line.match(/;/g) ?? []).length;
  return semis > commas ? ";" : ",";
}

/** Try to parse a date in common formats: ISO, dd/MM/yyyy, MM/dd/yyyy, dd-MM-yyyy. */
export function parseFlexibleDate(s: string): string | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  // ISO yyyy-MM-dd
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  // dd/MM/yyyy or dd-MM-yyyy
  const dmy = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/.exec(trimmed);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    let year = dmy[3];
    if (year.length === 2) year = `20${year}`;
    // Heuristic: if first part > 12, it must be day-first; otherwise default to dd/MM
    return `${year}-${month}-${day}`;
  }
  // Fallback: Date constructor
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return null;
}

/** Parse a numeric string with locale tolerance: "1.234,56" / "1,234.56" / "-50.00". */
export function parseFlexibleAmount(s: string): number | null {
  const trimmed = s.replace(/\s/g, "").replace(/[^\d.,\-+]/g, "");
  if (!trimmed) return null;
  const hasComma = trimmed.includes(",");
  const hasDot = trimmed.includes(".");
  let normalized = trimmed;
  if (hasComma && hasDot) {
    // Whichever appears LAST is the decimal separator
    const lastComma = trimmed.lastIndexOf(",");
    const lastDot = trimmed.lastIndexOf(".");
    if (lastComma > lastDot) {
      // comma is decimal: 1.234,56
      normalized = trimmed.replace(/\./g, "").replace(",", ".");
    } else {
      // dot is decimal: 1,234.56
      normalized = trimmed.replace(/,/g, "");
    }
  } else if (hasComma) {
    // assume comma decimal (european)
    normalized = trimmed.replace(",", ".");
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}
