import { computed } from 'vue'

export const useROCDate = (dateRef) => {
  const rocDate = computed(() => {
    if (!dateRef.value?.value) return ''

    const date = new Date(dateRef.value.value)
    const rocYear = date.getFullYear() - 1911
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `民國 ${rocYear}/${month}/${day}`
  })

  // 轉換單一日期字串的工具函數
  const convertToROCDate = (dateString) => {
    if (!dateString) return ''

    const date = new Date(dateString)
    const rocYear = date.getFullYear() - 1911
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `民國 ${rocYear}/${month}/${day}`
  }

  // 轉換日期範圍的工具函數
  const convertDateRangeToROC = (dateRange) => {
    if (!dateRange || !Array.isArray(dateRange) || dateRange.length === 0) return ''

    const formattedDates = dateRange.map(date => {
      if (!date) return ''
      const d = new Date(date)
      const rocYear = d.getFullYear() - 1911
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${rocYear}/${month}/${day}`
    })

    return formattedDates.join(' ~ ')
  }

  return {
    rocDate,
    convertToROCDate,
    convertDateRangeToROC
  }
}
