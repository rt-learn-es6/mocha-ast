export const last = (array) => array[array.length - 1]

export const contains = (array, element) => array.indexOf(element) > -1

export const clone = (array) => JSON.parse(JSON.stringify(array))
