#!/usr/bin/env node
/**
 * Menjalankan contrast-mcp.py menggunakan runtime Python yang tersedia di sistem.
 * Properti `command` pada manifes berupa string tunggal dan tidak dapat memilih secara otomatis per platform.
 */
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const server = path.join(here, "..", "skills", "slop-ai-indo-human", "contrast-mcp.py");

const candidates = process.platform === "win32" ? ["python", "python3"] : ["python3", "python"];

// Coba setiap kandidat: stub Windows python ada di PATH tetapi membuka Windows Store,
// dan shim pyenv menghasilkan exit non-zero jika versi belum dipilih.
const python = candidates.find(
  (bin) => spawnSync(bin, ["-c", ""], { stdio: "ignore" }).status === 0
);

if (!python) {
  // Tulis ke stderr, jangan stdout: stdout dipakai untuk channel protokol JSON-RPC.
  console.error(
    `slop-ai-indo-contrast: tidak ditemukan runtime Python yang berfungsi (mencoba ${candidates.join(", ")}). ` +
      "Silakan pasang Python 3 untuk menggunakan alat pemeriksa kontras."
  );
  process.exit(1);
}

const child = spawn(python, [server], { stdio: "inherit" });
child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
