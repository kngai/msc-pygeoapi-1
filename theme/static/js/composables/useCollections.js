import { ref, computed, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.esm-browser.js'

export default function useCollections() {
  const collectionsJson = ref({})
  const collections = computed(() => {
    if (Object.prototype.hasOwnProperty.call(collectionsJson.value, 'collections')) {
      return collectionsJson.value.collections
    } else {
      return []
    }
  })
  const getCollections = async () => {
    try {
      const resp = await axios.get('/collections?f=json')
      collectionsJson.value = resp.data
    } catch (err) {
      console.error(err)
    }
  }
  
  onMounted(getCollections)

  return {
    collections,
    collectionsJson,
    getCollections
  }
}