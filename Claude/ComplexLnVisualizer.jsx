import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';

const ComplexLnVisualizer = () => {
  const [heatmapData, setHeatmapData] = useState({ real: [], imag: [] });
  
  useEffect(() => {
    const math = create(all);
    const resolution = 100;
    const range = 4;
    
    const realPart = [];
    const imagPart = [];
    
    // Create grid points
    for (let y = resolution - 1; y >= 0; y--) {
      const realRow = [];
      const imagRow = [];
      for (let x = 0; x < resolution; x++) {
        // Map grid coordinates to complex plane
        const real = (x - resolution/2) * (range/resolution);
        const imag = (y - resolution/2) * (range/resolution);
        
        // Calculate ln(z)
        const z = math.complex(real, imag);
        try {
          const result = math.log(z);
          realRow.push(result.re);
          imagRow.push(result.im);
        } catch (e) {
          realRow.push(null);
          imagRow.push(null);
        }
      }
      realPart.push(realRow);
      imagPart.push(imagRow);
    }
    
    setHeatmapData({ real: realPart, imag: imagPart });
  }, []);
  
  const getColor = (value, min, max) => {
    if (value === null) return 'rgb(0,0,0)';
    // Normalize value to [0,1]
    const normalized = (value - min) / (max - min);
    // Create RGB values (using a blue-red gradient)
    const r = Math.floor(255 * Math.max(0, Math.min(1, 2 * normalized - 1)));
    const b = Math.floor(255 * Math.max(0, Math.min(1, 2 * (1 - normalized))));
    return `rgb(${r},0,${b})`;
  };
  
  // Find min/max values for color scaling
  const findMinMax = (data) => {
    let min = Infinity;
    let max = -Infinity;
    data.forEach(row => {
      row.forEach(val => {
        if (val !== null) {
          min = Math.min(min, val);
          max = Math.max(max, val);
        }
      });
    });
    return { min, max };
  };
  
  const realMinMax = findMinMax(heatmapData.real);
  const imagMinMax = findMinMax(heatmapData.imag);
  
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-xl font-bold">Complex Natural Logarithm ln(z)</h2>
      <div className="flex flex-row space-x-8">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Real Part</h3>
          <div className="h-64 w-64 relative">
            {heatmapData.real.map((row, i) => (
              <div key={i} className="flex">
                {row.map((value, j) => (
                  <div
                    key={j}
                    className="w-1 h-1"
                    style={{
                      backgroundColor: getColor(value, realMinMax.min, realMinMax.max)
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Imaginary Part</h3>
          <div className="h-64 w-64 relative">
            {heatmapData.imag.map((row, i) => (
              <div key={i} className="flex">
                {row.map((value, j) => (
                  <div
                    key={j}
                    className="w-1 h-1"
                    style={{
                      backgroundColor: getColor(value, imagMinMax.min, imagMinMax.max)
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-sm mt-4">
        <p>The visualization shows ln(z) mapped on the complex plane where:</p>
        <ul className="list-disc ml-4 mt-2">
          <li>Left plot shows the real part: ln|z|</li>
          <li>Right plot shows the imaginary part: arg(z)</li>
          <li>The branch cut appears along the negative real axis</li>
        </ul>
      </div>
    </div>
  );
};

export default ComplexLnVisualizer;
