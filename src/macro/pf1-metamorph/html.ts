import { getSelectElementValue } from '../../common/util/jquery'
import { config } from './config'

const { style } = config

export const createForm = () => `
    <form class="flexcol">
      <div class="form-group">
        <label>Groupe :</label>
        <select id="metamorph-transformation-group">${createTransformationGroupOptions()}</select>
      </div>
      <div id="metamorph-transformation-group-description"> class="form-group">
      </div>
      <div class="form-group">
        <label>Transformation :</label>
        <select id="metamorph-transformation"></select>
      </div>
      <div id="metamorph-transformation-description" class="form-group">
      </div>
      <div class="form-group">
        <label for="transformation-value">Niveau lanceur de sort :</label>
        <input type="number" id="transformation-spell-level"/>
      </div>
      <div class="form-group">
        <label for="transformation-value">DD Sort :</label>
        <input type="number" id="transformation-spell-difficulty-check"/>
      </div>
      <div class="form-group">
         <p style="${style.description}"><i style="${
           style.descriptionIcon
         }" class="fa-solid fa-circle-info"></i>10 + niveau du sort + modificateur int / sag / cha</p>
      </div>
    </form>
  `

const createTransformationGroupOptions = (): string => {
  const { transformationGroups } = config
  return Object.keys(transformationGroups)
    .map(
      (key) =>
        `<option value='${key}'>${transformationGroups[key].label}</option>`,
    )
    .join('')
}

export const createTransformationGroupValues = (
  htm: JQuery<HTMLElement>,
): {
  optionValue: string
  description?: string
} => {
  const { transformationGroups } = config

  const currentGroupValue = getSelectElementValue(
    htm,
    '#metamorph-transformation-group',
  )

  const group = transformationGroups[currentGroupValue]
  if (group === undefined) {
    return { optionValue: '<option>Aucune option disponible</option>' }
  }

  const { transformation, description } = group

  return {
    optionValue: Object.keys(transformation)
      .map(
        (key) => `<option value='${key}'>${transformation[key].label}</option>`,
      )
      .join(''),
    description: description
      ? `<p style="${style.description}"><i style="${
          style.descriptionIcon
        }" class="fa-solid fa-circle-info"></i>${TextEditor.enrichHTML(
          description,
          { async: false },
        )}</p>`
      : undefined,
  }
}

export const createTransformationEffectDescription = (
  htm: JQuery<HTMLElement>,
): string | undefined => {
  const { transformationGroups } = config

  const currentGroupValue = getSelectElementValue(
    htm,
    '#metamorph-transformation-group',
  )

  const group = transformationGroups[currentGroupValue]
  if (group === undefined) {
    return undefined
  }

  const { transformation } = group

  const currentTransformationValue = getSelectElementValue(
    htm,
    '#metamorph-transformation',
  )

  const { description } = transformation[currentTransformationValue]

  return description
    ? `<p style="${style.description}"><i style="${
        style.descriptionIcon
      }" class="fa-solid fa-circle-info"></i>${TextEditor.enrichHTML(
        description,
        { async: false },
      )}</p>`
    : undefined
}
