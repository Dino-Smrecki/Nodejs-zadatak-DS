import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FILE = join(__dirname, "zadaci.json");

export async function loadTasks() {
  try {
    const text = await readFile(FILE, "utf-8");
    const podaci = JSON.parse(text);

    return podaci;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    if (error instanceof SyntaxError) {
      throw new Error(
        "Datoteka zadaci.json sadrži neispravan JSON i ne može se pročitati."
      );
    }

    throw error;
  }
}

export async function saveTasks(zadaci) {
  const jsonTekst = JSON.stringify(zadaci, null, 2) + "\n";
  await writeFile(FILE, jsonTekst, "utf-8");
}