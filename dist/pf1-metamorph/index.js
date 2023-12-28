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
var editInnerHtml = (htm, selector, value) => {
  const element = htm.find(selector)?.[0];
  if (element == null) {
    console.error(`Could not find element "${selector}"`);
    throw new Error();
  }
  element.innerHTML = value;
};
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
  groups: {
    beastShape: {
      label: "Forme Bestiale (cr\xE9ature magique de taille G)",
      description: "Disponible \xE0 partir de Forme Bestiale IV",
      transformation: {
        gorgonBeastShapeIV: {
          label: "Gorgone",
          description: "Taureau de pierre qui peut p\xE9trifier ses victimes",
          itemsToAdd: [
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
          tokenTextureSrc: "/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp",
          actorImg: "/characters/monsters/magicalBeasts/gorgone.webp",
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
    },
    simpleSpell: {
      label: "Sort simple",
      transformation: {
        reducePerson: {
          label: "Rapetissement",
          description: "Effectif uniquement sur les humanoids",
          itemsToAdd: [
            {
              name: "Rapetissement (metamorph)",
              compendiumName: "world.effets-metamorph",
              type: "buff"
            }
          ],
          size: "sm"
        }
      }
    }
  }
};

// src/macro/pf1-metamorph/html.ts
var descriptionIconStyle = "padding-right: 5px;";
var createForm = () => `
    <form class="flexcol">
      <div class="form-group">
        <label>Groupe :</label>
        <select id="metamorph-transformation-group">${createTransformationGroupOptions()}</select>
      </div>
      <div id="metamorph-transformation-group-description"> class="form-group">
      </div>
      <div class="form-group">
        <label>Transformation :</label>
        <select id="metamorph-transformation"></select>
      </div>
      <div id="metamorph-transformation-description" class="form-group">
      </div>
      <div class="form-group">
        <label for="transformation-value">Niveau lanceur de sort :</label>
        <input type="number" id="transformation-spell-level"/>
      </div>
      <div class="form-group">
        <label for="transformation-value">DD Sort :</label>
        <input type="number" id="transformation-spell-difficulty-check"/>
      </div>
      <div class="form-group">
         <p style="font-style: italic;"><i style="${descriptionIconStyle}" class="fa-solid fa-circle-info"></i>10 + niveau du sort + modificateur int / sag / cha </p>
      </div>
    </form>
  `;
var createTransformationGroupOptions = () => {
  const { groups } = config;
  return Object.keys(groups).map((key) => `<option value='${key}'>${groups[key].label}</option>`).join("");
};
var createTransformationGroupValues = (htm) => {
  const { groups } = config;
  const currentGroupValue = getSelectElementValue(
    htm,
    "#metamorph-transformation-group"
  );
  const group = groups[currentGroupValue];
  if (group === void 0) {
    return { optionValue: "<option>Aucune option disponible</option>" };
  }
  const { transformation, description } = group;
  return {
    optionValue: Object.keys(transformation).map(
      (key) => `<option value='${key}'>${transformation[key].label}</option>`
    ).join(""),
    description: description ? `<p style="font-style: italic;"><i style="${descriptionIconStyle}" class="fa-solid fa-circle-info"></i>${description}</p>` : void 0
  };
};
var createTransformationEffectDescription = (htm) => {
  const { groups } = config;
  const currentGroupValue = getSelectElementValue(
    htm,
    "#metamorph-transformation-group"
  );
  const group = groups[currentGroupValue];
  if (group === void 0) {
    return void 0;
  }
  const { transformation } = group;
  const currentTransformationValue = getSelectElementValue(
    htm,
    "#metamorph-transformation"
  );
  const { description } = transformation[currentTransformationValue];
  return description ? `<p style="font-style: italic;"><i style="${descriptionIconStyle}" class="fa-solid fa-circle-info"></i>${description}</p>` : void 0;
};

// src/common/error/user-warning.ts
var UserWarning = class extends Error {
};

// src/macro/pf1-metamorph/item.ts
var logger2 = getLoggerInstance();
var findItemsInActor = (actor, itemName, itemType) => actor.items.filter(
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
  const item = await compendiumCollection.getDocument(itemDescriptor._id);
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

// src/macro/pf1-metamorph/polymorph.ts
var logger3 = getLoggerInstance();
var addTransformationItemToActor = async (actor, item, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => {
  logger3.debug("Prepare to add item to actor", item);
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
  logger3.debug("Found item in compendium", {
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
  logger3.info("Apply metamorph");
  const { tokenTextureSrc, itemsToAdd, itemsToModify } = metamorphTransform;
  const updates = [];
  updates.push(
    tokens.map(({ actor }) => {
      logger3.debug("Apply metamorph to actor", actor);
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
            src: tokenTextureSrc
          }
        },
        img: metamorphTransform.actorImg
      });
    })
  );
  updates.push(
    tokens.map((token) => {
      logger3.debug("Apply metamorph to token", token);
      return token.document.update({
        texture: {
          src: tokenTextureSrc
        }
      });
    })
  );
  if (itemsToAdd !== void 0) {
    updates.push(
      createItemToAddUpdates(
        tokens,
        itemsToAdd,
        metamorphTransformSpellLevel,
        metamorphSpellDifficultyCheck
      )
    );
  }
  if (itemsToModify !== void 0) {
    updates.push(getItemToModifyUpdate(tokens, itemsToModify));
  }
  await Promise.all(updates.flat());
};
var createItemToAddUpdates = (tokens, itemsToAdd, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => tokens.map(({ actor }) => {
  logger3.debug("Create metamorph items in actor", actor);
  const individualItemUpdate = itemsToAdd.map(
    (item) => addTransformationItemToActor(
      actor,
      item,
      metamorphTransformSpellLevel,
      metamorphSpellDifficultyCheck
    )
  );
  return Promise.all(individualItemUpdate);
});
var getItemToModifyUpdate = (tokens, itemsToModify) => tokens.map(
  ({ actor }) => actor.items.reduce((accumulator, currentItem) => {
    const modification = itemsToModify.find(
      (item) => item.name === currentItem.name && item.type === currentItem.type
    );
    if (modification === void 0) {
      return accumulator;
    }
    accumulator.push(
      getTransformActionUpdate(modification.action, currentItem)
    );
    return accumulator;
  }, [])
).flat();
var getTransformActionUpdate = (action, item) => {
  switch (action) {
    case "disable":
      return getDisableActionUpdate(item);
  }
};
var getDisableActionUpdate = (item) => {
  if (item.type === "buff") {
    return item.update({
      system: {
        active: false
      }
    });
  }
  if (item.type === "feat") {
    return item.update({
      system: {
        disabled: true
      }
    });
  }
  throw new Error(
    `Unexpected item type ${item.type}, cannot create disable action update`
  );
};
var checkTokens = (tokens) => {
  for (const token of tokens) {
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning("Au moins un token a d\xE9j\xE0 un effet");
    }
  }
};

// src/macro/pf1-metamorph/save.ts
var logger4 = getLoggerInstance();
var transformToMetamorphSave = (value) => {
  logger4.debug("Transform flags to metamorph if they are valid", value);
  if (value === void 0) {
    throw new Error("Flag values are undefined");
  }
  const {
    actorData: {
      system: { traits: { size: actorSize = void 0 } = {} } = {}
    } = {},
    tokenDocumentData: {
      texture: { src: tokenTextureSrc = void 0 } = {}
    } = {}
  } = value;
  logger4.debug("Extracted values in flags", {
    actorSize,
    tokenTextureSrc
  });
  if (actorSize === void 0 || tokenTextureSrc === void 0) {
    throw new Error("Flag root values are invalid");
  }
  return value;
};
var savePolymorphData = async (tokens, metamorphTransformEffect) => {
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
      },
      img: token.actor.img
    };
    const tokenDocumentData = {
      texture: {
        src: token.document.texture.src
      }
    };
    const save = {
      actorData,
      tokenDocumentData,
      transformAddedItemsData: metamorphTransformEffect.itemsToAdd,
      transformModifiedItem: getTransformModifiedBuff(
        token.actor.items,
        metamorphTransformEffect.itemsToModify
      )
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
var getTransformModifiedBuff = (actorItems, itemsToModify) => {
  if (itemsToModify === void 0) {
    return void 0;
  }
  return actorItems.reduce(
    (accumulator, currentItem) => {
      if (itemsToModify.some(
        (item) => item.name === currentItem.name && item.type === currentItem.type
      )) {
        accumulator.push({
          name: currentItem.name,
          type: currentItem.type,
          data: {
            active: currentItem.isActive
          }
        });
      }
      return accumulator;
    },
    []
  );
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
    if (save.transformModifiedItem !== void 0) {
      logger4.debug("Get items to rollback", save);
      currentRollBackActions.push(
        Promise.all(
          rollbackModifiedItem(save.transformModifiedItem, token.actor.items)
        )
      );
    }
    if (save.transformAddedItemsData !== void 0) {
      logger4.debug("Get items to delete", save);
      const itemsToDelete = getItemsToDelete(
        token,
        save.transformAddedItemsData
      );
      logger4.debug(`Got ${itemsToDelete.length} items to delete`, {
        itemsToDelete
      });
      currentRollBackActions.push(
        token.actor.deleteEmbeddedDocuments(
          "Item",
          itemsToDelete.map(({ id }) => id)
        )
      );
    }
    return currentRollBackActions;
  }).flat();
  logger4.info("Trigger rollback");
  await Promise.all(rollbackActions);
  logger4.info("Rollback complete");
};
var getItemsToDelete = (token, transformAddedItemsData) => transformAddedItemsData.reduce((previousItems, currentItem) => {
  const actorItems = findItemsInActor(
    token.actor,
    currentItem.name,
    currentItem.type
  );
  if (actorItems.length > 0) {
    previousItems.push(...actorItems);
  } else {
    logger4.warn(`Could not find ${currentItem.name} item(s) in actor`);
  }
  return previousItems;
}, []);
var rollbackModifiedItem = (saveTransformModifiedItems, actorItems) => actorItems.reduce((accumulator, currentItem) => {
  const save = saveTransformModifiedItems.find(
    (value) => value.name === currentItem.name && value.type === currentItem.type
  );
  if (save === void 0) {
    return accumulator;
  }
  if (currentItem.type === "buff") {
    accumulator.push(
      currentItem.update({
        system: {
          active: save.data.active
        }
      })
    );
  } else if (currentItem.type === "feat") {
    accumulator.push(
      currentItem.update({
        system: {
          disabled: !save.data.active
        }
      })
    );
  } else {
    logger4.warn("A modified item has expected type", currentItem);
  }
  return accumulator;
}, []);

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
    const metamorphTransformGroupKey = getSelectElementValue(
      htm,
      "#metamorph-transformation-group"
    );
    const metamorphTransformEffectKey = getSelectElementValue(
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
    const metamorphTransformEffect = config.groups[metamorphTransformGroupKey].transformation[metamorphTransformEffectKey];
    if (metamorphTransformEffect === void 0) {
      ui.notifications.error("Cette transformation est inconnue");
      return;
    }
    checkTokens(controlledTokens);
    await savePolymorphData(controlledTokens, metamorphTransformEffect);
    await applyMetamorph(
      controlledTokens,
      metamorphTransformEffect,
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
    },
    render: (htm) => {
      const $transformGroupElement = htm.find("#metamorph-transformation-group");
      const $transformElement = htm.find("#metamorph-transformation");
      if ($transformGroupElement.length === 0 || $transformElement.length === 0) {
        throw new Error("Could not find relevant JQuery elements");
      }
      $transformGroupElement.on("change", () => {
        refreshTransformationEffectOptions(htm);
        refreshTransformationEffectDescription(htm);
      });
      $transformElement.on("change", () => {
        refreshTransformationEffectDescription(htm);
      });
      refreshTransformationEffectOptions(htm);
      refreshTransformationEffectDescription(htm);
    }
  }).render(true);
};
var refreshTransformationEffectOptions = (htm) => {
  const transformationEffectValues = createTransformationGroupValues(htm);
  editInnerHtml(
    htm,
    "#metamorph-transformation",
    transformationEffectValues.optionValue
  );
  editInnerHtml(
    htm,
    "#metamorph-transformation-group-description",
    transformationEffectValues.description ?? ""
  );
};
var refreshTransformationEffectDescription = (htm) => {
  const transformEffectDescription = createTransformationEffectDescription(htm);
  editInnerHtml(
    htm,
    "#metamorph-transformation-description",
    transformEffectDescription ?? ""
  );
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
