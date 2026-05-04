export const PAYMENT_METHODS = {
  CASH: 'CASH',
  GCASH: 'GCASH',
  CARD: 'CARD',
}

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', label: 'Cash', icon: '💵' },
  { value: 'GCASH', label: 'GCash', icon: '📱' },
  { value: 'CARD', label: 'Credit/Debit Card', icon: '💳' },
]

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
}
