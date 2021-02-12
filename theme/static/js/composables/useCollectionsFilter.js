import { ref, computed } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.esm-browser.prod.js'

export default function useCollectionsFilter(collections, keyColumns) {
  // sort and filtering
  const searchText = ref('')
  const searchTextLowered = computed(() => { 
    return searchText.value.toLowerCase()
  })
  const currentSortDir = ref('asc')
  const currentSort = ref('title') // default to first column

  // change sort direction
  const sortDir = function(s) {
    // if s == current sort, reverse
    if (s === currentSort.value) {
      currentSortDir.value = currentSortDir.value === 'asc' ? 'desc' : 'asc'
    }
    currentSort.value = s
  }

  // change sort icon
  const sortIconClass = computed(() => {
    if (currentSortDir.value === 'asc') {
      return 'glyphicon-sort-by-attributes'
    } else {
      return 'glyphicon-sort-by-attributes-alt'
    }
  })
  
  // sort function for collections
  const sortCollections = function(a, b) {
    let modifier = 1
    if (currentSortDir.value === 'desc') {
      modifier = -1
    }
    if (a[currentSort.value] < b[currentSort.value]) {
      return -1 * modifier
    }
    if (a[currentSort.value] > b[currentSort.value]) {
      return 1 * modifier
    }
    return 0
  }

  

  // filter function for collections
  const searchFilter = function(row) {
    if (searchText.value !== '') {
      let rowText = ''

      // concatenate all properties to a single text for ease of search
      Object.keys(row).forEach((key) => {
        if (!keyColumns.value.includes(key)) {
          return false
        } else if (row[key] === null) {
          return false // skip null values
        } else {
          const valueText = row[key] + '' // ensure to string
          rowText += '^' + valueText.toLowerCase() + '$' // starts with and ends search helper; like regex
        }
      })

      if (rowText.includes(searchTextLowered.value)) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  }

  const filteredCollections = computed(() => {
    return collections.value
      .filter(searchFilter)
      .sort(sortCollections)
  })

  return {
    filteredCollections, searchText, searchTextLowered,
    currentSortDir, currentSort, sortDir, sortIconClass
  }
}