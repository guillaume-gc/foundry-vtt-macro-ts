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

// src/common/util/jquery.ts
var getSelectElement = (htm, selector) => {
  const element = htm.find(selector)?.[0];
  if (element == null) {
    throw new Error(`Could not find element "${selector}"`);
  }
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Element ${selector} is not a HTML selector`);
  }
  return element;
};
var getSelectElementValue = (htm, selector) => {
  const element = getSelectElement(htm, selector);
  return element.value;
};

// src/macro/pf1-metamorph/config.ts
var config = {
  transformations: {
    reducePerson: {
      label: "Rapetissement",
      buff: {
        name: "Rapetissement",
        compendium: "world.effets-metamorph"
      },
      abilities: [],
      size: "sm"
    }
  }
};

// src/macro/pf1-metamorph/html.ts
var createForm = () => `
    <form class="flexcol">
      <div class="form-group">
        <label>Transformation :</label>
        <select id="metamorph-transformation" style="text-transform: capitalize">${createTransformationOptions()}</select>
       </div>
    </form>
  `;
var createTransformationOptions = () => {
  const { transformations } = config;
  return Object.keys(transformations).map(
    (key) => `<option value='${key}'>${transformations[key].label}</option>`
  );
};

// src/common/error/user-warning.ts
var UserWarning = class extends Error {
};

// src/macro/pf1-metamorph/buff.ts
var logger2 = getLoggerInstance();
var findBuffInActor = (actor, buffName) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);
var findBuffInCompendium = async (compendiumName, buffName) => {
  const compendiumCollection = game.packs.get(compendiumName);
  const buffDescriptor = compendiumCollection.index.find(
    ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
  );
  if (buffDescriptor === void 0) {
    return void 0;
  }
  const buff = await compendiumCollection.getDocument(
    buffDescriptor._id
  );
  if (buff === void 0) {
    logger2.warn(
      "Could not find buff in compendium even though its descriptor was found"
    );
    return void 0;
  }
  return buff;
};
var createBuffInActor = async (actor, buff) => {
  const documents = await actor.createEmbeddedDocuments("Item", [buff]);
  const createdBuff = documents[0];
  if (createdBuff === void 0) {
    throw new Error(`Could not create buff ${buff.name} in actor`);
  }
  return createdBuff;
};

// src/macro/pf1-metamorph/save.ts
var logger3 = getLoggerInstance();
var transformToMetamorphSaveIfValid = (value) => {
  logger3.debug("Transform flags to metamorph if they are valid", value);
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
  logger3.debug("Extracted values in flags", {
    actorSize,
    tokenTextureSrc,
    buffName
  });
  if (actorSize === void 0 || tokenTextureSrc === void 0 || buffName === void 0) {
    return void 0;
  }
  return value;
};

// src/macro/pf1-metamorph/polymorph.ts
var logger4 = getLoggerInstance();
var applyMetamorph = async (tokens, compendiumName, buffName, buffLevel, tokenTexture) => {
  logger4.info("Apply metamorph");
  const buffActions = tokens.map(async ({ actor }) => {
    logger4.debug("Create metamorph buff in actor", actor);
    const compendiumBuff = await findBuffInCompendium(compendiumName, buffName);
    if (compendiumBuff === void 0) {
      throw new Error(
        `Could not find buff ${buffName} in compendium ${compendiumName}`
      );
    }
    logger4.debug("Found buff in compendium", {
      compendiumBuff,
      compendiumName,
      buffName
    });
    const actorBuff = await createBuffInActor(actor, compendiumBuff);
    logger4.debug("Created buff in actor", {
      actorBuff
    });
    return actorBuff.update({
      "system.level": buffLevel,
      "system.active": true
    });
  });
  const actorsActions = tokens.map(async ({ actor }) => {
    logger4.debug("Apply metamorph to actor", actor);
    return actor.update({
      "system.traits.size": "sm",
      "flags.metamorph": {
        ...actor.flags?.metamorph,
        active: true
      }
    });
  });
  const tokensActions = tokens.map(async (token) => {
    logger4.debug("Apply metamorph to token", token);
    return token.document.update({
      "texture.src": tokenTexture
    });
  });
  const applyActions = [...buffActions, ...actorsActions, ...tokensActions];
  await Promise.all(applyActions);
};
var checkTokens = (tokens) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning("Au moins un token a d\xE9j\xE0 un effet");
    }
  }
};
var savePolymorphData = async (tokens, buffName) => {
  logger4.info("Save data to actor flags to ensure rolling back is possible");
  const operations = tokens.map(async (token) => {
    logger4.debug("Save data related to a token", token);
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
  logger4.info("Prepare to roll back to data before polymorph was triggered");
  const rollbackActions = tokens.map((token) => {
    logger4.debug("Rolling back token", token);
    const save = transformToMetamorphSaveIfValid(
      token.actor.flags?.metamorph?.save
    );
    logger4.debug("Save obtained from token actor", save);
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
      logger4.warn(`Could not find ${save.buffData.name} buff in actor`);
    }
    return currentRollBackActions;
  }).flat();
  logger4.info("Trigger rollback");
  await Promise.all(rollbackActions);
  logger4.info("Rollback complete");
};

// src/macro/pf1-metamorph/index.ts
var logger5 = getLoggerInstance();
var triggerMetamorph = async (htm, controlledTokens) => {
  const metamorphTransformKey = getSelectElementValue(
    htm,
    "#metamorph-transformation"
  );
  const metamorphTransform = config.transformations[metamorphTransformKey];
  if (metamorphTransform === void 0) {
    throw new Error(`Unknown transform ${metamorphTransformKey} key`);
  }
  const { buff, tokenTexture } = metamorphTransform;
  checkTokens(controlledTokens);
  await savePolymorphData(controlledTokens, buff.name);
  await applyMetamorph(
    controlledTokens,
    buff.compendium,
    buff.name,
    15,
    tokenTexture
  );
};
var cancelMetamorph = async (controlledTokens) => {
  await rollbackToPrePolymorphData(controlledTokens);
};
var openDialog = (controlledTokens) => {
  const form = createForm();
  new Dialog({
    title: "Metamorph",
    content: form,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Annuler la transformation",
        callback: () => cancelMetamorph(controlledTokens)
      },
      trigger: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Confirmer la transformation",
        callback: (htm) => triggerMetamorph(htm, controlledTokens)
      }
    }
  }).render(true);
};
try {
  logger5.level = 0 /* DEBUG */;
  const {
    tokens: { controlled: controlledTokens }
  } = canvas;
  if (controlledTokens.length > 0) {
    openDialog(controlledTokens);
  } else {
    ui.notifications.info("Aucun token n'est s\xE9lectionn\xE9");
  }
} catch (error) {
  ui.notifications.error(
    "L'ex\xE9cution du script \xE0 \xE9chou\xE9, voir la console pour plus d'information"
  );
  logger5.error(error);
}
