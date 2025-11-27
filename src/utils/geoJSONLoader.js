export const loadGeoJSONData = async (url) => {
  try {
    console.log(`Fetching GeoJSON from: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/geo+json, application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText.substring(0, 200)}`);
      throw new Error(`HTTP error! status: ${response.status}, url: ${url}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log(`Response content-type: ${contentType}`);
    
    const data = await response.json();
    
    if (!data || !data.features) {
      console.warn(`Invalid GeoJSON structure: missing features array`);
    } else {
      console.log(`Successfully loaded ${data.features.length} features`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error loading GeoJSON from ${url}:`, error);
    throw error;
  }
};

