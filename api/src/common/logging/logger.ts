type LogContext = Record<string, unknown>;

function writeLog(
  level: "INFO" | "ERROR",
  message: string,
  context?: LogContext,
) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ?? {}),
  };

  const serialized = JSON.stringify(entry);

  if (level === "ERROR") {
    console.error(serialized);
    return;
  }

  console.log(serialized);
}

export function logInfo(message: string, context?: LogContext) {
  writeLog("INFO", message, context);
}

export function logError(message: string, context?: LogContext) {
  writeLog("ERROR", message, context);
}
