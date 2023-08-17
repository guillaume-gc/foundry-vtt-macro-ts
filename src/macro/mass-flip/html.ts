import { getSelectElementValue } from '../../common/util/jquery'
import { knownActorGroups } from './config'

export const createForm = (actorGroupNames: Set<string>) => `
    <form class="flexcol">
      <div class="form-group">
        <label>Groupe d'acteur :</label>
        <select id="mass-flip-current-actor-groups" style="text-transform: capitalize">${createActorGroupOptions(
          actorGroupNames,
        )}</select>
       </div>
       <div class="form-group">
        <label>Image :</label>
        <select id="mass-flip-images" style="text-transform: capitalize"></select>
      </div>
    </form>
  `

const createActorGroupOptions = (actorGroupNames: Set<string>) => {
  if (actorGroupNames.size === 0) {
    return '<option>Aucun acteur compatible</option>'
  }

  return [...actorGroupNames].map(
    (actorGroup) =>
      `<option value='${actorGroup}'>${decodeURI(actorGroup)}</option>`,
  )
}

export const createImageOptions = (htm: JQuery) => {
  const currentActorGroupsLabel = getSelectElementValue(
    htm,
    '#mass-flip-current-actor-groups',
  )

  console.log('currentActorGroupsLabel', currentActorGroupsLabel)

  const actorGroup = knownActorGroups[currentActorGroupsLabel]
  if (actorGroup === undefined) {
    return '<option>Aucune option disponible</option>'
  }

  const { images } = actorGroup

  return Object.keys(images)
    .map((key) => `<option value='${key}'>${images[key].name}</option>`)
    .join('')
}
