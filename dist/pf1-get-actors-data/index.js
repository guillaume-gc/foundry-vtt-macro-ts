"use strict";

// src/common/log/logger.ts
var logger = void 0;
var createLogger = () => {
  let level = 1 /* INFO */;
  let macroName = void 0;
  const createMacroNameFlag = () => macroName ? `[${macroName}]` : "";
  const writeConsoleMessage = (levelString, message, context) => {
    if (context) {
      console.log(`${createMacroNameFlag()}[${levelString}]`, message, context);
      return;
    }
    console.log(`${createMacroNameFlag()}[${levelString}]`, message);
  };
  return {
    debug: (message, context) => {
      if (level > 0 /* DEBUG */) {
        return;
      }
      writeConsoleMessage("DEBUG", message, context);
    },
    info: (message, context) => {
      if (level > 1 /* INFO */) {
        return;
      }
      writeConsoleMessage("INFO", message, context);
    },
    warn: (message, context) => {
      if (level > 2 /* WARN */) {
        return;
      }
      writeConsoleMessage("WARN", message, context);
    },
    error: (message, context) => {
      if (level > 3 /* ERROR */) {
        return;
      }
      writeConsoleMessage("ERROR", message, context);
    },
    setLevel: (newLevel) => {
      level = newLevel;
    },
    setMacroName: (newMacroName) => {
      macroName = newMacroName;
    }
  };
};
var getLoggerInstance = () => {
  if (logger === void 0) {
    logger = createLogger();
  }
  return logger;
};

// src/common/error/user-warning.ts
var UserWarning = class extends Error {
};

// src/common/util/notifications.ts
var notifyError = (error) => {
  if (error instanceof UserWarning) {
    console.warn(error);
    ui.notifications.warn(error.message);
    return;
  }
  console.error(error);
  ui.notifications.error(
    "L'ex\xE9cution du script a \xE9chou\xE9, voir la console pour plus d'information"
  );
};

// src/macro/pf1-get-actors-data/index.ts
var logger2 = getLoggerInstance();
try {
  logger2.setLevel(1 /* INFO */);
  logger2.setMacroName("pf1-get-actors-data");
  const {
    tokens: { controlled: controlledTokens }
  } = canvas;
  logger2.info("controlledTokens", controlledTokens);
} catch (error) {
  notifyError(error);
}
