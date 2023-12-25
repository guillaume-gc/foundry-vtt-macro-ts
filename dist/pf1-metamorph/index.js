"use strict";

// src/common/log/logger.ts
var logger = void 0;
var createLogger = () => {
  let level = 1 /* INFO */;
  let macroName = void 0;
  const createMacroNameFlag = () => macroName ? `[${macroName}]` : "";
  return {
    debug: (message, context) => {
      if (level >= 0 /* DEBUG */) {
        console.log(`${createMacroNameFlag()}[DEBUG]`, message, context);
      }
    },
    info: (message, context) => {
      if (level >= 1 /* INFO */) {
        console.log(`${createMacroNameFlag()}[INFO]`, message, context);
      }
    },
    warn: (message, context) => {
      if (level >= 2 /* WARN */) {
        console.warn(`${createMacroNameFlag()}[WARN]`, message, context);
      }
    },
    error: (message, context) => {
      if (level >= 3 /* ERROR */) {
        console.error(`${createMacroNameFlag()}[ERROR]`, message, context);
      }
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

// src/common/util/jquery.ts
var getSelectElement = (htm, selector) => {
  const element = htm.find(selector)?.[0];
  if (element == null) {
    throw new Error(`Could not find element "${selector}"`);
  }
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Element ${selector} is not a HTML select element`);
  }
  return element;
};
var getSelectElementValue = (htm, selector) => {
  const element = getSelectElement(htm, selector);
  return element.value;
};
var getInputElement = (htm, selector) => {
  const element = htm.find(selector)?.[0];
  if (element == null) {
    throw new Error(`Could not find element "${selector}"`);
  }
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Element ${selector} is not a HTML input element`);
  }
  return element;
};

// src/macro/pf1-metamorph/config.ts
var config = {
  transformations: {
    reducePerson: {
      label: "Rapetissement",
      items: [
        {
          name: "Rapetissement (metamorph)",
          compendiumName: "world.effets-metamorph",
          type: "buff"
        }
      ],
      size: "sm"
    },
    gorgonBeastShapeIV: {
      label: "Gorgone (Forme Bestiale IV)",
      items: [
        {
          name: "Forme bestiale IV (cr\xE9ature magique G - metamorph)",
          compendiumName: "world.effets-metamorph",
          type: "buff"
        },
        {
          name: "Corne (gorgone - metamorph)",
          compendiumName: "world.effets-metamorph",
          type: "attack"
        },
        {
          name: "2 sabots (gorgone - metamorph)",
          compendiumName: "world.effets-metamorph",
          type: "attack"
        },
        {
          name: "Pi\xE9tinement",
          compendiumName: "world.aptitudes-de-classe-personnalisees",
          type: "feat"
        },
        {
          name: "Souffle de Gorgone (gorgone - metamorph)",
          compendiumName: "world.effets-metamorph",
          type: "feat"
        }
      ],
      size: "lg",
      stature: "long",
      tokenTexture: "/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp",
      speed: {
        burrow: {
          base: 0
        },
        climb: {
          base: 0
        },
        fly: {
          base: 0
        },
        land: {
          base: 30
        },
        swim: {
          base: 0
        }
      },
      senses: {
        dv: 60,
        ll: {
          enabled: true,
          multiplier: {
            bright: 2,
            dim: 2
          }
        },
        sc: 30
      }
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
      <div class="form-group">
        <label for="transformation-value">Niveau lanceur de sort :</label>
        <input type="number" id="transformation-spell-level"/>
      </div>
      <div class="form-group">
        <label for="transformation-value">DD Sort :</label>
        <input type="number" id="transformation-spell-difficulty-check"/>
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

// src/macro/pf1-metamorph/item.ts
var logger2 = getLoggerInstance();
var findItemInActor = (actor, itemName, itemType) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === itemName.toLowerCase() && type === itemType
);
var findItemInCompendium = async (compendiumName, itemName, itemType) => {
  const compendiumCollection = game.packs.get(compendiumName);
  const itemDescriptor = compendiumCollection.index.find(
    ({ name, type }) => name.toLowerCase() === itemName.toLowerCase() && type === itemType
  );
  if (itemDescriptor === void 0) {
    return void 0;
  }
  const item = await compendiumCollection.getDocument(
    itemDescriptor._id
  );
  if (item === void 0) {
    logger2.warn(
      "Could not find item in compendium even though its descriptor was found"
    );
    return void 0;
  }
  return item;
};
var createItemInActor = async (actor, item) => {
  const documents = await actor.createEmbeddedDocuments("Item", [item]);
  const createdItem = documents[0];
  if (createdItem === void 0) {
    throw new Error(`Could not create item ${item.name} in actor`);
  }
  return createdItem;
};

// src/macro/pf1-metamorph/save.ts
var logger3 = getLoggerInstance();
var transformToMetamorphSave = (value) => {
  logger3.debug("Transform flags to metamorph if they are valid", value);
  if (value === void 0) {
    throw new Error("Flag values are undefined");
  }
  const {
    actorData: {
      system: { traits: { size: actorSize = void 0 } = {} } = {}
    } = {},
    tokenDocumentData: {
      texture: { src: tokenTextureSrc = void 0 } = {}
    } = {},
    transformItemsData
  } = value;
  logger3.debug("Extracted values in flags", {
    actorSize,
    tokenTextureSrc,
    transformItemsData
  });
  if (actorSize === void 0 || tokenTextureSrc === void 0 || transformItemsData === void 0) {
    throw new Error("Flag values are invalid");
  }
  return value;
};

// src/macro/pf1-metamorph/polymorph.ts
var logger4 = getLoggerInstance();
var addTransformationItemToActor = async (actor, item, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => {
  logger4.debug("Prepare to add item to actor", item);
  const compendiumItem = await findItemInCompendium(
    item.compendiumName,
    item.name,
    item.type
  );
  if (compendiumItem === void 0) {
    throw new Error(
      `Could not find buff ${item.name} (type ${item.type}) in compendium ${item.compendiumName}`
    );
  }
  logger4.debug("Found item in compendium", {
    compendiumItem,
    itemCompendiumName: item.compendiumName,
    itemName: item.name
  });
  const actorItem = await createItemInActor(actor, compendiumItem);
  return updateAddedTransformationItem(
    actorItem,
    metamorphTransformSpellLevel,
    metamorphSpellDifficultyCheck
  );
};
var updateAddedTransformationItem = async (item, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => {
  const updates = [];
  if (item.type === "buff") {
    updates.push(
      item.update({
        system: {
          level: metamorphTransformSpellLevel,
          active: true
        }
      })
    );
  }
  if (item.hasAction) {
    updates.push(
      updateAddedTransformationItemActions(
        item.actions,
        metamorphSpellDifficultyCheck
      )
    );
  }
  if (updates.length > 0) {
    return Promise.all(updates);
  }
  return item;
};
var updateAddedTransformationItemActions = async (actions, metamorphSpellDifficultyCheck) => actions.map(
  (action) => action.update({
    save: {
      // Abilities DC must be using spell DC, if specified.
      dc: metamorphSpellDifficultyCheck?.toString()
    }
  })
);
var mixReduction = (actorReduction, polymorphReduction) => polymorphReduction !== void 0 ? {
  custom: [actorReduction.custom, polymorphReduction.custom].filter((value) => value).join(";"),
  value: [...actorReduction.value, ...polymorphReduction.value]
} : actorReduction;
var applyMetamorph = async (tokens, metamorphTransform, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => {
  logger4.info("Apply metamorph");
  const { tokenTexture, items } = metamorphTransform;
  const itemActions = tokens.map(async ({ actor }) => {
    logger4.debug("Create metamorph items in actor", actor);
    const individualItemActions = items.map(
      (item) => addTransformationItemToActor(
        actor,
        item,
        metamorphTransformSpellLevel,
        metamorphSpellDifficultyCheck
      )
    );
    return Promise.all(individualItemActions);
  });
  const actorsActions = tokens.map(async ({ actor }) => {
    logger4.debug("Apply metamorph to actor", actor);
    return actor.update({
      system: {
        attributes: {
          speed: metamorphTransform.speed
        },
        traits: {
          size: metamorphTransform.size,
          stature: metamorphTransform.stature,
          senses: {
            ...actor.system.traits.senses,
            ...metamorphTransform.senses
          },
          dr: mixReduction(
            actor.system.traits.dr,
            metamorphTransform.damageReduction
          ),
          eres: mixReduction(
            actor.system.traits.eres,
            metamorphTransform.energyResistance
          )
        }
      },
      flags: {
        metamorph: {
          ...actor.flags?.metamorph,
          active: true
        }
      },
      prototypeToken: {
        texture: {
          src: tokenTexture
        }
      }
    });
  });
  const tokensActions = tokens.map(async (token) => {
    logger4.debug("Apply metamorph to token", token);
    return token.document.update({
      texture: {
        src: tokenTexture
      }
    });
  });
  const applyActions = [...itemActions, ...actorsActions, ...tokensActions];
  await Promise.all(applyActions);
};
var checkTokens = (tokens) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning("Au moins un token a d\xE9j\xE0 un effet");
    }
  }
};
var savePolymorphData = async (tokens, metamorphTransform) => {
  logger4.info("Save data to actor flags to ensure rolling back is possible");
  const operations = tokens.map(async (token) => {
    logger4.debug("Save data related to a token", token);
    const actorData = {
      system: {
        attributes: {
          speed: token.actor.system.attributes.speed
        },
        traits: {
          size: token.actor.system.traits.size,
          stature: token.actor.system.traits.stature,
          senses: token.actor.system.traits.senses,
          dr: token.actor.system.traits.dr,
          eres: token.actor.system.traits.eres
        }
      },
      prototypeToken: {
        texture: {
          src: token.document.texture.src
        }
      }
    };
    const tokenDocumentData = {
      texture: {
        src: token.document.texture.src
      }
    };
    const save = {
      actorData,
      tokenDocumentData,
      transformItemsData: metamorphTransform.items
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
    const save = transformToMetamorphSave(token.actor.flags?.metamorph?.save);
    logger4.debug("Save obtained from token actor", save);
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
    logger4.debug("Delete all metamorph related items", save);
    const itemsToDelete = save.transformItemsData.reduce(
      (previousItems, currentItem) => {
        const actorItem = findItemInActor(
          token.actor,
          currentItem.name,
          currentItem.type
        );
        if (actorItem !== void 0) {
          previousItems.push(actorItem);
        } else {
          logger4.warn(`Could not find ${currentItem.name} item in actor`);
        }
        return previousItems;
      },
      []
    );
    logger4.debug(`Ready to delete ${itemsToDelete.length} items`, {
      itemsToDelete
    });
    currentRollBackActions.push(
      token.actor.deleteEmbeddedDocuments(
        "Item",
        itemsToDelete.map(({ id }) => id)
      )
    );
    return currentRollBackActions;
  }).flat();
  logger4.info("Trigger rollback");
  await Promise.all(rollbackActions);
  logger4.info("Rollback complete");
};

// src/macro/pf1-metamorph/index.ts
var logger5 = getLoggerInstance();
var getNumberFromInputIfSpecified = (htm, selector) => {
  const value = parseInt(getInputElement(htm, selector).value);
  if (!isNaN(value)) {
    return value;
  }
  return value;
};
var triggerMetamorph = async (htm, controlledTokens) => {
  try {
    const metamorphTransformKey = getSelectElementValue(
      htm,
      "#metamorph-transformation"
    );
    const metamorphTransformSpellLevel = getNumberFromInputIfSpecified(
      htm,
      "#transformation-spell-level"
    );
    const metamorphSpellDifficultyCheck = getNumberFromInputIfSpecified(
      htm,
      "#transformation-spell-difficulty-check"
    );
    const metamorphTransform = config.transformations[metamorphTransformKey];
    if (metamorphTransform === void 0) {
      ui.notifications.error("Cette transformation est inconnue");
      return;
    }
    checkTokens(controlledTokens);
    await savePolymorphData(controlledTokens, metamorphTransform);
    await applyMetamorph(
      controlledTokens,
      metamorphTransform,
      metamorphTransformSpellLevel,
      metamorphSpellDifficultyCheck
    );
  } catch (error) {
    ui.notifications.error(
      "L'ex\xE9cution du script a \xE9chou\xE9, voir la console pour plus d'information"
    );
    console.error(error);
  }
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
  logger5.setLevel(0 /* DEBUG */);
  logger5.setMacroName("pf1-metamorph");
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
    "L'ex\xE9cution du script a \xE9chou\xE9, voir la console pour plus d'information"
  );
  console.error(error);
}
