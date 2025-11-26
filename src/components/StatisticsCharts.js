import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './StatisticsCharts.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsCharts = ({ statistics, selectedCity }) => {
  if (!statistics || !statistics.buildings) {
    return <div className="statistics-placeholder">Select a city to view statistics</div>;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  // Buildings by energy label chart
  const buildingsData = {
    labels: Object.keys(statistics.buildings).sort(),
    datasets: [{
      label: 'Buildings',
      data: Object.keys(statistics.buildings).sort().map(label => statistics.buildings[label]),
      backgroundColor: [
        '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff4000', '#ff0000', '#800000'
      ]
    }]
  };

  // Area by energy label chart
  const areaData = {
    labels: Object.keys(statistics.area).sort(),
    datasets: [{
      label: 'Area (m²)',
      data: Object.keys(statistics.area).sort().map(label => statistics.area[label]),
      backgroundColor: [
        '#00ff00', '#80ff00', '#ffff00', '#ff8000', '#ff4000', '#ff0000', '#800000'
      ]
    }]
  };

  // Difference chart
  const differenceData = {
    labels: Object.keys(statistics.differences || {}).sort(),
    datasets: [{
      label: 'Difference',
      data: Object.keys(statistics.differences || {}).sort().map(label => statistics.differences[label]),
      backgroundColor: Object.keys(statistics.differences || {}).sort().map(label => 
        statistics.differences[label] > 0 ? '#00ff00' : statistics.differences[label] < 0 ? '#ff0000' : '#888888'
      )
    }]
  };

  return (
    <div className="statistics-charts">
      <div className="chart-container">
        <h4>Buildings by Energy Label</h4>
        <div className="chart-wrapper">
          <Bar data={buildingsData} options={chartOptions} />
        </div>
        <div className="chart-summary">
          {Object.entries(statistics.buildings).map(([label, count]) => {
            const percentage = ((count / statistics.totalBuildings) * 100).toFixed(1);
            return (
              <div key={label} className="summary-item">
                <span className="label">{label}:</span>
                <span className="value">{count} ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-container">
        <h4>Area by Energy Label</h4>
        <div className="chart-wrapper">
          <Bar data={areaData} options={chartOptions} />
        </div>
        <div className="chart-summary">
          {Object.entries(statistics.area).map(([label, area]) => {
            const percentage = ((area / statistics.totalArea) * 100).toFixed(1);
            return (
              <div key={label} className="summary-item">
                <span className="label">{label}:</span>
                <span className="value">{area.toFixed(0)} m² ({percentage}%)</span>
              </div>
            );
          })}
        </div>
      </div>

      {statistics.differences && Object.keys(statistics.differences).length > 0 && (
        <div className="chart-container">
          <h4>Difference: Updated - Default</h4>
          <div className="chart-wrapper">
            <Bar data={differenceData} options={chartOptions} />
          </div>
          <div className="chart-summary">
            {Object.entries(statistics.differences).map(([label, diff]) => (
              <div key={label} className="summary-item">
                <span className="label">{label}:</span>
                <span className={`value ${diff > 0 ? 'positive' : diff < 0 ? 'negative' : ''}`}>
                  {diff > 0 ? '+' : ''}{diff}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsCharts;

