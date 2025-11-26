export const calculateStatistics = (labeledData, updatedData, cityName) => {
  if (!labeledData || !updatedData) {
    return null;
  }

  const stats = {
    buildings: {},
    area: {},
    differences: {},
    totalBuildings: 0,
    totalArea: 0
  };

  // Calculate statistics for updated data (current selection)
  const features = updatedData.features || [];
  
  features.forEach(feature => {
    const label = feature.properties?.energy_label;
    const area = feature.properties?.value || 0; // Assuming 'value' is area in m²

    if (label) {
      if (!stats.buildings[label]) {
        stats.buildings[label] = 0;
        stats.area[label] = 0;
      }
      stats.buildings[label]++;
      stats.area[label] += area;
      stats.totalBuildings++;
      stats.totalArea += area;
    }
  });

  // Calculate differences between updated and labeled
  const labeledBuildings = {};
  const labeledFeatures = labeledData.features || [];
  
  labeledFeatures.forEach(feature => {
    const label = feature.properties?.energy_label;
    if (label) {
      labeledBuildings[label] = (labeledBuildings[label] || 0) + 1;
    }
  });

  // Calculate differences
  const allLabels = new Set([
    ...Object.keys(stats.buildings),
    ...Object.keys(labeledBuildings)
  ]);

  allLabels.forEach(label => {
    const updated = stats.buildings[label] || 0;
    const labeled = labeledBuildings[label] || 0;
    stats.differences[label] = updated - labeled;
  });

  return stats;
};

