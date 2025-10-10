import { parsePhoneNumberFromString } from 'libphonenumber-js'

export function formatPhone(phone) {
  if (!phone) return ''
  try {
    const number = parsePhoneNumberFromString(phone)
    return number ? number.formatInternational() : phone
  } catch {
    return phone
  }
}
