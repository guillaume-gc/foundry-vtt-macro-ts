"use strict";

// src/common/error/user-warning.ts
var UserWarning = class extends Error {
};

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
var findBuffInCompendium = (compendiumName, buffName) => game.packs.get(compendiumName).index.find(
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
var applyMetamorph = async (tokens, compendiumName, buffName, buffLevel) => {
  logger3.info("Apply metamorph");
  const buffOperations = tokens.map(async ({ actor }) => {
    logger3.debug("Create metamorph buff in actor", actor);
    const buff = await createBuff(actor, compendiumName, buffName);
    const updateQuery = {
      "system.level": buffLevel,
      "system.active": true
    };
    return buff.update(updateQuery);
  });
  const actorsOperations = tokens.map(async ({ actor }) => {
    logger3.debug("Apply metamorph to actor", actor);
    return actor.update({
      "system.traits.size": "sm",
      "flags.metamorph": {
        ...actor.flags?.metamorph,
        active: true
      }
    });
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
var createBuff = async (actor, compendiumName, buffName) => {
  const buff = findBuffInCompendium(compendiumName, buffName);
  if (buff === void 0) {
    throw new Error(
      `Could not find buff ${buffName} in compendium ${compendiumName}`
    );
  }
  const documents = await actor.createEmbeddedDocuments("Item", [buff]);
  const createdBuff = documents[0];
  if (createdBuff === void 0) {
    throw new Error(`Could not create buff ${buffName} in actor`);
  }
  return createdBuff;
};
var checkTokens = (tokens) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning("Au moins un token a d\xE9j\xE0 un effet");
    }
  }
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
    const currentRollBackActions = [
      token.document.update(save.tokenDocumentData),
      token.actor.update({
        ...save.actorData,
        flags: {
          metamorph: {
            ...token.actor.flags?.metamorph,
            active: false
          }
        }
      })
    ];
    const buff = findBuffInActor(token.actor, save.buffData.name);
    if (buff !== void 0) {
      currentRollBackActions.push(
        token.actor.deleteEmbeddedDocuments("Item", [buff.id])
      );
    } else {
      logger3.warn(`Could not find ${save.buffData.name} buff in actor`);
    }
    return currentRollBackActions;
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
  const buffName = "rapetissement";
  const compendiumName = "world.effets-metamorph";
  checkTokens(controlled);
  await savePolymorphData(controlled, buffName);
  await applyMetamorph(controlled, compendiumName, buffName, 15);
  await new Promise((resolve) => setTimeout(resolve, 5e3));
  await rollbackToPrePolymorphData(controlled);
};
main().catch((error) => {
  if (error instanceof UserWarning) {
    ui.notifications.warn(error.message);
    return;
  }
  ui.notifications.error(
    "L'ex\xE9cution du script \xE0 \xE9chou\xE9, voir la console pour plus d'information"
  );
  console.error(error);
});
