// src/services/logging.ts

import { Booking } from "../models/booking";

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
    private levels: LogLevel[];
    private currentLevel: LogLevel;

    constructor() {
        this.levels = ["debug", "info", "warn", "error"];
        // El nivel por defecto siempre será "debug" según la teoría original.
        // Si quieres que en producción se vea menos, tendrás que llamar a logger.setLevel("info")
        // al inicio de tu aplicación condicionalmente.
        this.currentLevel = "debug";
        // Puedes añadir un log para saber que se inicializó si quieres:
        // console.log(`[LOGGER] Logger inicializado. Nivel actual: ${this.currentLevel}.`);
    }

    setLevel(level: LogLevel): void {
        if (this.levels.includes(level)) {
            this.currentLevel = level;
            // Es útil saber cuándo cambia el nivel
            // console.info(`[LOGGER] Nivel de log cambiado a: ${level.toUpperCase()}`);
        } else {
            // Usar console.error directamente para este mensaje ya que es un error del logger mismo
            console.error(`[LOGGER] Nivel de log no válido: ${level}`);
        }
    }

private log(level: LogLevel, message: string): void
{
    const levelIndex = this.levels.indexOf(level);
    const currentLevelIndex = this.levels.indexOf(this.currentLevel);

    if (levelIndex >= currentLevelIndex)
    {
        const timestamp = new Date().toISOString();
        console[level](`[${level.toUpperCase()}] ${timestamp}: ${message}`);
    }
}

    debug(message: string, p0: { state: any; }): void {
        this.log("debug", message);
    }

    info(message: string, p0: { bookingData: Omit<Booking, "id" | "bookedAt" | "status">; }): void {
        this.log("info", message);
    }

    warn(message: string, p0: { startTime: string; }): void {
        this.log("warn", message);
    }

    error(message: string): void {
        this.log("error", message);
    }
}

const logger = new Logger();

export default logger;