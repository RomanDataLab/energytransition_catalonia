import React, { useMemo, useState } from 'react';
import './LegendPanel.css';

const LegendPanel = ({ selectedCity, geoJSONData }) => {
  const [showMethodology, setShowMethodology] = useState(false);

  const labelColors = {
    'A': '#00ff00',
    'B': '#80ff00',
    'C': '#ffff00',
    'D': '#ff8000',
    'E': '#ff4000',
    'F': '#ff0000',
    'G': '#800000'
  };

  const labelOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Calculate statistics for selected city
  const statistics = useMemo(() => {
    if (!selectedCity || !geoJSONData[selectedCity] || !geoJSONData[selectedCity].e) {
      return null;
    }

    const features = geoJSONData[selectedCity].e.features || [];
    const counts = {};
    const areas = {};
    let total = 0;
    let totalArea = 0;

    features.forEach(feature => {
      const label = feature.properties?.energy_label;
      const area = parseFloat(feature.properties?.value) || 0;
      
      if (label) {
        counts[label] = (counts[label] || 0) + 1;
        areas[label] = (areas[label] || 0) + area;
        total++;
        totalArea += area;
      }
    });

    return { counts, areas, total, totalArea };
  }, [selectedCity, geoJSONData]);

  const maxCount = statistics ? Math.max(...Object.values(statistics.counts)) : 0;

  return (
    <div className="legend-panel">
      <div className="legend-header">
        <h2>Energy Labeled Buildings</h2>
        {selectedCity && (
          <div className="city-name">{selectedCity.toUpperCase()}</div>
        )}
      </div>

      {!selectedCity ? (
        <div className="legend-placeholder">
          Hover over or click a city map to view statistics
        </div>
      ) : statistics ? (
        <div className="legend-chart">
          {labelOrder.map(label => {
            const count = statistics.counts[label] || 0;
            const area = statistics.areas[label] || 0;
            const percentage = statistics.total > 0 ? (count / statistics.total * 100).toFixed(1) : 0;
            const barWidth = maxCount > 0 ? (count / maxCount * 100) : 0;

            return (
              <div key={label} className="legend-bar-item">
                <div className="legend-bar-container">
                  <div
                    className="legend-bar"
                    style={{
                      backgroundColor: labelColors[label],
                      width: `${barWidth}%`,
                      minWidth: count > 0 ? '4px' : '0'
                    }}
                    title={`${label}: ${count} buildings (${percentage}%), ${area.toFixed(0)} m²`}
                  />
                  <div className="legend-bar-label">{label}</div>
                </div>
                <div className="legend-bar-value">
                  {count > 0 ? (
                    <>
                      <div className="count">{count}</div>
                      <div className="percentage">({percentage}%)</div>
                      <div className="area">{area.toFixed(0)} m²</div>
                    </>
                  ) : (
                    <>
                      <div className="count">0</div>
                      <div className="area">0 m²</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          <div className="legend-total">
            Total: {statistics.total} buildings
          </div>
          <div className="methodology-link">
            <a href="#" onClick={(e) => { e.preventDefault(); setShowMethodology(true); }}>
              methodology
            </a>
          </div>
        </div>
      ) : (
        <div className="legend-placeholder">
          Loading statistics...
        </div>
      )}

      {showMethodology && (
        <div className="methodology-overlay" onClick={() => setShowMethodology(false)}>
          <div className="methodology-content" onClick={(e) => e.stopPropagation()}>
            <div className="methodology-header">
              <h3>Methodology</h3>
              <button className="methodology-close" onClick={() => setShowMethodology(false)}>×</button>
            </div>
            <div className="methodology-text">
              <h4>1. Basic idea</h4>
              <p>
                Energy performance in Spain depends largely on thermal envelope, HVAC systems, and building technology.
              </p>
              <p>
                Building codes have evolved in waves:
              </p>
              <ul>
                <li><strong>Before 1979:</strong> minimal insulation, inefficient heating.</li>
                <li><strong>1979–2006:</strong> first insulation and energy standards (CTE pre-2006).</li>
                <li><strong>2006–2013:</strong> stricter CTE (Código Técnico de la Edificación) requirements.</li>
                <li><strong>2013–2021:</strong> almost all renovations required better insulation, efficient systems.</li>
                <li><strong>2021–present:</strong> aligned with EU NZEB (near-zero energy) standard.</li>
              </ul>
              <p>
                Renovation year is a proxy for code compliance, and therefore for likely energy performance.
              </p>

              <h4>2. Simplified formula of energy efficiency labeling for buildings</h4>
              <p>
                We can assign energy categories A–G based on last renovation year:
              </p>
              <table className="methodology-table">
                <thead>
                  <tr>
                    <th>Last Renovation</th>
                    <th>Likely Label</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>&lt; 1979</td><td>G</td><td>Very low insulation, inefficient systems</td></tr>
                  <tr><td>1980–2005</td><td>F–E</td><td>Basic envelope improvements, old systems</td></tr>
                  <tr><td>2006–2012</td><td>D–C</td><td>CTE 2006 standards mostly applied</td></tr>
                  <tr><td>2013–2020</td><td>B–C</td><td>CTE 2013 &amp; efficient systems</td></tr>
                  <tr><td>≥ 2021</td><td>A–B</td><td>Near NZEB standard</td></tr>
                </tbody>
              </table>
              <p>
                Simplified linear scoring:
              </p>
              <p>
                Define a score <em>S</em>:
              </p>
              <div className="formula">
                <em>S</em> = (Year of last renovation − 1970) / 50 × 6
              </div>
              <p>
                Round to nearest integer between 0–6, map to labels:
              </p>
              <ul>
                <li>0 → G</li>
                <li>1 → F</li>
                <li>2 → E</li>
                <li>3 → D</li>
                <li>4 → C</li>
                <li>5 → B</li>
                <li>6 → A</li>
              </ul>

              <h4>3. Aggregate data from the database of energy certified buildings of Catalonia</h4>
              <p>
                Aggregate data from the database of energy certified buildings of Catalonia and replace labels calculated by the simplified formula. Approximate share of replacement 2-10% depending on city.
              </p>

              <h4>4. Notes &amp; Limitations</h4>
              <p>
                This only gives approximate labels. Actual EPC in Spain requires:
              </p>
              <ul>
                <li>Thermal envelope properties (U-values)</li>
                <li>Heating/cooling efficiency</li>
                <li>Hot water, ventilation</li>
                <li>Orientation &amp; shading</li>
              </ul>

              <h4>References</h4>
              <ol className="methodology-references">
                <li>
                  Generalitat de Catalunya. <em>Certificats d'eficiència energètica d'edificis</em>. Portal de dades obertes de la Generalitat. Available at: <a href="https://analisi.transparenciacatalunya.cat/Energia/Certificats-d-efici-ncia-energ-tica-d-edificis/j6ii-t3w2/about_data" target="_blank" rel="noopener noreferrer">https://analisi.transparenciacatalunya.cat/Energia/Certificats-d-efici-ncia-energ-tica-d-edificis/j6ii-t3w2/about_data</a> [Accessed: 2024].
                </li>
                <li>
                  Dirección General del Catastro. <em>Servicios INSPIRE de Cartografía Catastral</em>. Ministerio de Hacienda y Función Pública. Available at: <a href="https://www.catastro.hacienda.gob.es/webinspire/index.html" target="_blank" rel="noopener noreferrer">https://www.catastro.hacienda.gob.es/webinspire/index.html</a> [Accessed: 2024].
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegendPanel;
