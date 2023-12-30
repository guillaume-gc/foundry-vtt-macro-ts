import { getLoggerInstance } from '../../common/log/logger'
import { editInnerHtml } from '../../common/util/jquery'
import {
  MetamorphElement,
  MetamorphElementTransformation,
  MetamorphElementsRecord,
  config,
} from './config'

const { style, rootElements } = config

const logger = getLoggerInstance()

export interface HTMLController {
  createForm: () => string
  resetElementOptionsTree: () => void
  setHtm: (value: JQuery<HTMLElement> | undefined) => void
  getTransformation: () => MetamorphElementTransformation
}

export const createHtmlController = (): HTMLController => {
  let selectedKeyArray: string[] = []
  let htm: JQuery<HTMLElement> | undefined = undefined

  const setHtm = (value: JQuery<HTMLElement> | undefined) => {
    htm = value
  }

  const getDefinedHtm = (): JQuery<HTMLElement> => {
    if (htm === undefined) {
      throw new Error("Trying ot get Html while it's undefined")
    }

    return htm
  }

  const createForm = () => `
    <form class='flexcol'>
      <div class='form-group'>
        <label>Element :</label>
        <select id='metamorph-transformation-element'>${createElementOptions(
          rootElements,
        )}</select>
      </div>
      <div id='metamorph-transformation-element-description' class='form-group'>
      </div>
      <span id='metamorph-elements'></span>
    </form>
  `

  const selectOnChange = (event: Event, index: number) => {
    const htmlElement = event.target as HTMLSelectElement | undefined
    if (htmlElement === undefined) {
      throw new Error('HTML element is invalid')
    }

    logger.debug('Obtained HTML element from event', {
      htmlElement,
    })

    if (isNaN(index)) {
      throw new Error('Index is not a valid number')
    }

    const value = htmlElement.value

    overrideSelectedKeyArray(index, value)
    resetElementOptionsTree()
  }

  const setSelectEvents = () => {
    const metamorphSelectRootElement = getDefinedHtm().find(
      '#metamorph-transformation-element',
    )[0]

    logger.info('Found metamorph select root element', {
      metamorphSelectRootElement,
    })

    if (metamorphSelectRootElement === undefined) {
      throw new Error('Could not get metamorph root select element')
    }

    metamorphSelectRootElement.addEventListener('change', (event) => {
      selectOnChange(event, 0)
    })

    const metamorphSelectElements = getDefinedHtm().find('#metamorph-elements')

    let index = 1
    for (const htmlElement of metamorphSelectElements) {
      htmlElement.addEventListener('change', (event) => {
        selectOnChange(event, index)
        index++
      })
    }
  }

  const getTransformation = (): MetamorphElementTransformation => {
    const getTransformationIteration = (
      element: MetamorphElement | undefined,
      tempSelectedKeyArray: string[],
    ): MetamorphElementTransformation => {
      logger.debug('Get transformation iteration', {
        element,
        tempSelectedKeyArray,
      })

      if (element === undefined) {
        throw new Error(
          'Could not iterate through transformation, element undefined',
        )
      }

      if (element.type === 'group') {
        const currentKey = tempSelectedKeyArray.pop()
        if (currentKey === undefined) {
          throw new Error(
            'Could not iterate through transformation, selectedKeyArray is empty',
          )
        }

        return getTransformationIteration(
          element.elementChildren[currentKey],
          tempSelectedKeyArray,
        )
      }

      return element
    }

    const tempSelectedKeyArray = [...selectedKeyArray]
    const firstKey = tempSelectedKeyArray.pop()

    if (firstKey === undefined) {
      throw new Error(
        'Could not iterate through transformation, selectedKeyArray is empty',
      )
    }

    return getTransformationIteration(
      rootElements[firstKey],
      tempSelectedKeyArray,
    )
  }

  const setSelectedKeyArray = (value: string[]) => {
    selectedKeyArray = value
  }

  const overrideSelectedKeyArray = (index: number, value: string) => {
    setSelectedKeyArray(
      selectedKeyArray
        .slice(0, index)
        .concat(value, selectedKeyArray.slice(index)),
    )
  }

  const resetElementOptionsTree = (): void => {
    logger.debug('Reset element options tree', selectedKeyArray)

    const firstKey = selectedKeyArray[0]
    if (firstKey === undefined) {
      throw new Error('Could not get first key')
    }

    const firstElement = rootElements[firstKey]
    if (firstElement === undefined) {
      throw new Error('Could not get first element')
    }

    const optionsTree = createElementOptionsTree(
      firstElement,
      `metamorph-elements-${firstKey}`,
      1,
      selectedKeyArray.slice(1),
    )

    editInnerHtml(getDefinedHtm(), '#metamorph-elements', optionsTree)
    setSelectEvents()
  }

  const createElementOptionsTree = (
    element: MetamorphElement,
    parentHtmlId: string,
    index: number,
    selectedKeyArray: string[],
  ): string => {
    logger.debug('Creating options tree : new iteration', {
      element,
      selectedKeyArray,
    })

    if (element.type === 'group') {
      const currentKey = selectedKeyArray.pop()

      if (currentKey === undefined) {
        throw new Error('At least one key is missing')
      }

      const newElement = element.elementChildren[currentKey]

      if (newElement === undefined) {
        throw new Error('At least one key is invalid')
      }

      const currentHtmlId = `${parentHtmlId}:${currentKey}`

      return (
        createElementFormGroup(
          element.elementChildren,
          currentHtmlId,
          index,
          element.description,
        ) +
        createElementOptionsTree(
          element.elementChildren[currentKey],
          currentHtmlId,
          index + 1,
          selectedKeyArray,
        )
      )
    }

    return createDescription(element.description)
  }

  const createElementFormGroup = (
    elementChildren: MetamorphElementsRecord,
    htmlId: string,
    index: number,
    parentDescription?: string,
  ): string => `
  <div class="form-group">
    <label>Element :</label>
    <select id="${htmlId}" onclick='' index='${index}'>${createElementOptions(
      elementChildren,
    )}</select>
  </div>
  <div class="metamorph-transformation-element-description form-group">
    ${createDescription(parentDescription)}
  </div>
`

  const createDescription = (description?: string): string => `
  <div class="form-group">
   ${
     description
       ? `<p style="${style.description}"><i style="${
           style.descriptionIcon
         }" class="fa-solid fa-circle-info"></i>${TextEditor.enrichHTML(
           description,
           { async: false },
         )}</p>`
       : ''
   }
  </div>
`

  const createElementOptions = (elements: MetamorphElementsRecord): string => {
    return Object.keys(elements)
      .map((key) => `<option value='${key}'>${elements[key].label}</option>`)
      .join('')
  }

  return {
    createForm,
    resetElementOptionsTree,
    setHtm,
    getTransformation,
  }
}
