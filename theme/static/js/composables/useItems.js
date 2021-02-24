import { ref, computed, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.esm-browser.js'

export default function useItems() {
  const itemsJson = ref({})
  const items = computed(() => {
    if (Object.prototype.hasOwnProperty.call(itemsJson.value, 'features')) {
      return itemsJson.value.features
    } else {
      return []
    }
  })
  const itemProps = computed(() => {
    if (items.value.length > 0) {
      return Object.keys(items.value[0].properties)
    } else {
      return []
    }
  })
  const getItems = async () => {
    try {
      const resp = await axios.get('?f=json') // relative to /items
      itemsJson.value = resp.data
    } catch (err) {
      console.error(err)
    }
  }
  
  onMounted(getItems)

  return {
    itemsJson,
    items,
    itemProps,
    getItems
  }
}