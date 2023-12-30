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
  style: {
    descriptionIcon: "padding-right: 5px;",
    description: ""
  },
  rootElements: {
    beastShapeIV: {
      label: "Forme Bestiale IV",
      type: "group",
      elementChildren: {
        magicalBeastLarge: {
          label: "Cr\xE9ature magique de taille G",
          type: "group",
          elementChildren: {
            chimeraBestShapeIV: {
              label: "Chim\xE8re",
              description: "Ce monstre ail\xE9 a le corps d\u2019un lion et trois t\xEAtes : une de dragon et une de ch\xE8vre cornue. Pour connaitre la couleur de la t\xEAte, lancez [[/r 1d10 #Couleur de la t\xEAte de chim\xE8re]]. Si 1 ou 2 alors t\xEAte blanche, si 4 ou 4 alors t\xEAte bleue, si 5 ou 6 alors t\xEAte noire, si 7 ou 8 alors t\xEAte rouge, sinon t\xEAte verte.",
              type: "transformation",
              itemsToAdd: [
                {
                  name: "Forme bestiale IV (cr\xE9ature magique G - metamorph)",
                  compendiumName: "world.effets-metamorph",
                  type: "buff"
                },
                {
                  name: "Morsure (dragon) (chim\xE8re - metamorph)",
                  compendiumName: "world.effets-metamorph",
                  type: "attack"
                },
                {
                  name: "Morsure (lion) (chim\xE8re - metamorph)",
                  compendiumName: "world.effets-metamorph",
                  type: "attack"
                },
                {
                  name: "Corne (ch\xE8vre) (chim\xE8re - metamorph)",
                  compendiumName: "world.effets-metamorph",
                  type: "attack"
                },
                {
                  name: "Corne (ch\xE8vre) (chim\xE8re - metamorph)",
                  compendiumName: "world.effets-metamorph",
                  type: "attack"
                },
                {
                  name: "Souffle de Chim\xE8re (chim\xE8re - metamorph)",
                  compendiumName: "world.effets-metamorph",
                  type: "feat"
                }
              ],
              size: "lg",
              stature: "long",
              tokenTextureSrc: "/tokens/monsters/magicalBeasts/chimera.webp",
              actorImg: "/characters/monsters/magicalBeasts/chimera.webp",
              speed: {
                burrow: {
                  base: 0
                },
                climb: {
                  base: 0
                },
                fly: {
                  base: 50,
                  maneuverability: "poor"
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
            },
            gorgonBeastShapeIV: {
              label: "Gorgone",
              description: "Taureau de pierre qui peut p\xE9trifier ses victimes",
              type: "transformation",
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
        }
      }
    },
    reducePerson: {
      label: "Rapetissement",
      description: "Effectif uniquement sur les humanoids",
      type: "transformation",
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
};

// src/macro/pf1-metamorph/html.ts
var { style, rootElements } = config;
var logger2 = getLoggerInstance();
var createHtmlController = () => {
  let selectedKeyArray = [];
  let htm = void 0;
  const setHtm = (value) => {
    htm = value;
  };
  const getDefinedHtm = () => {
    if (htm === void 0) {
      throw new Error("Trying ot get Html while it's undefined");
    }
    return htm;
  };
  const createForm = () => `
    <form class='flexcol'>
      <div class='form-group'>
        <label>Element :</label>
        <select id='metamorph-transformation-element'>${createElementOptions(
    rootElements
  )}</select>
      </div>
      <div id='metamorph-transformation-element-description' class='form-group'>
      </div>
      <span id='metamorph-elements'></span>
    </form>
  `;
  const selectOnChange = (event, index) => {
    const htmlElement = event.target;
    if (htmlElement === void 0) {
      throw new Error("HTML element is invalid");
    }
    logger2.debug("Obtained HTML element from event", {
      htmlElement
    });
    if (isNaN(index)) {
      throw new Error("Index is not a valid number");
    }
    const value = htmlElement.value;
    overrideSelectedKeyArray(index, value);
    resetElementOptionsTree();
  };
  const setSelectEvents = () => {
    const metamorphSelectRootElement = getDefinedHtm().find(
      "#metamorph-transformation-element"
    )[0];
    logger2.info("Found metamorph select root element", {
      metamorphSelectRootElement
    });
    if (metamorphSelectRootElement === void 0) {
      throw new Error("Could not get metamorph root select element");
    }
    metamorphSelectRootElement.addEventListener("change", (event) => {
      selectOnChange(event, 0);
    });
    const metamorphSelectElements = getDefinedHtm().find("#metamorph-elements");
    let index = 1;
    for (const htmlElement of metamorphSelectElements) {
      htmlElement.addEventListener("change", (event) => {
        selectOnChange(event, index);
        index++;
      });
    }
  };
  const getTransformation = () => {
    const getTransformationIteration = (element, tempSelectedKeyArray2) => {
      logger2.debug("Get transformation iteration", {
        element,
        tempSelectedKeyArray: tempSelectedKeyArray2
      });
      if (element === void 0) {
        throw new Error(
          "Could not iterate through transformation, element undefined"
        );
      }
      if (element.type === "group") {
        const currentKey = tempSelectedKeyArray2.pop();
        if (currentKey === void 0) {
          throw new Error(
            "Could not iterate through transformation, selectedKeyArray is empty"
          );
        }
        return getTransformationIteration(
          element.elementChildren[currentKey],
          tempSelectedKeyArray2
        );
      }
      return element;
    };
    const tempSelectedKeyArray = [...selectedKeyArray];
    const firstKey = tempSelectedKeyArray.pop();
    if (firstKey === void 0) {
      throw new Error(
        "Could not iterate through transformation, selectedKeyArray is empty"
      );
    }
    return getTransformationIteration(
      rootElements[firstKey],
      tempSelectedKeyArray
    );
  };
  const setSelectedKeyArray = (value) => {
    selectedKeyArray = value;
  };
  const overrideSelectedKeyArray = (index, value) => {
    setSelectedKeyArray(
      selectedKeyArray.slice(0, index).concat(value, selectedKeyArray.slice(index))
    );
  };
  const resetElementOptionsTree = () => {
    logger2.debug("Reset element options tree", selectedKeyArray);
    const firstKey = selectedKeyArray[0];
    if (firstKey === void 0) {
      throw new Error("Could not get first key");
    }
    const firstElement = rootElements[firstKey];
    if (firstElement === void 0) {
      throw new Error("Could not get first element");
    }
    const optionsTree = createElementOptionsTree(
      firstElement,
      `metamorph-elements-${firstKey}`,
      1,
      selectedKeyArray.slice(1)
    );
    editInnerHtml(getDefinedHtm(), "#metamorph-elements", optionsTree);
    setSelectEvents();
  };
  const createElementOptionsTree = (element, parentHtmlId, index, selectedKeyArray2) => {
    logger2.debug("Creating options tree : new iteration", {
      element,
      selectedKeyArray: selectedKeyArray2
    });
    if (element.type === "group") {
      const currentKey = selectedKeyArray2.pop();
      if (currentKey === void 0) {
        throw new Error("At least one key is missing");
      }
      const newElement = element.elementChildren[currentKey];
      if (newElement === void 0) {
        throw new Error("At least one key is invalid");
      }
      const currentHtmlId = `${parentHtmlId}:${currentKey}`;
      return createElementFormGroup(
        element.elementChildren,
        currentHtmlId,
        index,
        element.description
      ) + createElementOptionsTree(
        element.elementChildren[currentKey],
        currentHtmlId,
        index + 1,
        selectedKeyArray2
      );
    }
    return createDescription(element.description);
  };
  const createElementFormGroup = (elementChildren, htmlId, index, parentDescription) => `
  <div class="form-group">
    <label>Element :</label>
    <select id="${htmlId}" onclick='' index='${index}'>${createElementOptions(
    elementChildren
  )}</select>
  </div>
  <div class="metamorph-transformation-element-description form-group">
    ${createDescription(parentDescription)}
  </div>
`;
  const createDescription = (description) => `
  <div class="form-group">
   ${description ? `<p style="${style.description}"><i style="${style.descriptionIcon}" class="fa-solid fa-circle-info"></i>${TextEditor.enrichHTML(
    description,
    { async: false }
  )}</p>` : ""}
  </div>
`;
  const createElementOptions = (elements) => {
    return Object.keys(elements).map((key) => `<option value='${key}'>${elements[key].label}</option>`).join("");
  };
  return {
    createForm,
    resetElementOptionsTree,
    setHtm,
    getTransformation
  };
};

// src/common/error/user-warning.ts
var UserWarning = class extends Error {
};

// src/macro/pf1-metamorph/item.ts
var logger3 = getLoggerInstance();
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
    logger3.warn(
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
var applyMetamorph = async (tokens, metamorphElementTransformation, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => {
  logger4.info("Apply metamorph");
  const { tokenTextureSrc, itemsToAdd, itemsToModify } = metamorphElementTransformation;
  const updates = [];
  updates.push(
    tokens.map(({ actor }) => {
      logger4.debug("Apply metamorph to actor", actor);
      return actor.update({
        system: {
          attributes: {
            speed: metamorphElementTransformation.speed
          },
          traits: {
            size: metamorphElementTransformation.size,
            stature: metamorphElementTransformation.stature,
            senses: {
              ...actor.system.traits.senses,
              ...metamorphElementTransformation.senses
            },
            dr: mixReduction(
              actor.system.traits.dr,
              metamorphElementTransformation.damageReduction
            ),
            eres: mixReduction(
              actor.system.traits.eres,
              metamorphElementTransformation.energyResistance
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
        img: metamorphElementTransformation.actorImg
      });
    })
  );
  updates.push(
    tokens.map((token) => {
      logger4.debug("Apply metamorph to token", token);
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
  logger4.debug("Create metamorph items in actor", actor);
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
var logger5 = getLoggerInstance();
var transformToMetamorphSave = (value) => {
  logger5.debug("Transform flags to metamorph if they are valid", value);
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
  logger5.debug("Extracted values in flags", {
    actorSize,
    tokenTextureSrc
  });
  if (actorSize === void 0 || tokenTextureSrc === void 0) {
    throw new Error("Flag root values are invalid");
  }
  return value;
};
var savePolymorphData = async (tokens, metamorphElementTransformEffect) => {
  logger5.info("Save data to actor flags to ensure rolling back is possible");
  const operations = tokens.map(async (token) => {
    logger5.debug("Save data related to a token", token);
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
      transformAddedItemsData: metamorphElementTransformEffect.itemsToAdd,
      transformModifiedItem: getTransformModifiedBuff(
        token.actor.items,
        metamorphElementTransformEffect.itemsToModify
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
  logger5.info("Prepare to roll back to data before polymorph was triggered");
  const rollbackActions = tokens.map((token) => {
    logger5.debug("Rolling back token", token);
    const save = transformToMetamorphSave(token.actor.flags?.metamorph?.save);
    logger5.debug("Save obtained from token actor", save);
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
      logger5.debug("Get items to rollback", save);
      currentRollBackActions.push(
        Promise.all(
          rollbackModifiedItem(save.transformModifiedItem, token.actor.items)
        )
      );
    }
    if (save.transformAddedItemsData !== void 0) {
      logger5.debug("Get items to delete", save);
      const itemsToDelete = getItemsToDelete(
        token,
        save.transformAddedItemsData
      );
      logger5.debug(`Got ${itemsToDelete.length} items to delete`, {
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
  logger5.info("Trigger rollback");
  await Promise.all(rollbackActions);
  logger5.info("Rollback complete");
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
    logger5.warn(`Could not find ${currentItem.name} item(s) in actor`);
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
    logger5.warn("A modified item has expected type", currentItem);
  }
  return accumulator;
}, []);

// src/macro/pf1-metamorph/index.ts
var logger6 = getLoggerInstance();
var getNumberFromInputIfSpecified = (htm, selector) => {
  const value = parseInt(getInputElement(htm, selector).value);
  if (!isNaN(value)) {
    return value;
  }
  return value;
};
var triggerMetamorph = async (htm, controlledTokens, htmlController) => {
  try {
    const metamorphTransformSpellLevel = getNumberFromInputIfSpecified(
      htm,
      "#transformation-spell-level"
    );
    const metamorphSpellDifficultyCheck = getNumberFromInputIfSpecified(
      htm,
      "#transformation-spell-difficulty-check"
    );
    checkTokens(controlledTokens);
    const elementTransformation = htmlController.getTransformation();
    await savePolymorphData(controlledTokens, elementTransformation);
    await applyMetamorph(
      controlledTokens,
      elementTransformation,
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
  const htmlController = createHtmlController();
  new Dialog({
    title: "Metamorph",
    content: htmlController.createForm(),
    buttons: {
      cancel: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Annuler la transformation",
        callback: () => cancelMetamorph(controlledTokens)
      },
      trigger: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Confirmer la transformation",
        callback: (htm) => triggerMetamorph(htm, controlledTokens, htmlController)
      }
    },
    render: (htm) => {
      htmlController.setHtm(htm);
      htmlController.resetElementOptionsTree();
    }
  }).render(true);
};
try {
  logger6.setLevel(0 /* DEBUG */);
  logger6.setMacroName("pf1-metamorph");
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
