import { config } from './config'

export const createForm = () => `
    <form class="flexcol">
      <div class="form-group">
        <label>Transformation :</label>
        <select id="metamorph-transformation" style="text-transform: capitalize">${createTransformationOptions()}</select>
      </div>
      <div class="form-group">
        <label for="transformation-value">Niveau lanceur de sort :</label>
        <input type="number" id="transformation-spell-level"/>
      </div>
      <div class="form-group">
        <label for="transformation-value">DD Sort :</label>
        <input type="number" id="transformation-spell-difficulty-check"/>
      </div>
    </form>
  `

const createTransformationOptions = () => {
  const { transformations } = config
  return Object.keys(transformations).map(
    (key) => `<option value='${key}'>${transformations[key].label}</option>`,
  )
}
