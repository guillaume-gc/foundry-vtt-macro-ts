"use strict";

// src/common/util/jquery.ts
var editInnerHtml = (htm, selector, value) => {
  const element = htm.find(selector)?.[0];
  if (element == null) {
    console.error(`Could not find element "${selector}"`);
    throw new Error();
  }
  element.innerHTML = value;
};
var getSelectElementValue = (htm, selector) => {
  const element = htm.find(selector)?.[0];
  if (element == null) {
    throw new Error(`Could not find element "${selector}"`);
  }
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Element ${selector} is not a HTML selector`);
  }
  return element.value;
};

// src/macro/mass-flip/config.ts
var knownActorGroups = {
  // Cheval Léger
  "Cheval%20L%C3%A9ger": {
    images: {
      idle: {
        name: "Immobile",
        fileName: "horse-*-plain-idle.webm"
      },
      walk: {
        name: "Marcher",
        fileName: "horse-*-plain-walk.webm",
        sound: {
          playlist: "Monsters",
          soundName: "Horse Walking"
        }
      },
      run: {
        name: "Galoper",
        fileName: "horse-*-plain-gallop.webm",
        sound: {
          playlist: "Monsters",
          soundName: "Horse Running"
        }
      }
    }
  }
};

// src/macro/mass-flip/sound.ts
var startSound = async (sound) => {
  const playlistToUse = game.playlists.find((p) => p.name === sound.playlist);
  if (playlistToUse === void 0) {
    throw new Error(`Could not find "${sound.playlist}" playlist to play sound`);
  }
  console.log(`Found playlist ${sound.playlist} to play sound`, playlistToUse);
  const soundToPlay = playlistToUse.sounds.find(
    (s) => s.name === sound.soundName
  );
  if (soundToPlay === void 0) {
    throw new Error(`Could not find "${sound.soundName}" sound to play`);
  }
  console.log(`Found sound ${sound.soundName} to play`, soundToPlay);
  await playlistToUse.playSound(soundToPlay);
};
var stopCurrentSounds = async () => {
  const sounds = Object.values(knownActorGroups).flatMap((item) => Object.values(item.images)).filter((image) => image.sound).map((image) => image.sound);
  console.log("Stop all sounds", sounds);
  for (const sound of sounds) {
    const playlistToUse = game.playlists.find((p) => p.name === sound.playlist);
    if (playlistToUse === void 0) {
      throw new Error(
        `Could not find "${sound.playlist}" playlist to stop sounds`
      );
    }
    console.log(`Found playlist ${sound.playlist} to stop sound`, playlistToUse);
    const soundToStop = playlistToUse.sounds.find(
      (s) => s.name === sound.soundName
    );
    if (soundToStop === void 0) {
      throw new Error(`Could not find "${sound.soundName}" sound to stop`);
    }
    if (!soundToStop.playing) {
      console.log(
        `Found sound ${sound.soundName} to stop, but it's not being played by the playlist`,
        soundToStop
      );
      continue;
    }
    console.log(`Found sound ${sound.soundName} to stop`, soundToStop);
    await playlistToUse.stopSound(soundToStop);
  }
};

// src/macro/mass-flip/flip.ts
var flipTokens = async (htm, ownedTokens) => {
  const actorGroupsLabel = getSelectElementValue(
    htm,
    "#mass-flip-current-actor-groups"
  );
  const decodedActorGroup = decodeURI(actorGroupsLabel);
  const actorGroup = knownActorGroups[actorGroupsLabel];
  if (actorGroup === void 0) {
    throw new Error(`Actor group "${decodedActorGroup}" not known`);
  }
  const imageLabel = getSelectElementValue(htm, "#mass-flip-images");
  const actorGroupFileName = actorGroup.images[imageLabel].fileName;
  if (actorGroupFileName === void 0) {
    throw new Error(
      `Image type "${imageLabel}" not known for ${decodedActorGroup} actor group`
    );
  }
  const tokensGroup = ownedTokens.filter(
    (token) => token.document.name === decodedActorGroup
  );
  if (tokensGroup.length === 0) {
    throw new Error(
      `Token group ${decodedActorGroup} has no controlled token present in the scene`
    );
  }
  const updates = tokensGroup.map((token) => {
    const currentFullTextureFileName = token.document.texture.src;
    const currentRelativeTextureFileName = getRelativeTextureFileName(
      currentFullTextureFileName
    );
    const newTextureRelativeFileName = handleWildCard(
      actorGroup,
      actorGroupFileName,
      currentRelativeTextureFileName
    );
    const newTextureFullFileName = currentFullTextureFileName.replace(
      currentRelativeTextureFileName,
      newTextureRelativeFileName
    );
    return {
      _id: token.id,
      "texture.src": newTextureFullFileName
    };
  });
  await game.scenes.viewed.updateEmbeddedDocuments("Token", updates);
  await stopCurrentSounds();
  const { sound } = actorGroup.images[imageLabel];
  if (sound) {
    await startSound(sound);
  }
};
var handleWildCard = (actorGroup, actorGroupFileName, currentRelativeTextureFileName) => {
  if (!actorGroupFileName.includes("*")) {
    return actorGroupFileName;
  }
  const tokenCurrentTextureWildCartValue = getTokenCurrentTextureWildCartValue(
    actorGroup,
    currentRelativeTextureFileName
  );
  console.log(
    "tokenCurrentTextureWildCartValue",
    tokenCurrentTextureWildCartValue
  );
  return actorGroupFileName.replace("*", tokenCurrentTextureWildCartValue);
};
var getRelativeTextureFileName = (textureFullFileName) => {
  const pathArray = textureFullFileName.split("/");
  return pathArray[pathArray.length - 1];
};
var getTokenCurrentTextureWildCartValue = (actorGroup, currentRelativeTextureFileName) => {
  for (const image of Object.values(actorGroup.images)) {
    const [beforeWildCard, afterWildCard] = image.fileName.split("*");
    if (!(currentRelativeTextureFileName.includes(beforeWildCard) && currentRelativeTextureFileName.includes(afterWildCard))) {
      continue;
    }
    return currentRelativeTextureFileName.replace(beforeWildCard, "").replace(afterWildCard, "");
  }
  throw new Error(
    `Could not find texture ${currentRelativeTextureFileName} actor group`
  );
};

// src/macro/mass-flip/html.ts
var createForm = (actorGroupNames) => `
    <form class="flexcol">
      <div class="form-group">
        <label>Groupe d'acteur :</label>
        <select id="mass-flip-current-actor-groups" style="text-transform: capitalize">${createActorGroupOptions(
  actorGroupNames
)}</select>
       </div>
       <div class="form-group">
        <label>Image :</label>
        <select id="mass-flip-images" style="text-transform: capitalize"></select>
      </div>
    </form>
  `;
var createActorGroupOptions = (actorGroupNames) => {
  if (actorGroupNames.size === 0) {
    return "<option>Aucun acteur compatible</option>";
  }
  return [...actorGroupNames].map(
    (actorGroup) => `<option value='${actorGroup}'>${decodeURI(actorGroup)}</option>`
  );
};
var createImageOptions = (htm) => {
  const currentActorGroupsLabel = getSelectElementValue(
    htm,
    "#mass-flip-current-actor-groups"
  );
  console.log("currentActorGroupsLabel", currentActorGroupsLabel);
  const actorGroup = knownActorGroups[currentActorGroupsLabel];
  if (actorGroup === void 0) {
    return "<option>Aucune option disponible</option>";
  }
  const { images } = actorGroup;
  return Object.keys(images).map((key) => `<option value='${key}'>${images[key].name}</option>`).join("");
};

// src/macro/mass-flip/index.ts
var openDialog = (currentActorGroups, ownedTokens) => {
  const form = createForm(currentActorGroups);
  new Dialog({
    title: "Mass flip",
    content: form,
    buttons: {
      use: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: "Confirmer le flip",
        callback: (htm) => flipTokens(htm, ownedTokens)
      }
    },
    render: (htm) => {
      htm.find("#actorGroup").change(() => refreshImageOptions(htm));
      refreshImageOptions(htm);
    }
  }).render(true);
};
var refreshImageOptions = (htm) => {
  const imageOptions = createImageOptions(htm);
  editInnerHtml(htm, "#mass-flip-images", imageOptions);
};
try {
  const {
    tokens: { ownedTokens }
  } = canvas;
  const actorGroupNames = new Set(
    ownedTokens.map((token) => encodeURI(token.document.name)).filter(
      (encodedTokenName) => Object.keys(knownActorGroups).includes(encodedTokenName)
    )
  );
  openDialog(actorGroupNames, ownedTokens);
} catch (error) {
  ui.notifications.error("Erreur, voir la console pour plus d'information");
  console.error(error);
}
