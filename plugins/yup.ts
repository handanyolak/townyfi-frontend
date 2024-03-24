import { toUtf8Bytes, isAddress } from 'ethers'
import { zeroAddress, type Address } from 'viem'
import { addMethod, string, StringSchema } from 'yup'

export default defineNuxtPlugin(() => {
  const contractStore = useContractStore()
  const { getKta } = storeToRefs(contractStore)

  addMethod<StringSchema<string>>(
    string,
    'bytes32',
    function (message = 'string must be less than 32 bytes') {
      return this.test('bytes32', message, (value) => {
        const bytes = toUtf8Bytes(value)

        return !(bytes.length > 31)
      })
    },
  )

  addMethod<StringSchema<string>>(
    string,
    'ethereumAddress',
    function (message = 'this field must be an ethereum address') {
      return this.test('ethereumAddress', message, (value) => {
        return isAddress(value)
      })
    },
  )

  addMethod<StringSchema<string>>(
    string,
    'coordinate',
    function (message = 'this field must be a coordinate') {
      return this.test('coordinate', message, (value) => {
        return /^-?\d+,-?\d+$/.test(value)
      })
    },
  )

  addMethod(string, 'townyIsRegistered', function () {
    return this.test(async (value, context) => {
      try {
        return await getKta.value.read.isRegistered([
          (value as Address) || zeroAddress,
        ])
      } catch (error: any) {
        return context.createError({
          message: 'this field must be an TownyFi player',
        })
      }
    })
  })
})
