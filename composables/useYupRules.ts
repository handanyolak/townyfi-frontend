import { number, string } from 'yup'
import { RuleOptions } from '~/types'

export const getUintRule = (options?: RuleOptions) => {
  let rule = number()
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

export const getAddressRule = (options?: RuleOptions) => {
  let rule = string().ethereumAddress()

  if (options?.required) {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  return rule
}

export const getBytes32Rule = (options?: RuleOptions) => {
  let rule = string().bytes32()

  if (options?.required) {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  return rule
}

export const getCoordinateRule = (options?: RuleOptions) => {
  let rule = string().coordinate()

  if (options?.required) {
    rule = rule.required()
  } else {
    rule = rule.optional()
  }

  return rule
}
