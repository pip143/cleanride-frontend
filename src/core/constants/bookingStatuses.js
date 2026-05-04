export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
}

export const BOOKING_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'blue' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
  { value: 'COMPLETED', label: 'Completed', color: 'green' },
]

export const getStatusColor = (status) => {
  const statusOption = BOOKING_STATUS_OPTIONS.find((s) => s.value === status)
  return statusOption?.color || 'gray'
}

export const getStatusLabel = (status) => {
  const statusOption = BOOKING_STATUS_OPTIONS.find((s) => s.value === status)
  return statusOption?.label || status
}
