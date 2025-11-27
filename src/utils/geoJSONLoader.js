export const loadGeoJSONData = async (url, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching GeoJSON from: ${url} (attempt ${attempt}/${retries})`);
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/geo+json, application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unable to read error response');
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
      if (error.name === 'AbortError') {
        console.error(`Request timeout for ${url} (attempt ${attempt}/${retries})`);
      } else {
        console.error(`Error loading GeoJSON from ${url} (attempt ${attempt}/${retries}):`, error);
      }
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

