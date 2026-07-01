import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CityMap.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// City center coordinates (approximate centers in WGS84)
const cityCenters = {
  begur: [41.95, 3.21],
  gava: [41.30, 2.00],
  mataro: [41.54, 2.44],
  olot: [42.18, 2.49]
};

const CityMap = ({ city, geoJSONData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerRef = useRef(null);

  // Color scheme for energy labels
  const labelColors = {
    'A': '#00ff00',
    'B': '#80ff00',
    'C': '#ffff00',
    'D': '#ff8000',
    'E': '#ff4000',
    'F': '#ff0000',
    'G': '#800000'
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with dark OSM style
    const map = L.map(mapRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: false,
      // Canvas renderer draws thousands of building polygons far more cheaply
      // than the default SVG renderer (one <path> per building in the DOM).
      preferCanvas: true
    });

    // Dark OSM tile layer using CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    // Set initial view to city center at zoom 15
    const center = cityCenters[city] || [41.95, 3.2];
    map.setView(center, 15);
    
    // Invalidate size after initial setup
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      // Clean up on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            return;
          }
          mapInstanceRef.current.removeLayer(layer);
        });
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      layerRef.current = null;
    };
  }, [city]);

  useEffect(() => {
    if (!mapInstanceRef.current || !geoJSONData || !geoJSONData.e) {
      console.log(`CityMap ${city}: Missing data`, { 
        hasMap: !!mapInstanceRef.current, 
        hasGeoJSONData: !!geoJSONData, 
        hasE: !!(geoJSONData && geoJSONData.e) 
      });
      return;
    }

    const map = mapInstanceRef.current;
    console.log(`CityMap ${city}: Loading buildings...`, {
      featureCount: geoJSONData.e?.features?.length || 0
    });

    // Remove all existing layers first
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        return; // Keep tile layers
      }
      map.removeLayer(layer);
    });

    // Clear layer reference
    layerRef.current = null;

    // Data is already in WGS84 (reprojected offline) — feed it straight to Leaflet.
    const geo = geoJSONData.e;
    if (!geo || !geo.features || geo.features.length === 0) {
      console.error(`CityMap ${city}: No features to render`);
      return;
    }

    console.log(`CityMap ${city}: Adding ${geo.features.length} features to map`);

    const eLayer = L.geoJSON(geo, {
      style: (feature) => {
        const label = feature.properties?.energy_label;
        return {
          fillColor: labelColors[label] || '#666666',
          fillOpacity: 0.7,
          color: '#ffffff',
          weight: 1,
          opacity: 0.5
        };
      },
      onEachFeature: (feature, layer) => {
        // Add hover tooltip
        const label = feature.properties?.energy_label || 'N/A';
        const value = feature.properties?.value || 0;
        const tooltipText = `${label} / ${value} m²`;
        
        layer.bindTooltip(tooltipText, {
          permanent: false,
          direction: 'top',
          offset: [0, -10],
          className: 'building-tooltip'
        });
      }
    });
    
    eLayer.addTo(map);
    layerRef.current = eLayer;

    // Invalidate size first to ensure map container is properly sized
    map.invalidateSize();

    // Use setTimeout to ensure map is fully rendered before setting view
    setTimeout(() => {
      try {
        // Always set to city center at zoom 15 (don't fit bounds to avoid zooming out)
        const center = cityCenters[city] || [41.95, 3.2];
        map.setView(center, 15);
        console.log(`CityMap ${city}: Set to center at zoom 15`, center);
        
        // Force a refresh to ensure buildings are visible
        map.invalidateSize();
        
        // Trigger a small pan to force re-render
        map.panBy([0, 0]);
        
        // Invalidate size again after a short delay
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } catch (error) {
        console.error(`CityMap ${city}: Error setting view`, error);
        const center = cityCenters[city] || [41.95, 3.2];
        map.setView(center, 15);
        map.invalidateSize();
      }
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoJSONData, city]);

  return <div ref={mapRef} className="city-map" />;
};

export default CityMap;

