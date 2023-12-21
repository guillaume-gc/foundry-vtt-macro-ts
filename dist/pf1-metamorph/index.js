"use strict";

// src/common/log/logger.ts
var logger = void 0;
var createLogger = () => {
  const macroName = void 0;
  const level = 1 /* INFO */;
  const createMacroNameFlag = (macroName2) => macroName2 ? `[${macroName2}]` : "";
  return {
    debug: (message, context) => {
      if (level >= 0 /* DEBUG */) {
        console.log(
          `${createMacroNameFlag(macroName)}[DEBUG] `,
          message,
          context
        );
      }
    },
    info: (message, context) => {
      if (level >= 1 /* INFO */) {
        console.log(`${createMacroNameFlag(macroName)}[INFO]`, message, context);
      }
    },
    warn: (message, context) => {
      if (level >= 2 /* WARN */) {
        console.warn(
          `${createMacroNameFlag(macroName)}[WARN]`,
          message,
          context
        );
      }
    },
    error: (message, context) => {
      if (level >= 3 /* ERROR */) {
        console.error(
          `${createMacroNameFlag(macroName)}[ERROR]`,
          message,
          context
        );
      }
    },
    level,
    macroName
  };
};
var getLoggerInstance = () => {
  if (logger === void 0) {
    logger = createLogger();
  }
  return logger;
};

// src/macro/pf1-metamorph/buff.ts
var findBuffInActor = (actor, buffName) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);

// src/macro/pf1-metamorph/save.ts
var logger2 = getLoggerInstance();
var transformToMetamorphSaveIfValid = (value) => {
  logger2.debug("Transform flags to metamorph if they are valid", value);
  if (value === void 0) {
    return void 0;
  }
  const {
    actorData: {
      system: { traits: { size: actorSize = void 0 } = {} } = {}
    } = {},
    tokenDocumentData: {
      texture: { src: tokenTextureSrc = void 0 } = {}
    } = {},
    buffData: { name: buffName = void 0 } = {}
  } = value;
  logger2.debug("Extracted values in flags", {
    actorSize,
    tokenTextureSrc,
    buffName
  });
  if (actorSize === void 0 || tokenTextureSrc === void 0 || buffName === void 0) {
    return void 0;
  }
  return value;
};

// src/macro/pf1-metamorph/index.ts
var logger3 = getLoggerInstance();
var applyMetamorph = async (tokens, buffName, buffLevel) => {
  logger3.info("Apply metamorph");
  const buffOperations = tokens.map(async ({ actor }) => {
    logger3.debug("Apply metamorph to buff", actor);
    const buff = findBuffInActor(actor, buffName);
    const updateQuery = {
      "system.level": buffLevel,
      "system.active": true
    };
    return buff.update(updateQuery);
  });
  const actorsOperations = tokens.map(async ({ actor }) => {
    logger3.debug("Apply metamorph to actor", actor);
    return actor.update({ "system.traits.size": "huge" });
  });
  const tokensOperations = tokens.map(async (token) => {
    logger3.debug("Apply metamorph to token", token);
    return token.document.update({
      "texture.src": "https://assets.forge-vtt.com/62ab17b89633ba24d7994900/tokens/PC/Seioden%20v2.png"
    });
  });
  const operations = [
    ...buffOperations,
    ...actorsOperations,
    ...tokensOperations
  ];
  await Promise.all(operations);
};
var savePolymorphData = async (tokens, buffName) => {
  logger3.info("Save data to actor flags to ensure rolling back is possible");
  const operations = tokens.map(async (token) => {
    logger3.debug("Save data related to a token", token);
    const actorData = {
      system: {
        traits: {
          size: token.actor.system.traits.size
        }
      }
    };
    const tokenDocumentData = {
      texture: {
        src: token.document.texture.src
      }
    };
    const buffData = {
      name: buffName
    };
    const save = {
      actorData,
      tokenDocumentData,
      buffData
    };
    await token.actor.update({
      flags: {
        metamorph: {
          save
        }
      }
    });
  });
  await Promise.all(operations);
};
var rollbackToPrePolymorphData = async (tokens) => {
  logger3.info("Prepare to roll back to data before polymorph was triggered");
  const rollbackActions = tokens.map((token) => {
    logger3.debug("Rolling back token", token);
    const save = transformToMetamorphSaveIfValid(
      token.actor.flags?.metamorph?.save
    );
    logger3.debug("Save obtained from token actor", save);
    if (save === void 0) {
      throw new Error("Save is not valid");
    }
    const buff = findBuffInActor(token.actor, save.buffData.name);
    return [
      token.document.update(save.tokenDocumentData),
      token.actor.update(save.actorData),
      token.actor.deleteEmbeddedDocuments("Item", [buff.id])
    ];
  }).flat();
  logger3.info("Trigger rollback");
  await Promise.all(rollbackActions);
  logger3.info("Rollback complete");
};
var main = async () => {
  logger3.level = 0 /* DEBUG */;
  const {
    tokens: { controlled }
  } = canvas;
  if (controlled.length === 0) {
    ui.notifications.info("Aucun token n'est s\xE9lectionn\xE9");
    return;
  }
  const buffName = "Vision des H\xE9ros des Terres Inond\xE9es";
  await savePolymorphData(controlled, buffName);
  await applyMetamorph(controlled, buffName, 15);
  await new Promise((resolve) => setTimeout(resolve, 5e3));
  await rollbackToPrePolymorphData(controlled);
};
main().catch((error) => {
  ui.notifications.error(
    "L'ex\xE9cution du script \xE0 \xE9chou\xE9, voir la console pour plus d'information"
  );
  console.error(error);
});
