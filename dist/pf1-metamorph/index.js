"use strict";

// src/macro/pf1-metamorph/buff.ts
var findBuffInActor = (actor, buffName) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);
var findBuffInCompendium = (compendiumName, buffName) => game.packs.get(compendiumName).index.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);

// src/macro/pf1-metamorph/index.ts
try {
  const {
    tokens: { controlled }
  } = canvas;
  const actor = controlled[0].actor;
  const actorBuff = findBuffInActor(actor, "Vision magique");
  const compendiumBuff = findBuffInCompendium(
    "world.effets-de-sorts",
    "Rapetissement (n)"
  );
  console.log("actorBuff", actorBuff);
  console.log("compendiumBuff", compendiumBuff);
} catch (error) {
  ui.notifications.error("Erreur, voir la console pour plus d'information");
  console.error(error);
}
