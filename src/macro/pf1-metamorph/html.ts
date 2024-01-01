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
  setupRootSelectHtmlElement: () => void
}

export const createHtmlController = (): HTMLController => {
  let masterSelectedKeyArray: Array<string | undefined> = []
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
      <span id='metamorph-root-element-container'>
        <div class='form-group'>
          <select>${createElementOptions(rootElements)}</select>
        </div>
        <div id='metamorph-root-element-description' class='form-group'>
        </div>
      </span>
      <span id='metamorph-children-elements-container'></span>
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

  const selectOnChange = (event: Event, depth: number) => {
    const htmlElement = event.target as HTMLSelectElement | null
    if (htmlElement === null) {
      throw new Error('Changed HTML element is invalid')
    }

    logger.debug('Change event triggered, obtained HTML element from event', {
      htmlElement,
      depth,
    })

    const value = htmlElement.value

    overrideMasterSelectedKeyArray(depth, value)
    resetElementOptionsTree()
  }

  const setupRootSelectHtmlElement = (): void => {
    logger.debug('Setup Root Select HTML Element')

    const metamorphRootSelectElement = getDefinedHtm()
      .find('#metamorph-root-element-container')
      .find('select')[0]

    if (metamorphRootSelectElement === undefined) {
      throw new Error('Could not find Root Select HTML Element')
    }

    metamorphRootSelectElement.value = createElementKey(rootElements, 0)
    metamorphRootSelectElement.addEventListener('change', (event) => {
      selectOnChange(event, 0)
    })
  }

  const setupSelectHTMLElements = () => {
    logger.debug('Setup Select HTML Elements')

    const metamorphSelectElements = getDefinedHtm()
      .find('#metamorph-children-elements-container')
      .find('select')

    logger.debug('Found metamorph select elements select', {
      metamorphSelectElements,
    })

    const firstKey = createElementKey(rootElements, 0)

    const firstElement = rootElements[firstKey]
    if (firstElement.type !== 'group') {
      logger.debug('First element is not a group, no need to continue', {
        firstElement,
        firstKey,
      })
      return
    }

    let depth = 1
    let elementRecord = firstElement.elementChildren

    for (const htmlSelectElement of metamorphSelectElements) {
      logger.debug('Iterating through a metamorph HTML select element found', {
        depth,
        elementRecord,
        htmlSelectElement,
      })

      const currentDepth = depth

      const key = createElementKey(elementRecord, depth)
      const newElement = elementRecord[key]

      htmlSelectElement.value = key
      htmlSelectElement.addEventListener('change', (event) => {
        selectOnChange(event, currentDepth)
      })

      if (newElement.type === 'group') {
        elementRecord = newElement.elementChildren
      }

      depth++
    }
  }

  const getTransformation = (): MetamorphElementTransformation => {
    const getTransformationIteration = (
      element: MetamorphElement | undefined,
      depth: number,
    ): MetamorphElementTransformation => {
      logger.debug('Get transformation iteration', {
        element,
        depth,
      })

      if (element === undefined) {
        throw new Error(
          'Could not iterate through transformation, element undefined',
        )
      }

      if (element.type === 'group') {
        const currentKey = createElementKey(element.elementChildren, depth)

        return getTransformationIteration(
          element.elementChildren[currentKey],
          depth + 1,
        )
      }

      return element
    }

    const firstKey = createElementKey(rootElements, 0)

    // Depth is 1 because root element first key is already being used.
    return getTransformationIteration(rootElements[firstKey], 1)
  }

  const setMasterSelectedKeyArray = (value: Array<string | undefined>) => {
    masterSelectedKeyArray = value
  }

  const overrideMasterSelectedKeyArray = (depth: number, value: string) => {
    logger.debug('Override master selected key array', {
      masterSelectedKeyArray,
      depth,
      value,
    })

    // Iteration is deeper than selected key array length, so undefined keys will be added
    if (masterSelectedKeyArray.length <= depth) {
      const tempSelectedKeyArray = [...masterSelectedKeyArray]

      while (tempSelectedKeyArray.length <= depth) {
        tempSelectedKeyArray.push(undefined)
      }

      setMasterSelectedKeyArray(tempSelectedKeyArray)
    }

    setMasterSelectedKeyArray([
      ...masterSelectedKeyArray.slice(0, depth),
      value,
    ])

    logger.debug('Master selected key array override', {
      masterSelectedKeyArray,
    })
  }

  const resetElementOptionsTree = (): void => {
    logger.debug('Reset element options tree')

    const firstKey = createElementKey(rootElements, 0)

    const firstElement = rootElements[firstKey]
    if (firstElement === undefined) {
      throw new Error(
        'Cannot reset element options tree, could not get first element',
      )
    }

    const optionsTree = createElementOptionsTree(
      firstElement,
      `metamorph-children-elements-container-${firstKey}`,
      1,
    )

    editInnerHtml(
      getDefinedHtm(),
      '#metamorph-children-elements-container',
      optionsTree,
    )
    setupSelectHTMLElements()
  }

  /*
   * Create an element key according to an element record and a key array.
   * If key array is not empty, get its first element.
   * Otherwise, get element record first key.
   */
  const createElementKey = (
    elementRecord: MetamorphElementsRecord,
    depth: number,
  ): string => {
    logger.debug('Create element key', {
      elementRecord,
      masterSelectedKeyArray,
      depth,
    })

    if (Object.keys(elementRecord).length === 0) {
      throw new Error('Could not create element key, elementRecord is empty')
    }

    const key = masterSelectedKeyArray[depth]

    logger.debug(`Obtained key "${key}" from selected key array`)

    if (key === undefined) {
      const firstElementRecordKey = Object.keys(elementRecord)[0]
      logger.debug(
        `Key is undefined, use first elementRecord element ${firstElementRecordKey} instead`,
      )
      return firstElementRecordKey
    }

    return key
  }

  const createElementOptionsTree = (
    element: MetamorphElement,
    parentHtmlId: string,
    depth: number,
  ): string => {
    logger.debug('Creating options tree : new iteration', {
      element,
    })

    if (element.type === 'group') {
      const currentKey = createElementKey(element.elementChildren, depth)

      const newElement = element.elementChildren[currentKey]
      if (newElement === undefined) {
        throw new Error(
          'Creation options tree iteration failed, at least one key is invalid',
        )
      }

      const currentHtmlId = `${parentHtmlId}:${currentKey}`

      return (
        createElementFormGroup(
          element.elementChildren,
          currentHtmlId,
          element.description,
        ) +
        createElementOptionsTree(
          element.elementChildren[currentKey],
          currentHtmlId,
          depth + 1,
        )
      )
    }

    return createDescription(element.description)
  }

  const createElementFormGroup = (
    elementChildren: MetamorphElementsRecord,
    htmlId: string,
    parentDescription?: string,
  ): string => `
  <div class="form-group">
    <select id="${htmlId}">${createElementOptions(elementChildren)}</select>
  </div>
  <div class="metamorph-root-element-container-description form-group">
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
    setupRootSelectHtmlElement,
  }
}
