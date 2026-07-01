import React, { useState, useEffect } from 'react';
import './App.css';
import MapGrid from './components/MapGrid';
import LegendPanel from './components/LegendPanel';
import { loadGeoJSONData } from './utils/geoJSONLoader';

function App() {
  const [geoJSONData, setGeoJSONData] = useState({});
  const [hoveredCity, setHoveredCity] = useState(null);
  const [clickedCity, setClickedCity] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({});
  const cities = ['begur', 'gava', 'mataro', 'olot'];

  useEffect(() => {
    // Load pre-reprojected (WGS84) GeoJSON files. Each city is published to
    // state as soon as it arrives so its map paints progressively instead of
    // waiting for the whole set.
    const loadData = async () => {
      for (const city of cities) {
        try {
          console.log(`Loading ${city}.geojson...`);
          setLoadingStatus(prev => ({ ...prev, [city]: 'loading' }));

          // Use process.env.PUBLIC_URL if available, otherwise use relative path
          const baseUrl = process.env.PUBLIC_URL || '';
          const url = `${baseUrl}/municipalities/${city}.geojson`;

          console.log(`Fetching from: ${url}`);
          const eData = await loadGeoJSONData(url);

          if (eData && eData.features) {
            console.log(`${city}: Loaded ${eData.features.length} features`);
            setGeoJSONData(prev => ({ ...prev, [city]: { e: eData } }));
            setLoadingStatus(prev => ({ ...prev, [city]: 'success' }));
          } else {
            throw new Error(`Invalid data structure for ${city}`);
          }
        } catch (error) {
          console.error(`Error loading data for ${city}:`, error);
          setLoadingStatus(prev => ({ ...prev, [city]: 'error' }));
        }
      }
      console.log('All data loaded');
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCityClick = (city) => {
    setClickedCity(city);
    setHoveredCity(null); // Clear hover when a city is clicked
  };

  const selectedCityForLegend = clickedCity || hoveredCity;

  return (
    <div className="app">
      <MapGrid
        cities={cities}
        geoJSONData={geoJSONData}
        onCityHover={setHoveredCity}
        onCityClick={handleCityClick}
        selectedCity={selectedCityForLegend}
      />
      <LegendPanel
        selectedCity={selectedCityForLegend}
        geoJSONData={geoJSONData}
        loadingStatus={loadingStatus}
      />
    </div>
  );
}

export default App;

