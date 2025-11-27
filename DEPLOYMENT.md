# Deployment Guide

## Vercel Deployment

This project is configured for automatic deployment on Vercel.

### Setup Steps

1. **Connect Repository to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import the GitHub repository: `RomanDataLab/energytransition_catalonia`
   - Vercel will automatically detect it's a React app

2. **Build Settings** (auto-detected):
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

3. **Environment Variables** (if needed):
   - None required for this project

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your site will be live at `https://energytransition-catalonia.vercel.app` (or custom domain)

### Manual Deployment

If you need to deploy manually:

```bash
npm install
npm run build
# Upload the 'build' folder to your hosting service
```

## Repository Structure

The repository contains only the essential files for the web dashboard:

- `/src` - React source code
- `/public` - Static assets and GeoJSON files (`*_e.geojson` only)
- `/package.json` - Dependencies and scripts
- `/vercel.json` - Vercel configuration
- `/.gitignore` - Excludes node_modules, build files, and unnecessary data files

## Excluded Files

The following are excluded from the repository:
- `node_modules/` - Dependencies (installed via npm)
- `build/` - Build output
- `*_labeled.geojson` - Source files (only `*_e.geojson` are included)
- `*.csv` - Source CSV files
- Python scripts and other non-web files

## Data Files

Only the processed `*_e.geojson` files are included in the repository:
- `begur_e.geojson`
- `gava_e.geojson`
- `mataro_e.geojson`
- `olot_e.geojson`

These files contain the energy labels and building geometries needed for the dashboard.

