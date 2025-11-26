import React from 'react';
import './MapGrid.css';
import CityMap from './CityMap';

const MapGrid = ({ cities, geoJSONData, selectedCity, onCitySelect, onCityHover }) => {
  return (
    <div className="map-grid">
      {cities.map(city => (
        <div 
          key={city} 
          className={`map-container ${selectedCity === city ? 'selected' : ''}`}
          onClick={() => onCitySelect && onCitySelect(city)}
          onMouseEnter={() => onCityHover && onCityHover(city)}
        >
          <div className="map-title">{city.toUpperCase()}</div>
          <CityMap
            city={city}
            geoJSONData={geoJSONData[city]}
          />
        </div>
      ))}
    </div>
  );
};

export default MapGrid;

