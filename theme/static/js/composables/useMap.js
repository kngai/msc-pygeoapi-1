import * as L from 'https://unpkg.com/leaflet@1.7.1/dist/leaflet-src.esm.js'
import { ref, watch, onMounted } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.5/vue.esm-browser.js'

var map, GEOJSON_DATA, layerItems

export default function useMap(mapElemId, geoJsonData, itemsPath, tileLayerUrl, tileLayerAttr) {
  const setupMap = function() {
    map = L.map(mapElemId).setView([45, -75], 5)
    map.addLayer(new L.TileLayer(
        tileLayerUrl, {
          maxZoom: 18,
          attribution: tileLayerAttr
        }
    ))
    layerItems = new L.GeoJSON({type: 'FeatureCollection', features: []})
    map.addLayer(layerItems)
  }

  onMounted(setupMap)
  watch(geoJsonData, () => {
    if (map.hasLayer(layerItems)) {
      map.removeLayer(layerItems)
    }
    layerItems = new L.GeoJSON(geoJsonData.value, {
      onEachFeature: function (feature, layer) {
        let url = itemsPath + '/' + feature.id + '?f=html'
        let html = '<span><a href="' + url + '">' + feature.id + '</a></span>'
        layer.bindPopup(html)
      }
    })
    map.addLayer(layerItems)
    map.fitBounds(layerItems.getBounds())
    if (map.getZoom() > 5) { // minimum zoom level
      map.setZoom(5)
    }
  })

  return {
    setupMap
  }
}