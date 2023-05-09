import * as yup from 'yup'

export const getUintRule = (options?: AddressRuleOptions) => {
  let rule = yup
    .number()
    .typeError('this must be a `number` type')
    // .transform((value, originalValue) => {
    //   return originalValue === '' ? 0 : value
    // })
    .integer()
    .min(0)

  if (options?.required) {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  return rule
}

export const getAddressRule = (options?: AddressRuleOptions) => {
  let rule = yup.string().ethereumAddress()

  if (options?.required) {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  return rule
}

export const getCoordinateRule = (options?: AddressRuleOptions) => {
  let rule = yup.string().coordinate()

  if (options?.required) {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  return rule
}

// TODO: move to types
interface AddressRuleOptions {
  required?: boolean
}
