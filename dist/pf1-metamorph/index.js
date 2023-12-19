"use strict";

// src/macro/pf1-metamorph/buff.ts
var findBuffInActor = (actor, buffName) => actor.items.find(
  ({ name, type }) => name.toLowerCase() === buffName.toLowerCase() && type === "buff"
);

// src/macro/pf1-metamorph/index.ts
try {
  const {
    tokens: { controlled }
  } = canvas;
  const actor = controlled[0].actor;
  const actorBuff = findBuffInActor(actor, "Vision magique");
  console.log("actorBuff", actorBuff);
} catch (error) {
  ui.notifications.error("Erreur, voir la console pour plus d'information");
  console.error(error);
}
