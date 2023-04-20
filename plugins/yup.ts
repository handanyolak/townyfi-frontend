import { toUtf8Bytes, isAddress } from 'ethers'
import { addMethod, string, StringSchema } from 'yup'

export default defineNuxtPlugin(() => {
  const connectionStore = useConnectionStore()
  const { getKta } = storeToRefs(connectionStore)

  addMethod<StringSchema<string>>(
    string,
    'bytes32',
    function (message = 'string must be less than 32 bytes') {
      return this.test('bytes32', message, (value) => {
        const bytes = toUtf8Bytes(value)

        return !(bytes.length > 31)
      })
    }
  )

  addMethod<StringSchema<string>>(
    string,
    'ethereumAddress',
    function (message = 'this field must be an ethereum address') {
      return this.test('ethereumAddress', message, (value) => {
        return isAddress(value)
      })
    }
  )

  addMethod(string, 'townyIsRegistered', function () {
    return this.test(async (value, context) => {
      try {
        return await getKta.value.isRegistered(value as string)
      } catch (error: any) {
        return context.createError({
          message: 'this field must be an TownyFi player',
        })
      }
    })
  })
})
