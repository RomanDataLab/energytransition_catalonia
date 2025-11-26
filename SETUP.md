# EE Cities Dashboard Setup

## Quick Start

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Ensure GeoJSON files are in place**:
   - Files should be in `public/municipalities/`:
     - `begur_labeled.geojson`
     - `begur_e.geojson`
     - `gava_labeled.geojson`
     - `gava_e.geojson`
     - `mataro_labeled.geojson`
     - `mataro_e.geojson`
     - `olot_labeled.geojson`
     - `olot_e.geojson`

3. **Start the development server**:
```bash
npm start
```

The dashboard will open automatically at http://localhost:3000

## Features

### Desktop/Tablet Layout
- **Right Panel (10% width)**: Legend and controls
- **Main Area (90% width)**: 2x2 grid of city maps

### Smartphone Layout
- **Upper Section**: Legend and controls (horizontal layout)
- **Lower Section**: 4 maps stacked vertically

### Controls
- **Toggle Default e-labels**: Show/hide `{cityname}_labeled.geojson`
- **Toggle Updated e-labels**: Show/hide `{cityname}_e.geojson`
- **City Selection**: Click city buttons to select and view statistics

### Statistics Charts
When a city is selected, the legend panel shows:
1. **Buildings by Energy Label**: Bar chart with count and percentage
2. **Area by Energy Label**: Bar chart with m² and percentage
3. **Difference Chart**: Shows changes between default and updated labels

### Map Features
- Dark OSM map style (CartoDB Dark Matter)
- Zoom with mouse wheel (no zoom controls shown)
- Click on map to select city
- Energy labels color-coded:
  - A: Green (#00ff00)
  - B: Light Green (#80ff00)
  - C: Yellow (#ffff00)
  - D: Orange (#ff8000)
  - E: Red-Orange (#ff4000)
  - F: Red (#ff0000)
  - G: Dark Red (#800000)

## Troubleshooting

If maps don't show:
1. Check browser console for errors
2. Verify GeoJSON files are in `public/municipalities/`
3. Check that coordinates are being transformed correctly (UTM to WGS84)

If statistics don't update:
1. Select a city by clicking on its map
2. Check browser console for data loading errors

