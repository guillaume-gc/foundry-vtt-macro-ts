"use strict";

// src/common/lang/pf1/fr.ts
var translatePf1 = (value) => {
  const translationMap = {
    untyped: "Non Typ\xE9",
    slashing: "Tranchant",
    piercing: "Per\xE7ant",
    bludgeoning: "Contondant",
    fire: "Feu",
    electric: "Electricit\xE9",
    cold: "Froid",
    acid: "Acid",
    sonic: "Sonique",
    force: "Force",
    negative: "\xC9nergie N\xE9gative",
    positive: "\xC9nergie Postive",
    precision: "Pr\xE9cision",
    nonlethal: "Non L\xE9thal",
    energyDrain: "Absortion d'\xC9nergy",
    fear: "Apeur\xE9(e)",
    blind: "Aveugl\xE9(e)",
    confuse: "Confus(e)",
    deathEffects: "Effets de Mort",
    dazzle: "\xC9bloui(e)",
    mindAffecting: "Effects Mentaux",
    stun: "\xC9tourdi(e)",
    fatigue: "Fatigu\xE9(e)",
    sicken: "Fi\xE9vreux(se)",
    daze: "H\xE9b\xE9t\xE9(e)",
    disease: "Maladie",
    paralyze: "Paralys\xE9(e)",
    petrify: "P\xE9trifi\xE9(e)",
    poison: "Poison",
    bleed: "Saignement",
    sleep: "Sommeil",
    deaf: "Sourd(e)"
  };
  return translationMap[value] ?? value;
};

// src/macro/pf1-actor-info/config.ts
var cellStyle = "min-width: 100px";

// src/macro/pf1-actor-info/html.ts
var getTable = (header, rows) => `
    <table>
      <thead>
        ${header}
      </thead>
      <tbody>
        ${rows.join("")}
      </tbody>
    </table>
  `;
var getTableSubRows = (rowsData) => {
  const dipRows = rowsData.map(({ label, value }) => {
    return `
        <tr>
          <td style='${cellStyle}'>
            ${label}
          </td>
          <td style='${cellStyle}'>
            ${value}
          </td>
        </tr>
      `;
  });
  return dipRows.join("");
};
var getInitialMsg = (actors) => {
  if (actors.length === 1) {
    return `<a>Acteur selectionn\xE9 : <strong>${actors[0].name}</strong>`;
  }
  return `<a>Acteurs selectionn\xE9s : <strong>${actors.map((o) => o.name).join("</strong>, <strong>")}</strong></a>`;
};
var getDemoralizeTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">D\xE9moraliser (Intimidation)</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>DD</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const dc = 10 + rollData.attributes.hd.total + rollData.abilities.wis.mod;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${dc}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getDiplomacyTable = (actors) => {
  const header = `
    <tr>
      <td colSpan='3'>Diplomacie</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Attitude initial</td>
    <td style='${cellStyle}'>DD</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const rowsData = [
      { label: "Hostile", value: 25 + rollData.abilities.cha.mod },
      { label: "Inamical", value: 20 + rollData.abilities.cha.mod },
      { label: "Indiff\xE9rent", value: 15 + rollData.abilities.cha.mod },
      { label: "Amical", value: 10 + rollData.abilities.cha.mod },
      { label: "Serviable", value: rollData.abilities.cha.mod }
    ];
    const actorRow = `<td rowspan='8'>${actor.name}</td>`;
    const dipRows = getTableSubRows(rowsData);
    return `
      <tr>${actorRow}</tr>
      <tr>${dipRows}</tr>
    `;
  });
  return getTable(header, rows);
};
var getSocialDefensesTable = (actors) => {
  const demoralizeTable = getDemoralizeTable(actors);
  const diplomacyTable = getDiplomacyTable(actors);
  return demoralizeTable + diplomacyTable;
};
var getAcTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="3">Classe d'Armure</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Situation</td>
    <td style='${cellStyle}'>CA</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const rowsData = [
      { label: "Base", value: rollData.attributes.ac.normal.total },
      {
        label: "Attaque de Contact",
        value: rollData.attributes.ac.touch.total
      },
      {
        label: "Pris au d\xE9pourvu",
        value: rollData.attributes.ac.flatFooted.total
      }
    ];
    const actorRow = `<td rowspan='5'>${actor.name}</td>`;
    const acRows = getTableSubRows(rowsData);
    return `
      <tr>${actorRow}</tr>
      <tr>${acRows}</tr>
    `;
  });
  return getTable(header, rows);
};
var getCmdTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="3">Degr\xE9 de Man\u0153uvre D\xE9fensive</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Situation</td>
    <td style='${cellStyle}'>CMD</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const rowsData = [
      { label: "Base", value: rollData.attributes.cmd.total },
      {
        label: "Pris au d\xE9pourvu",
        value: rollData.attributes.cmd.flatFootedTotal
      }
    ];
    const actorRow = `<td rowspan='5'>${actor.name}</td>`;
    const dmdRows = getTableSubRows(rowsData);
    return `
      <tr>${actorRow}</tr>
      <tr>${dmdRows}</tr>
    `;
  });
  return getTable(header, rows);
};
var getFeintTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Feinter en combat (Bluff)</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>DD</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const babDc = 10 + rollData.attributes.bab.total + rollData.abilities.wis.mod;
    const senseMotiveDc = 10 + rollData.skills.sen.mod;
    const senseMotiveTrained = rollData.skills.sen.rank > 0;
    const dc = senseMotiveDc > babDc && senseMotiveTrained ? senseMotiveDc : babDc;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${dc}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getSrTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Resistance \xE0 la Magie</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>RM</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const sr = rollData.attributes.sr.total;
    const hasSr = sr > 0;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${hasSr ? sr : "Aucune"}</td>
      </tr>
    `;
  });
  return getTable(header, rows);
};
var getEnergyResistanceTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Resistance aux \xE9n\xE9rgies</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const resistances = rollData.traits.eres;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${resistances}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getResistanceTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Resistances</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const resistances = rollData.traits.cres;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${resistances}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getDamageImmunitiesTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Immunit\xE9s aux dommages</td>
    <tr>
    <td style='min-width: 100px'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const damageImmunity = rollData.traits.di.value.map(translatePf1);
    const damageImmunityCustom = rollData.traits.di.custom;
    if (damageImmunityCustom) {
      damageImmunity.push(damageImmunityCustom);
    }
    const hasDamageImmunity = damageImmunity.length > 0;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${hasDamageImmunity ? damageImmunity.join(", ") : "Aucun"}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getImmunitiesTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Immunit\xE9s</td>
    <tr>
    <td style='min-width: 100px'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const immunity = rollData.traits.ci.value.map(translatePf1);
    const immunityCustom = rollData.traits.ci.custom;
    if (immunityCustom) {
      immunity.push(immunityCustom);
    }
    const hasImmunity = immunity.length > 0;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${hasImmunity ? immunity.join(", ") : "Aucun"}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getDamageVulnerabilitiesTable = (actors) => {
  const header = `
    <tr>
      <td colSpan="2">Vuln\xE9rabilit\xE9s aux dommages</td>
    <tr>
    <td style='min-width: 100px'>Acteur</td>
    <td style='${cellStyle}'>Vuln\xE9rabilit\xE9s</td>
  `;
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false });
    const damageVulnerabilities = rollData.traits.dv.value.map(translatePf1);
    const damageVulnerabilitiesCustom = rollData.traits.dv.custom;
    if (damageVulnerabilitiesCustom) {
      damageVulnerabilities.push(damageVulnerabilitiesCustom);
    }
    const hasDamageVulnerabilities = damageVulnerabilities.length > 0;
    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${hasDamageVulnerabilities ? damageVulnerabilities.join(", ") : "Aucune"}</td>
      </tr>`;
  });
  return getTable(header, rows);
};
var getCombatDefensesTable = (actors) => {
  const acTable = getAcTable(actors);
  const dmdTable = getCmdTable(actors);
  const feintTable = getFeintTable(actors);
  const srTable = getSrTable(actors);
  const energyResistanceTable = getEnergyResistanceTable(actors);
  const resistanceTable = getResistanceTable(actors);
  const damageImmunities = getDamageImmunitiesTable(actors);
  const immunities = getImmunitiesTable(actors);
  const damageVulnerabilities = getDamageVulnerabilitiesTable(actors);
  return acTable + dmdTable + feintTable + srTable + energyResistanceTable + resistanceTable + damageImmunities + immunities + damageVulnerabilities;
};

// src/macro/pf1-actor-info/chat.ts
var renderChatMessage = (chatMessage) => {
  const chatMessageData = ChatMessage.applyRollMode(
    {
      content: chatMessage,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ user: game.user }),
      type: 0 /* OTHER */
    },
    game.settings.get("core", "rollMode")
  );
  ChatMessage.create(chatMessageData);
};
var renderSocialDefenses = (actors) => {
  const chatMessage = getSocialDefensesTable(actors);
  renderChatMessage(chatMessage);
};
var renderCombatDefenses = (actors) => {
  const chatMessage = getCombatDefensesTable(actors);
  renderChatMessage(chatMessage);
};
var renderAll = (actors) => {
  const socialDefenses = getSocialDefensesTable(actors);
  const combatDefenses = getCombatDefensesTable(actors);
  const chatMessage = socialDefenses + combatDefenses;
  renderChatMessage(chatMessage);
};

// src/macro/pf1-actor-info/index.ts
var openDialog = (actors) => {
  new Dialog({
    title: "Obtenir les informations d'acteurs",
    content: getInitialMsg(actors),
    buttons: {
      socialDefenses: {
        label: "Social",
        callback: () => renderSocialDefenses(actors)
      },
      combatDefenses: {
        label: "Combat",
        callback: () => renderCombatDefenses(actors)
      },
      all: {
        label: "Tout",
        callback: () => renderAll(actors)
      }
    }
  }).render(true);
};
try {
  const {
    tokens: { controlled: selectedTokens }
  } = canvas;
  const compatibleActors = selectedTokens.map(({ actor }) => actor).filter(({ testUserPermission }) => testUserPermission(game.user, "OWNER"));
  if (!compatibleActors.length) {
    ui.notifications.warn("Aucun acteur compatible trouv\xE9");
  } else {
    openDialog(compatibleActors);
  }
} catch (error) {
  ui.notifications.error(
    "Une erreur a \xE9t\xE9 d\xE9tect\xE9 lors de l'ex\xE9cution du script, veillez voir la console pour plus d'information"
  );
  console.error(error);
}
