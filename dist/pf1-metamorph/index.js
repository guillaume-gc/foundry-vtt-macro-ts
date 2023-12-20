"use strict";

// src/macro/pf1-metamorph/buff.ts
var findBuffInActor = (actor, buffName) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);

// src/macro/pf1-metamorph/index.ts
var applyMetamorph = async (tokens, buffName, buffLevel) => {
  const operations = tokens.map(async ({ actor }) => {
    const buff = findBuffInActor(actor, buffName);
    console.log("buff", buff);
    const updateQuery = {
      "system.level": buffLevel,
      "system.active": true
    };
    return buff.update(updateQuery);
  });
  await Promise.all(operations);
};
var main = async () => {
  const {
    tokens: { controlled }
  } = canvas;
  await applyMetamorph(controlled, "Vision des H\xE9ros des Terres Inond\xE9es", 15);
};
main().catch((error) => {
  ui.notifications.error("Erreur, voir la console pour plus d'information");
  console.error(error);
});
