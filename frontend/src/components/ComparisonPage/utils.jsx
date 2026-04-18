export const scorePhone = (phone) => {
  const gaming = phone?.scores?.gaming || 0
  const camera = phone?.scores?.camera || 0
  const battery = phone?.scores?.battery || 0
  const value = phone?.scores?.valueForMoney || 0
  return gaming * 0.28 + camera * 0.24 + battery * 0.24 + value * 0.24
}

export const formatPrice = (price) => {
  if (!price) return 'N/A'
  return `INR ${(price / 1000).toFixed(0)}K`
}

export const getBestPhoneId = (selectedPhones, row) => {
  if (selectedPhones.length < 2) return null
  
  if (row.better === 'higher' && row.scoreKey) {
    return selectedPhones.reduce((best, phone) => {
      const bestScore = best?.scores?.[row.scoreKey] || 0
      const currentScore = phone?.scores?.[row.scoreKey] || 0
      return currentScore > bestScore ? phone : best
    }, selectedPhones[0])._id
  }

  if (row.better === 'lower' && row.label === 'Price') {
    return selectedPhones.reduce((best, phone) => {
      const bestPrice = best?.basePrice || Number.MAX_SAFE_INTEGER
      const currentPrice = phone?.basePrice || Number.MAX_SAFE_INTEGER
      return currentPrice < bestPrice ? phone : best
    }, selectedPhones[0])._id
  }

  return null
}
