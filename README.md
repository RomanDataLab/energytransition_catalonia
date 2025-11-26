# Energy Transition Catalonia - Dashboard

Interactive web dashboard for visualizing energy efficiency labels across 4 cities in Catalonia (Begur, Gava, Mataró, Olot).

## Features

- **4 City Maps** in cross-like grid layout (2x2 on desktop/tablet, stacked on mobile)
- **Dark OSM Map Style** using CartoDB Dark Matter tiles
- **Mouse Wheel Zoom** (zoom controls hidden)
- **Interactive Legend Panel** (10% width on desktop, top on mobile)
- **Energy Label Statistics** with horizontal bar charts
- **Building Hover Tooltips** showing energy label and area
- **Methodology Popup** with detailed calculation explanation

## Data Sources

- Building data: Spanish Cadastre INSPIRE services ([catastro.hacienda.gob.es](https://www.catastro.hacienda.gob.es/webinspire/index.html))
- Energy certificates: Generalitat de Catalunya open data portal ([transparenciacatalunya.cat](https://analisi.transparenciacatalunya.cat/Energia/Certificats-d-efici-ncia-energ-tica-d-edificis/j6ii-t3w2/about_data))

## Installation

```bash
npm install
```

## Development

```bash
npm start
```

Opens at http://localhost:3000

## Build for Production

```bash
npm run build
```

## Deployment

This project is configured for Vercel deployment. Simply connect your GitHub repository to Vercel and it will automatically build and deploy.

## Project Structure

```
react-dashboard/
├── public/
│   ├── municipalities/     # GeoJSON files (_e.geojson)
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CityMap.js      # Individual city map component
│   │   ├── MapGrid.js      # 2x2 grid of maps
│   │   └── LegendPanel.js  # Right panel with statistics
│   ├── utils/
│   │   └── geoJSONLoader.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Technologies

- React 18
- Leaflet (mapping)
- Chart.js (charts)
- proj4 (coordinate transformation)

## License

See repository for license information.
