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
            chimera: {
              label: "Chim\xE8re",
              description: "Ce monstre ail\xE9 a le corps d\u2019un lion et trois t\xEAtes : dragon, lion et ch\xE8vre. Pour connaitre la couleur de la t\xEAte de dragon, lancez [[/r 1d10 #Couleur de la t\xEAte de chim\xE8re]]. Si 1 ou 2 alors t\xEAte blanche, si 3 ou 4 alors t\xEAte bleue, si 5 ou 6 alors t\xEAte noire, si 7 ou 8 alors t\xEAte rouge, sinon si 9 ou 10 alors t\xEAte verte.",
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
            gorgon: {
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
    transference: {
      label: "La Transf\xE9rence du Premier Monde",
      type: "group",
      elementChildren: {
        incomplete: {
          label: "Incomplete",
          type: "group",
          elementChildren: {
            origin: {
              label: "Origine",
              type: "transformation",
              tokenTextureSrc: "/tokens/monsters/aberrations/severed-tentacle3.webp",
              actorImg: "/characters/monsters/aberrations/purpletentacules.webp"
            },
            destination: {
              label: "Destination",
              type: "transformation",
              tokenTextureSrc: "/tokens/monsters/aberrations/severed-tentacle.webp",
              actorImg: "/characters/monsters/aberrations/bluetentacules.webp"
            }
          }
        }
      }
    },
    mythicLycanthropy: {
      label: "Lycanthropie Mythique",
      type: "group",
      elementChildren: {
        canine: {
          label: "Canine",
          type: "transformation",
          requirement: {
            type: "hasItem",
            item: {
              name: "Lycanthrope mythique - Canine",
              type: "feat"
            }
          },
          itemsToAdd: [
            {
              name: "Lycanthrope mythique - Canine - Forme Hybride (metamorph)",
              compendiumName: "world.effets-metamorph",
              type: "feat"
            },
            {
              name: "Morsure (lycanthropie mythique - canine - metamorph)",
              compendiumName: "world.effets-metamorph",
              type: "attack"
            },
            {
              name: "2 Griffes (lycanthropie mythique - canine - metamorph)",
              compendiumName: "world.effets-metamorph",
              type: "attack"
            }
          ],
          itemsToModify: [
            {
              name: "Lycanthrope mythique - Canine - Forme Humano\xEFde",
              type: "feat",
              action: "disable"
            }
          ],
          size: "lg",
          stature: "tall",
          tokenTextureSrc: "/tokens/monsters/monstrousHumanoids/Werewolf.webp",
          actorImg: "/characters/PC/Seioden%20Loup%20Garou.jpg",
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
              base: 45
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
          },
          ownershipChanges: "clampAccessToLimited"
        }
      }
    },
    reducePerson: {
      label: "Rapetissement",
      description: "Effectif uniquement sur les humanoids",
      type: "transformation",
      requirement: {
        type: "equality",
        path: "system.traits.humanoid",
        value: true
      },
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
  let masterSelectedKeyArray = [];
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
      <span id='metamorph-root-element-container'>
        <div class='form-group'>
          <select>${createElementOptions(rootElements)}</select>
        </div>
        <div id='metamorph-root-element-description' class='form-group'>
        </div>
      </span>
      <span id='metamorph-children-elements-container'></span>
      <div class="form-group">
        <label for="transformation-value">Niveau lanceur de sort :</label>
        <input type="number" id="transformation-spell-level"/>
      </div>
      <div class="form-group">
        <label for="transformation-value">DD Sort :</label>
        <input type="number" id="transformation-spell-difficulty-check"/>
      </div>
      <div class="form-group">
         <p style="${style.description}"><i style="${style.descriptionIcon}" class="fa-solid fa-circle-info"></i>10 + niveau du sort + modificateur int / sag / cha</p>
      </div>
    </form>
  `;
  const selectOnChange = (event, depth) => {
    const htmlElement = event.target;
    if (htmlElement === null) {
      throw new Error("Changed HTML element is invalid");
    }
    logger2.debug("Change event triggered, obtained HTML element from event", {
      htmlElement,
      depth
    });
    const value = htmlElement.value;
    overrideMasterSelectedKeyArray(depth, value);
    resetElementOptionsTree();
  };
  const setupRootSelectHtmlElement = () => {
    logger2.debug("Setup Root Select HTML Element");
    const metamorphRootSelectElement = getDefinedHtm().find("#metamorph-root-element-container").find("select")[0];
    if (metamorphRootSelectElement === void 0) {
      throw new Error("Could not find Root Select HTML Element");
    }
    metamorphRootSelectElement.value = createElementKey(rootElements, 0);
    metamorphRootSelectElement.addEventListener("change", (event) => {
      selectOnChange(event, 0);
    });
  };
  const setupSelectHTMLElements = () => {
    logger2.debug("Setup Select HTML Elements");
    const metamorphSelectElements = getDefinedHtm().find("#metamorph-children-elements-container").find("select");
    logger2.debug("Found metamorph select elements select", {
      metamorphSelectElements
    });
    const firstKey = createElementKey(rootElements, 0);
    const firstElement = rootElements[firstKey];
    if (firstElement.type !== "group") {
      logger2.debug("First element is not a group, no need to continue", {
        firstElement,
        firstKey
      });
      return;
    }
    let depth = 1;
    let elementRecord = firstElement.elementChildren;
    for (const htmlSelectElement of metamorphSelectElements) {
      logger2.debug("Iterating through a metamorph HTML select element found", {
        depth,
        elementRecord,
        htmlSelectElement
      });
      const currentDepth = depth;
      const key = createElementKey(elementRecord, depth);
      const newElement = elementRecord[key];
      htmlSelectElement.value = key;
      htmlSelectElement.addEventListener("change", (event) => {
        selectOnChange(event, currentDepth);
      });
      if (newElement.type === "group") {
        elementRecord = newElement.elementChildren;
      }
      depth++;
    }
  };
  const getTransformation = () => {
    const getTransformationIteration = (element, depth) => {
      logger2.debug("Get transformation iteration", {
        element,
        depth
      });
      if (element === void 0) {
        throw new Error(
          "Could not iterate through transformation, element undefined"
        );
      }
      if (element.type === "group") {
        const currentKey = createElementKey(element.elementChildren, depth);
        return getTransformationIteration(
          element.elementChildren[currentKey],
          depth + 1
        );
      }
      return element;
    };
    const firstKey = createElementKey(rootElements, 0);
    return getTransformationIteration(rootElements[firstKey], 1);
  };
  const setMasterSelectedKeyArray = (value) => {
    masterSelectedKeyArray = value;
  };
  const overrideMasterSelectedKeyArray = (depth, value) => {
    logger2.debug("Override master selected key array", {
      masterSelectedKeyArray,
      depth,
      value
    });
    if (masterSelectedKeyArray.length <= depth) {
      const tempSelectedKeyArray = [...masterSelectedKeyArray];
      while (tempSelectedKeyArray.length <= depth) {
        tempSelectedKeyArray.push(void 0);
      }
      setMasterSelectedKeyArray(tempSelectedKeyArray);
    }
    setMasterSelectedKeyArray([
      ...masterSelectedKeyArray.slice(0, depth),
      value
    ]);
    logger2.debug("Master selected key array override", {
      masterSelectedKeyArray
    });
  };
  const resetElementOptionsTree = () => {
    logger2.debug("Reset element options tree");
    const firstKey = createElementKey(rootElements, 0);
    const firstElement = rootElements[firstKey];
    if (firstElement === void 0) {
      throw new Error(
        "Cannot reset element options tree, could not get first element"
      );
    }
    const optionsTree = createElementOptionsTree(
      firstElement,
      `metamorph-children-elements-container-${firstKey}`,
      1
    );
    editInnerHtml(
      getDefinedHtm(),
      "#metamorph-children-elements-container",
      optionsTree
    );
    setupSelectHTMLElements();
  };
  const createElementKey = (elementRecord, depth) => {
    logger2.debug("Create element key", {
      elementRecord,
      masterSelectedKeyArray,
      depth
    });
    if (Object.keys(elementRecord).length === 0) {
      throw new Error("Could not create element key, elementRecord is empty");
    }
    const key = masterSelectedKeyArray[depth];
    logger2.debug(`Obtained key "${key}" from selected key array`);
    if (key === void 0) {
      const firstElementRecordKey = Object.keys(elementRecord)[0];
      logger2.debug(
        `Key is undefined, use first elementRecord element ${firstElementRecordKey} instead`
      );
      return firstElementRecordKey;
    }
    return key;
  };
  const createElementOptionsTree = (element, parentHtmlId, depth) => {
    logger2.debug("Creating options tree : new iteration", {
      element
    });
    if (element.type === "group") {
      const currentKey = createElementKey(element.elementChildren, depth);
      const newElement = element.elementChildren[currentKey];
      if (newElement === void 0) {
        throw new Error(
          "Creation options tree iteration failed, at least one key is invalid"
        );
      }
      const currentHtmlId = `${parentHtmlId}:${currentKey}`;
      return createElementFormGroup(
        element.elementChildren,
        currentHtmlId,
        element.description
      ) + createElementOptionsTree(
        element.elementChildren[currentKey],
        currentHtmlId,
        depth + 1
      );
    }
    return createDescription(element.description);
  };
  const createElementFormGroup = (elementChildren, htmlId, parentDescription) => `
  <div class="form-group">
    <select id="${htmlId}">${createElementOptions(elementChildren)}</select>
  </div>
  <div class="metamorph-root-element-container-description form-group">
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
    getTransformation,
    setupRootSelectHtmlElement
  };
};

// src/common/util/object.ts
var logger3 = getLoggerInstance();
var getObjectValue = (obj, path) => {
  if (obj == void 0) {
    return;
  }
  const stack = path.split(".");
  logger3.debug("Get object value: ready", {
    stack
  });
  let value = obj;
  let subAtt = stack.shift();
  logger3.debug("Get object value: before iteration", {
    value,
    subAtt,
    stack
  });
  while (subAtt !== void 0) {
    value = value[subAtt];
    subAtt = stack.shift();
    logger3.debug("Get object value: iteration", {
      value,
      subAtt,
      stack
    });
  }
  logger3.debug("Get object value: final value", {
    value,
    subAtt,
    stack
  });
  return value;
};

// src/macro/pf1-metamorph/filter.ts
var logger4 = getLoggerInstance();
var checkFilter = (actor, filter) => {
  switch (filter.type) {
    case "equality":
      return checkStrictEqualityFilter(actor, filter);
    case "hasItem":
      return checkHasItemFilter(actor, filter);
  }
};
var checkStrictEqualityFilter = (actor, filter) => {
  logger4.debug("Check strict equality filter");
  const value = getObjectValue(actor, filter.path);
  logger4.debug("Found value to compare", {
    value,
    filter,
    actor
  });
  return value === filter.value;
};
var checkHasItemFilter = (actor, filter) => {
  logger4.debug("Check has item filter", {
    filter,
    actor
  });
  const foundItem = actor.items.find(
    (item) => item.name.toLowerCase() === filter.item.name.toLowerCase() && item.type === filter.item.type
  );
  return foundItem !== void 0;
};

// src/macro/pf1-metamorph/item.ts
var logger5 = getLoggerInstance();
var findItemsInActor = (actor, itemName, itemType) => actor.items.filter(
  ({ name, type }) => name.toLowerCase() === itemName.toLowerCase() && type === itemType
);
var findItemInCompendium = async (compendiumName, itemName, itemType) => {
  logger5.debug("Find item in compendium", {
    compendiumName,
    itemName,
    itemType
  });
  const compendiumCollection = game.packs.get(compendiumName);
  logger5.debug("Compendium found", {
    compendiumCollection
  });
  const itemDescriptor = compendiumCollection.index.find(
    ({ name, type }) => name.toLowerCase() === itemName.toLowerCase() && type === itemType
  );
  if (itemDescriptor === void 0) {
    logger5.debug("Item descriptor not found");
    return void 0;
  }
  const item = await compendiumCollection.getDocument(itemDescriptor._id);
  if (item === void 0) {
    logger5.warn(
      "Could not find item in compendium even though its descriptor was found"
    );
    return void 0;
  }
  logger5.debug("Item found", {
    item
  });
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

// src/macro/pf1-metamorph/ownership.ts
var logger6 = getLoggerInstance();
var createOwnershipChanges = (actor, ownershipChanges) => {
  logger6.debug("Create ownership changes", {
    actor,
    ownershipChanges
  });
  if (ownershipChanges === void 0) {
    return void 0;
  }
  switch (ownershipChanges) {
    case "removeAccess":
      return removeOwnershipAccess(actor.ownership);
    case "clampAccessToLimited":
      return clampOwnershipToLevelThreshold(
        actor.ownership,
        1 /* LIMITED */
      );
  }
};
var removeOwnershipAccess = (ownershipRecord) => {
  const newOwnership = {};
  for (const key of Object.keys(ownershipRecord)) {
    newOwnership[key] = 0 /* NONE */;
  }
  logger6.debug("Remove ownership access ownership changes", {
    ownershipRecord,
    newOwnership
  });
  return newOwnership;
};
var clampOwnershipToLevelThreshold = (ownershipRecord, levelThreshold) => {
  const newOwnership = {};
  for (const key of Object.keys(ownershipRecord)) {
    if (ownershipRecord[key] < levelThreshold) {
      newOwnership[key] = ownershipRecord[key];
      continue;
    }
    newOwnership[key] = levelThreshold;
  }
  logger6.debug("Clamp ownership access level", {
    ownershipRecord,
    newOwnership,
    levelThreshold
  });
  return newOwnership;
};

// src/macro/pf1-metamorph/polymorph.ts
var logger7 = getLoggerInstance();
var addTransformationItemToActor = async (actor, item, metamorphTransformSpellLevel, metamorphSpellDifficultyCheck) => {
  logger7.debug("Prepare to add item to actor", item);
  const compendiumItem = await findItemInCompendium(
    item.compendiumName,
    item.name,
    item.type
  );
  if (compendiumItem === void 0) {
    throw new Error(
      `Could not find item ${item.name} (type ${item.type}) in compendium ${item.compendiumName}`
    );
  }
  logger7.debug("Found item in compendium", {
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
  logger7.info("Apply metamorph");
  const { tokenTextureSrc, itemsToAdd, itemsToModify } = metamorphElementTransformation;
  const updates = [];
  updates.push(
    tokens.map(({ actor }) => {
      const updateData = {
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
        img: metamorphElementTransformation.actorImg,
        ownership: createOwnershipChanges(
          actor,
          metamorphElementTransformation.ownershipChanges
        )
      };
      logger7.debug("Apply metamorph to actor", {
        actor,
        updateData
      });
      return actor.update(updateData);
    })
  );
  updates.push(
    tokens.map((token) => {
      const tokenData = {
        texture: {
          src: tokenTextureSrc
        }
      };
      logger7.debug("Apply metamorph to token", {
        token,
        tokenData
      });
      return token.document.update(tokenData);
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
  logger7.debug("Create metamorph items in actor", actor);
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
var checkTokens = (tokens, elementTransformation) => {
  for (const token of tokens) {
    const { requirement } = elementTransformation;
    if (token.actor.flags?.metamorph?.active === true) {
      throw new UserWarning("Au moins un token a d\xE9j\xE0 un effet");
    }
    if (requirement !== void 0 && !checkFilter(token.actor, requirement)) {
      throw new UserWarning(
        "Au moins un token n'est pas compatible avec l'effet"
      );
    }
  }
};

// src/macro/pf1-metamorph/save.ts
var logger8 = getLoggerInstance();
var transformToMetamorphSave = (value) => {
  logger8.debug("Transform flags to metamorph if they are valid", value);
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
  logger8.debug("Extracted values in flags", {
    actorSize,
    tokenTextureSrc
  });
  if (actorSize === void 0 || tokenTextureSrc === void 0) {
    throw new Error("Flag root values are invalid");
  }
  return value;
};
var savePolymorphData = async (tokens, metamorphElementTransformEffect) => {
  logger8.info("Save data to actor flags to ensure rolling back is possible");
  const operations = tokens.map(async (token) => {
    logger8.debug("Save data related to a token", token);
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
      img: token.actor.img,
      ownership: token.actor.ownership
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
  logger8.info("Prepare to roll back to data before polymorph was triggered");
  const rollbackActions = tokens.map((token) => {
    logger8.debug("Rolling back token", token);
    const save = transformToMetamorphSave(token.actor.flags?.metamorph?.save);
    logger8.debug("Save obtained from token actor", save);
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
      logger8.debug("Get items to rollback", save);
      currentRollBackActions.push(
        Promise.all(
          rollbackModifiedItem(save.transformModifiedItem, token.actor.items)
        )
      );
    }
    if (save.transformAddedItemsData !== void 0) {
      logger8.debug("Get items to delete", save);
      const itemsToDelete = getItemsToDelete(
        token,
        save.transformAddedItemsData
      );
      logger8.debug(`Got ${itemsToDelete.length} items to delete`, {
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
  logger8.info("Trigger rollback");
  await Promise.all(rollbackActions);
  logger8.info("Rollback complete");
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
    logger8.warn(`Could not find ${currentItem.name} item(s) in actor`);
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
    logger8.warn("A modified item has expected type", currentItem);
  }
  return accumulator;
}, []);

// src/macro/pf1-metamorph/index.ts
var logger9 = getLoggerInstance();
var getNumberFromInputIfSpecified = (htm, selector) => {
  const value = parseInt(getInputElement(htm, selector).value);
  if (!isNaN(value)) {
    return value;
  }
  return value;
};
var triggerMetamorph = async (htm, controlledTokens, htmlController) => {
  try {
    logger9.info("Trigger Metamorph");
    const metamorphTransformSpellLevel = getNumberFromInputIfSpecified(
      htm,
      "#transformation-spell-level"
    );
    const metamorphSpellDifficultyCheck = getNumberFromInputIfSpecified(
      htm,
      "#transformation-spell-difficulty-check"
    );
    const elementTransformation = htmlController.getTransformation();
    logger9.info(`Transformation will be ${elementTransformation.label}`);
    checkTokens(controlledTokens, elementTransformation);
    await savePolymorphData(controlledTokens, elementTransformation);
    await applyMetamorph(
      controlledTokens,
      elementTransformation,
      metamorphTransformSpellLevel,
      metamorphSpellDifficultyCheck
    );
    logger9.info(`Transformation completed`);
  } catch (error) {
    notifyError(error);
  }
};
var cancelMetamorph = async (controlledTokens) => {
  try {
    await rollbackToPrePolymorphData(controlledTokens);
  } catch (error) {
    notifyError(error);
  }
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
      htmlController.setupRootSelectHtmlElement();
      htmlController.resetElementOptionsTree();
    }
  }).render(true);
};
try {
  logger9.setLevel(1 /* INFO */);
  logger9.setMacroName("pf1-metamorph");
  const {
    tokens: { controlled: controlledTokens }
  } = canvas;
  if (controlledTokens.length > 0) {
    openDialog(controlledTokens);
  } else {
    ui.notifications.warn("Aucun token n'est s\xE9lectionn\xE9");
  }
} catch (error) {
  notifyError(error);
}
