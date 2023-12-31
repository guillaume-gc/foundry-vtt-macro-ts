import { getSelectElementValue } from '../../common/util/jquery'
import { TokenPF } from '../../type/foundry/system/pf1/canvas/token-pf'
import { ActorGroup, knownActorGroups } from './config'
import { updateScrolling } from './scrolling'
import { startSound, stopCurrentSounds } from './sound'

export const flipTokens = async (htm: JQuery, ownedTokens: TokenPF[]) => {
  const actorGroupsLabel = getSelectElementValue(
    htm,
    '#pf1-mass-flip-current-actor-groups',
  )
  const decodedActorGroup = decodeURI(actorGroupsLabel)

  const actorGroup = knownActorGroups[actorGroupsLabel]
  if (actorGroup === undefined) {
    throw new Error(`Actor group "${decodedActorGroup}" not known`)
  }

  const imageLabel = getSelectElementValue(htm, '#pf1-mass-flip-images')

  const actorGroupFileName = actorGroup.images[imageLabel].fileName
  if (actorGroupFileName === undefined) {
    throw new Error(
      `Image type "${imageLabel}" not known for ${decodedActorGroup} actor group`,
    )
  }

  const tokensGroup = ownedTokens.filter(
    (token) => token.document.name === decodedActorGroup,
  )
  if (tokensGroup.length === 0) {
    throw new Error(
      `Token group ${decodedActorGroup} has no controlled token present in the scene`,
    )
  }

  console.log('Token to update: ', tokensGroup)

  const updates = tokensGroup.map((token) => {
    const currentFullTextureFileName = token.document.texture.src
    const currentRelativeTextureFileName = getRelativeTextureFileName(
      currentFullTextureFileName,
    )

    const newTextureRelativeFileName = handleWildCard(
      actorGroup,
      actorGroupFileName,
      currentRelativeTextureFileName,
    )

    const newTextureFullFileName = currentFullTextureFileName.replace(
      currentRelativeTextureFileName,
      newTextureRelativeFileName,
    )

    return {
      _id: token.id,
      'texture.src': newTextureFullFileName,
      'texture.scaleX': actorGroup.images[imageLabel].scale.x,
      'texture.scaleY': actorGroup.images[imageLabel].scale.y,
    }
  })

  await game.scenes.viewed.updateEmbeddedDocuments('Token', updates)

  await stopCurrentSounds()

  const { sound, scrolling } = actorGroup.images[imageLabel]

  if (sound) {
    await startSound(sound)
  }

  if (scrolling) {
    await updateScrolling(scrolling)
  }
}

const handleWildCard = (
  actorGroup: ActorGroup,
  actorGroupFileName: string,
  currentRelativeTextureFileName: string,
) => {
  if (!actorGroupFileName.includes('*')) {
    return actorGroupFileName
  }

  const tokenCurrentTextureWildCartValue = getTokenCurrentTextureWildCartValue(
    actorGroup,
    currentRelativeTextureFileName,
  )

  console.log(
    'tokenCurrentTextureWildCartValue',
    tokenCurrentTextureWildCartValue,
  )

  return actorGroupFileName.replace('*', tokenCurrentTextureWildCartValue)
}

const getRelativeTextureFileName = (textureFullFileName: string) => {
  const pathArray = textureFullFileName.split('/')

  return pathArray[pathArray.length - 1]
}

const getTokenCurrentTextureWildCartValue = (
  actorGroup: ActorGroup,
  currentRelativeTextureFileName: string,
) => {
  for (const image of Object.values(actorGroup.images)) {
    const [beforeWildCard, afterWildCard] = image.fileName.split('*')
    if (
      !(
        currentRelativeTextureFileName.includes(beforeWildCard) &&
        currentRelativeTextureFileName.includes(afterWildCard)
      )
    ) {
      continue
    }

    return currentRelativeTextureFileName
      .replace(beforeWildCard, '')
      .replace(afterWildCard, '')
  }

  throw new Error(
    `Could not find texture ${currentRelativeTextureFileName} actor group`,
  )
}
