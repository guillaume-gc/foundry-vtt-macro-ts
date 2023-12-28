import { getSelectElementValue } from '../../common/util/jquery'
import { config } from './config'

const descriptionIconStyle = 'padding-right: 5px;'

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
         <p style="font-style: italic;"><i style="${descriptionIconStyle}" class="fa-solid fa-circle-info"></i>10 + niveau du sort + modificateur int / sag / cha </p>
      </div>
    </form>
  `

const createTransformationGroupOptions = (): string => {
  const { groups } = config
  return Object.keys(groups)
    .map((key) => `<option value='${key}'>${groups[key].label}</option>`)
    .join('')
}

export const createTransformationGroupValues = (
  htm: JQuery<HTMLElement>,
): {
  optionValue: string
  description?: string
} => {
  const { groups } = config

  const currentGroupValue = getSelectElementValue(
    htm,
    '#metamorph-transformation-group',
  )

  const group = groups[currentGroupValue]
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
      ? `<p style="font-style: italic;"><i style="${descriptionIconStyle}" class="fa-solid fa-circle-info"></i>${description}</p>`
      : undefined,
  }
}

export const createTransformationEffectDescription = (
  htm: JQuery<HTMLElement>,
): string | undefined => {
  const { groups } = config

  const currentGroupValue = getSelectElementValue(
    htm,
    '#metamorph-transformation-group',
  )

  const group = groups[currentGroupValue]
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
    ? `<p style="font-style: italic;"><i style="${descriptionIconStyle}" class="fa-solid fa-circle-info"></i>${description}</p>`
    : undefined
}
