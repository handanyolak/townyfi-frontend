import { toUtf8Bytes } from 'ethers'
import * as yup from 'yup'

export default defineNuxtPlugin(() => {
  yup.addMethod<yup.StringSchema>(
    yup.string,
    'bytes32',
    function (message = 'string must be less than 32 bytes') {
      return this.test('bytes32', message, (value) => {
        const bytes = toUtf8Bytes(value)

        return !(bytes.length > 31)
      })
    }
  )
})
