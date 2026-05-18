export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
}

export const ROLE_OPTIONS = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'STAFF', label: 'Service Provider' },
]

export function normalizeRole(role) {
  if (role === 'PROVIDER') return ROLES.STAFF
  if (role === ROLES.ADMIN) return ROLES.ADMIN
  if (role === ROLES.STAFF) return ROLES.STAFF
  return ROLES.CUSTOMER
}

export function isProviderRole(role) {
  const normalized = normalizeRole(role)
  return normalized === ROLES.STAFF || normalized === ROLES.ADMIN
}
