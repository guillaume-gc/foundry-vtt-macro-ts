export const editInnerHtml = (htm: JQuery, selector: string, value: string) => {
  const element = htm.find(selector)?.[0]

  if (element == null) {
    console.error(`Could not find element "${selector}"`)
    throw new Error()
  }

  element.innerHTML = value
}

export const getSelectElement = (
  htm: JQuery,
  selector: string,
): HTMLSelectElement => {
  const element = htm.find(selector)?.[0]
  if (element == null) {
    throw new Error(`Could not find element "${selector}"`)
  }

  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Element ${selector} is not a HTML select element`)
  }

  return element
}

export const getSelectElementValue = (
  htm: JQuery,
  selector: string,
): string => {
  const element = getSelectElement(htm, selector)

  return element.value
}

export const getInputElement = (
  htm: JQuery,
  selector: string,
): HTMLInputElement => {
  const element = htm.find(selector)?.[0]
  if (element == null) {
    throw new Error(`Could not find element "${selector}"`)
  }

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Element ${selector} is not a HTML input element`)
  }

  return element
}
