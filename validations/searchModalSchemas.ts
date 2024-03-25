import { object } from 'yup'
import {
  getAddressRule,
  getUintRule,
  getCoordinateRule,
} from '~/composables/useYupRules'

export const idValidationSchema = object({
  ID: getUintRule({ required: true }),
})

export const addressValidationSchema = object({
  Address: getAddressRule({ required: true }),
})

export const coordinateValidationSchema = object({
  Coordinate: getCoordinateRule({ required: true }),
})
