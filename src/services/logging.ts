// src/services/logging.ts

import { Booking } from "../models/booking";

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
    private levels: LogLevel[];
    private currentLevel: LogLevel;

    constructor() {
        this.levels = ["debug", "info", "warn", "error"];
        this.currentLevel = "debug";
    }

    setLevel(level: LogLevel): void {
        if (this.levels.includes(level)) {
            this.currentLevel = level;
        } else {
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

    error(message: string, fetchError: Error): void {
        this.log("error", message);
    }
}

const logger = new Logger();

export default logger;