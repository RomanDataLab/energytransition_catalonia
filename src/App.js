import React, { useState, useEffect } from 'react';
import './App.css';
import MapGrid from './components/MapGrid';
import LegendPanel from './components/LegendPanel';
import { loadGeoJSONData } from './utils/geoJSONLoader';

function App() {
  const [geoJSONData, setGeoJSONData] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = ['begur', 'gava', 'mataro', 'olot'];

  useEffect(() => {
    // Load only _e GeoJSON files
    const loadData = async () => {
      const data = {};
      for (const city of cities) {
        try {
          console.log(`Loading ${city}_e.geojson...`);
          const eData = await loadGeoJSONData(`/municipalities/${city}_e.geojson`);
          console.log(`${city}: Loaded ${eData?.features?.length || 0} features`);
          data[city] = { e: eData };
        } catch (error) {
          console.error(`Error loading data for ${city}:`, error);
        }
      }
      console.log('All data loaded:', Object.keys(data));
      setGeoJSONData(data);
    };
    loadData();
  }, []);

  return (
    <div className="app">
      <MapGrid
        cities={cities}
        geoJSONData={geoJSONData}
        selectedCity={selectedCity}
        onCitySelect={setSelectedCity}
        onCityHover={setSelectedCity}
      />
      <LegendPanel
        selectedCity={selectedCity}
        geoJSONData={geoJSONData}
      />
    </div>
  );
}

export default App;

