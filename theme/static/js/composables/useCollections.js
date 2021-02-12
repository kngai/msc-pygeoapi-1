import { ref, onMounted, watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.esm-browser.prod.js'

export default function useCollections() {
  const collections = ref([])
  const getCollections = async () => {
    try {
      const resp = await axios.get('/collections?f=json')
      collections.value = resp.data.collections
    } catch (err) {
      console.error(err)
    }
  }
  
  onMounted(getCollections)

  return {
    collections,
    getCollections
  }
}