import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';

const RiemannSurface = () => {
  const [startAngle, setStartAngle] = useState(0);
  const [sheets, setSheets] = useState(3);

  const generateSurfaceData = () => {
    const math = create(all);
    const resolution = 120; // Increased resolution
    const rMin = 0.1;
    const rMax = 2;
    const points = [];
    
    // Generate points with smoother transitions
    for (let sheet = 0; sheet < sheets; sheet++) {
      // Add overlap between sheets for continuity
      const sheetOverlap = 0.1;
      const startTheta = -sheetOverlap * 2 * Math.PI;
      const endTheta = (1 + sheetOverlap) * 2 * Math.PI;
      
      for (let r = 0; r < resolution; r++) {
        for (let t = 0; t < resolution; t++) {
          const radius = rMin + (rMax - rMin) * (r / resolution);
          const theta = startTheta + (endTheta - startTheta) * (t / resolution);
          const angle = theta + (2 * Math.PI * sheet);
          
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          const z = math.complex(x, y);
          
          try {
            const logZ = math.log(z);
            // Add interpolation factor for smooth sheet transitions
            const sheetTransition = Math.max(0, Math.min(1, 
              (theta - startTheta) / (2 * Math.PI * sheetOverlap)));
            
            points.push({
              x: x,
              y: y,
              z: logZ.re,
              arg: logZ.im + (2 * Math.PI * sheet),
              sheet: sheet + sheetTransition,
              radius: radius
            });
          } catch (e) {
            // Skip undefined points
          }
        }
      }
    }
    return points;
  };

  const rotatePoint = (point, angle) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos,
      z: point.z,
      arg: point.arg,
      sheet: point.sheet,
      radius: point.radius
    };
  };

  const points = generateSurfaceData().map(p => rotatePoint(p, startAngle));
  
  const project = (point) => {
    const scale = 100;
    const distance = 4;
    const perspective = 1000;
    
    const x = point.x * scale;
    const y = point.y * scale;
    const z = point.z * scale;
    
    const projectedX = (x * perspective) / (z + perspective + distance);
    const projectedY = (y * perspective) / (z + perspective + distance);
    
    return { 
      x: projectedX, 
      y: projectedY, 
      z: z, 
      arg: point.arg, 
      sheet: point.sheet,
      radius: point.radius 
    };
  };

  const projectedPoints = points.map(project);
  projectedPoints.sort((a, b) => b.z - a.z);

  const getColor = (sheet, arg, radius) => {
    // Smooth color transition based on argument and sheet number
    const hue = ((arg / (2 * Math.PI)) % 1) * 360;
    const saturation = 70 + (radius * 10); // Increase saturation with radius
    const lightness = 60 - (sheet * 8) - (radius * 10); // Smoother darkness transition
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-xl font-bold">Continuous Riemann Surface of ln(z)</h2>
      <div className="flex space-x-4 mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setStartAngle(angle => angle - Math.PI/24)}
        >
          Rotate Left
        </button>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setStartAngle(angle => angle + Math.PI/24)}
        >
          Rotate Right
        </button>
        <button 
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setSheets(s => Math.min(s + 1, 5))}
        >
          Add Sheet
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setSheets(s => Math.max(s - 1, 1))}
        >
          Remove Sheet
        </button>
      </div>
      <div className="relative h-96 w-96 bg-gray-100">
        <svg width="100%" height="100%" viewBox="-200 -200 400 400">
          {projectedPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r={0.8} // Smaller points for smoother appearance
              fill={getColor(point.sheet, point.arg, point.radius)}
              opacity={0.8}
            />
          ))}
        </svg>
      </div>
      <div className="text-sm mt-4">
        <p>Continuous visualization of the ln(z) Riemann surface showing:</p>
        <ul className="list-disc ml-4 mt-2">
          <li>Smooth transitions between sheets (2π increments in argument)</li>
          <li>Continuous spiral structure around the branch point</li>
          <li>Gradual color changes representing the complex argument</li>
          <li>Higher density sampling for improved continuity</li>
        </ul>
      </div>
    </div>
  );
};

export default RiemannSurface;
