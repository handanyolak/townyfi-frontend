import * as yup from 'yup'
import {
  getAddressRule,
  getUintRule,
  getCoordinateRule,
} from '~/composables/useYupRules'

export const idValidationSchema = yup.object({
  ID: getUintRule({ required: true }),
})

export const addressValidationSchema = yup.object({
  Address: getAddressRule({ required: true }),
})

export const coordinateValidationSchema = yup.object({
  Coordinate: getCoordinateRule({ required: true }),
})
