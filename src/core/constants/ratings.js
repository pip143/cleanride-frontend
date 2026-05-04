export const RATINGS = {
  1: { value: 1, label: '1 Star', emoji: '⭐' },
  2: { value: 2, label: '2 Stars', emoji: '⭐⭐' },
  3: { value: 3, label: '3 Stars', emoji: '⭐⭐⭐' },
  4: { value: 4, label: '4 Stars', emoji: '⭐⭐⭐⭐' },
  5: { value: 5, label: '5 Stars', emoji: '⭐⭐⭐⭐⭐' },
}

export const RATING_OPTIONS = [
  { value: 1, label: 'Poor' },
  { value: 2, label: 'Fair' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Very Good' },
  { value: 5, label: 'Excellent' },
]

export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'green'
  if (rating >= 3.5) return 'blue'
  if (rating >= 2.5) return 'yellow'
  return 'red'
}
