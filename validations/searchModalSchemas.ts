import { object } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import {
  getAddressRule,
  getUintRule,
  getCoordinateRule,
} from '~/composables/useYupRules'

export const idValidationSchema = useForm({
  validationSchema: toTypedSchema(
    object({
      ID: getUintRule({ required: true }),
    }),
  ),
})

export const addressValidationSchema = useForm({
  validationSchema: toTypedSchema(
    object({
      Address: getAddressRule({ required: true }),
    }),
  ),
})

export const coordinateValidationSchema = useForm({
  validationSchema: toTypedSchema(
    object({
      Coordinate: getCoordinateRule({ required: true }),
    }),
  ),
})
