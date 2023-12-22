import { config } from './config'

export const createForm = () => `
    <form class="flexcol">
      <div class="form-group">
        <label>Transformation :</label>
        <select id="metamorph-transformation" style="text-transform: capitalize">${createTransformationOptions()}</select>
       </div>
    </form>
  `

const createTransformationOptions = () => {
  const { transformations } = config
  return Object.keys(transformations).map(
    (key) => `<option value='${key}'>${transformations[key].label}</option>`,
  )
}
