"use strict";

// src/macro/pf1-metamorph/buff.ts
var findBuffInActor = (actor, buffName) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);

// src/macro/pf1-metamorph/index.ts
var applyMetamorph = async (tokens, buffName, buffLevel) => {
  const buffOperations = tokens.map(async ({ actor }) => {
    const buff = findBuffInActor(actor, buffName);
    console.log("buff", buff);
    const updateQuery = {
      "system.level": buffLevel,
      "system.active": true
    };
    return buff.update(updateQuery);
  });
  const actorsOperations = tokens.map(async ({ actor }) => {
    return actor.update({ "system.traits.size": "huge" });
  });
  const tokensOperations = tokens.map(async (token) => {
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
