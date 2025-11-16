import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Upload, Info, Home, ArrowRight } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div>
      {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} />}
      {currentPage === 'closestpair' && <ClosestPairDemo setCurrentPage={setCurrentPage} />}
      {currentPage === 'karatsuba' && <KaratsubaDemo setCurrentPage={setCurrentPage} />}
    </div>
  );
};

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Design and Analysis of Algorithms
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Interactive Algorithm Demonstrations
          </p>
          
          <div className="bg-gray-100 rounded-xl p-6 mb-8 border border-gray-300">
            <h3 className="text-gray-900 text-xl font-semibold mb-4">Project Team</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-300">
                <p className="text-gray-900 font-semibold">Muhammad Abd-Ur-Rahman</p>
                <p className="text-gray-600">23K-0760</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-300">
                <p className="text-gray-900 font-semibold">Ali Yehya Hayati</p>
                <p className="text-gray-600">23K-0569</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-300">
                <p className="text-gray-900 font-semibold">Ammar Zulfiqar</p>
                <p className="text-gray-600">23K-0908</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setCurrentPage('closestpair')}
            className="bg-gray-900 hover:bg-gray-800 text-white p-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-3">Closest Pair of Points</h2>
              <p className="text-gray-300 mb-4">
                Find the two closest points in a 2D plane using divide and conquer
              </p>
              <div className="flex items-center text-gray-400">
                <span className="mr-2">O(n log n)</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('karatsuba')}
            className="bg-gray-900 hover:bg-gray-800 text-white p-8 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="text-left">
              <h2 className="text-2xl font-bold mb-3">Karatsuba Multiplication</h2>
              <p className="text-gray-300 mb-4">
                Fast integer multiplication using divide and conquer
              </p>
              <div className="flex items-center text-gray-400">
                <span className="mr-2">O(n^1.585)</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const KaratsubaDemo = ({ setCurrentPage }) => {
  const [num1, setNum1] = useState('1234');
  const [num2, setNum2] = useState('5678');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [result, setResult] = useState(null);
  const [treeNodes, setTreeNodes] = useState([]);

  const karatsuba = (x, y) => {
    const stepsList = [];
    const nodes = [];
    let nodeId = 0;
    
    const multiply = (x, y, depth, parentId = null) => {
      const currentNodeId = nodeId++;
      const xStr = x.toString();
      const yStr = y.toString();
      
      if (x < 10 || y < 10) {
        const res = x * y;
        nodes.push({
          id: currentNodeId,
          parentId,
          depth,
          x,
          y,
          result: res,
          type: 'base'
        });
        stepsList.push({
          depth,
          operation: 'base',
          x, y, result: res,
          nodeId: currentNodeId,
          description: `Base: ${x} × ${y} = ${res}`
        });
        return res;
      }

      const n = Math.max(xStr.length, yStr.length);
      const m = Math.floor(n / 2);
      const powerOf10 = Math.pow(10, m);
      const high1 = Math.floor(x / powerOf10);
      const low1 = x % powerOf10;
      const high2 = Math.floor(y / powerOf10);
      const low2 = y % powerOf10;

      nodes.push({
        id: currentNodeId,
        parentId,
        depth,
        x,
        y,
        high1,
        low1,
        high2,
        low2,
        m,
        type: 'split'
      });

      stepsList.push({
        depth,
        operation: 'split',
        x, y, high1, low1, high2, low2, m,
        nodeId: currentNodeId,
        description: `Split: ${x} = ${high1}·10^${m} + ${low1}, ${y} = ${high2}·10^${m} + ${low2}`
      });

      const z0 = multiply(low1, low2, depth + 1, currentNodeId);
      const z1 = multiply(low1 + high1, low2 + high2, depth + 1, currentNodeId);
      const z2 = multiply(high1, high2, depth + 1, currentNodeId);
      const res = z2 * Math.pow(10, 2 * m) + (z1 - z2 - z0) * Math.pow(10, m) + z0;
      
      nodes[nodes.findIndex(n => n.id === currentNodeId)].result = res;
      
      stepsList.push({
        depth,
        operation: 'combine',
        z0, z1, z2, m, result: res,
        nodeId: currentNodeId,
        description: `Combine: ${res}`
      });

      return res;
    };

    const finalResult = multiply(parseInt(x), parseInt(y), 0);
    return { result: finalResult, steps: stepsList, nodes };
  };

  const runAlgorithm = () => {
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
      alert('Please enter valid integers');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
    const kr = karatsuba(num1, num2);
    setSteps(kr.steps);
    setResult(kr.result);
    setTreeNodes(kr.nodes);
    setCurrentStep(0);
  };

  const togglePause = () => setIsPaused(!isPaused);
  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setResult(null);
    setSteps([]);
    setTreeNodes([]);
  };

  useEffect(() => {
    if (isRunning && !isPaused && currentStep < steps.length) {
      const timer = setTimeout(() => setCurrentStep(currentStep + 1), 1000);
      return () => clearTimeout(timer);
    } else if (isRunning && currentStep >= steps.length) {
      setIsRunning(false);
    }
  }, [isRunning, isPaused, currentStep, steps]);

  const displayStep = currentStep < steps.length ? steps[currentStep] : null;
  const isComplete = result !== null && currentStep >= steps.length;

  const renderTree = () => {
    if (treeNodes.length === 0) return null;

    const maxDepth = Math.max(...treeNodes.map(n => n.depth));
    const nodeWidth = 120;
    const nodeHeight = 70;
    const levelHeight = 120;
    const svgWidth = Math.max(800, Math.pow(2, maxDepth) * nodeWidth);
    const svgHeight = (maxDepth + 1) * levelHeight + 50;

    const getNodePosition = (node) => {
      const nodesAtDepth = treeNodes.filter(n => n.depth === node.depth);
      const index = nodesAtDepth.findIndex(n => n.id === node.id);
      const totalAtDepth = nodesAtDepth.length;
      const x = (svgWidth / (totalAtDepth + 1)) * (index + 1);
      const y = node.depth * levelHeight + 50;
      return { x, y };
    };

    const currentNodeId = displayStep?.nodeId;
    const processedNodes = steps.slice(0, currentStep + 1).map(s => s.nodeId);

    return (
      <div className="bg-gray-100 rounded-xl p-6 mb-6 border border-gray-300">
        <h3 className="text-gray-900 text-lg font-semibold mb-4">Recursion Tree</h3>
        <div className="overflow-x-auto">
          <svg width={svgWidth} height={svgHeight} className="mx-auto">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>

            {treeNodes.map(node => {
              if (node.parentId !== null) {
                const parent = treeNodes.find(n => n.id === node.parentId);
                if (parent) {
                  const parentPos = getNodePosition(parent);
                  const nodePos = getNodePosition(node);
                  return (
                    <line
                      key={`line-${node.id}`}
                      x1={parentPos.x}
                      y1={parentPos.y + nodeHeight / 2}
                      x2={nodePos.x}
                      y2={nodePos.y - nodeHeight / 2}
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      opacity={processedNodes.includes(node.id) ? 1 : 0.3}
                    />
                  );
                }
              }
              return null;
            })}

            {treeNodes.map(node => {
              const pos = getNodePosition(node);
              const isActive = currentNodeId === node.id;
              const isProcessed = processedNodes.includes(node.id);
              const isBase = node.type === 'base';
              
              return (
                <g key={node.id}>
                  <rect
                    x={pos.x - nodeWidth / 2}
                    y={pos.y - nodeHeight / 2}
                    width={nodeWidth}
                    height={nodeHeight}
                    fill={isActive ? '#3b82f6' : isProcessed ? (isBase ? '#10b981' : '#8b5cf6') : '#e5e7eb'}
                    stroke={isActive ? '#1d4ed8' : '#9ca3af'}
                    strokeWidth="2"
                    rx="8"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 10}
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    {node.x} × {node.y}
                  </text>
                  {node.result !== undefined && (
                    <text
                      x={pos.x}
                      y={pos.y + 10}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                    >
                      = {node.result}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-4 flex gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-700">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-gray-700">Split</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-700">Base Case</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span className="text-gray-700">Not Visited</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => setCurrentPage('home')} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <Home size={20} />Back to Home
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Karatsuba Multiplication</h1>
        <p className="text-gray-600 text-lg mb-6">Fast multiplication - O(n^1.585)</p>

        <div className="bg-gray-100 rounded-xl p-6 mb-6 border border-gray-300">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">First Number</label>
              <input type="text" value={num1} onChange={(e) => setNum1(e.target.value.replace(/[^0-9]/g, ''))} disabled={isRunning} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-xl" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Second Number</label>
              <input type="text" value={num2} onChange={(e) => setNum2(e.target.value.replace(/[^0-9]/g, ''))} disabled={isRunning} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-xl" />
            </div>
          </div>
          <div className="flex gap-4">
            {!isRunning ? (
              <button onClick={runAlgorithm} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <Play size={20} />Run
              </button>
            ) : (
              <button onClick={togglePause} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                {isPaused ? <Play size={20} /> : <Pause size={20} />}{isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            <button onClick={reset} className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg flex items-center gap-2">
              <RotateCcw size={20} />Reset
            </button>
          </div>
        </div>

        {displayStep && (
          <div className="bg-blue-50 border border-blue-300 rounded-xl p-6 mb-6">
            <h3 className="text-gray-900 text-lg font-semibold mb-2">Step {currentStep + 1} / {steps.length}</h3>
            <p className="text-gray-800">{displayStep.description}</p>
            {displayStep.operation === 'combine' && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-gray-900 font-mono">z0={displayStep.z0}, z1={displayStep.z1}, z2={displayStep.z2}</p>
              </div>
            )}
          </div>
        )}

        {isComplete && (
          <div className="bg-green-50 border border-green-300 rounded-xl p-6 mb-6">
            <h3 className="text-gray-900 text-2xl font-bold mb-3">✓ Complete!</h3>
            <p className="text-gray-800 text-3xl font-mono">{num1} × {num2} = {result}</p>
          </div>
        )}

        {isComplete && treeNodes.length > 0 && renderTree()}
      </div>
    </div>
  );
};

const ClosestPairDemo = ({ setCurrentPage }) => {
  const [points, setPoints] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [algorithm, setAlgorithm] = useState('divideconquer');
  const [steps, setSteps] = useState([]);
  const [currentPhase, setCurrentPhase] = useState('');
  const fileInputRef = useRef(null);

  const GRID_SIZE = 40;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const MIN_X = -10;
  const MAX_X = 10;
  const MIN_Y = -7.5;
  const MAX_Y = 7.5;

  useEffect(() => {
    generateRandomPoints(10);
  }, []);

  const unitToPixel = (unit, isY = false) => {
    if (points.length === 0) return isY ? CANVAS_HEIGHT / 2 : CANVAS_WIDTH / 2;
    
    const allX = points.map(p => p.x);
    const allY = points.map(p => p.y);
    const minPx = Math.min(...allX);
    const maxPx = Math.max(...allX);
    const minPy = Math.min(...allY);
    const maxPy = Math.max(...allY);
    
    const rangeX = maxPx - minPx || 1;
    const rangeY = maxPy - minPy || 1;
    const padding = 40;
    
    if (isY) {
      return CANVAS_HEIGHT - padding - ((unit - minPy) / rangeY) * (CANVAS_HEIGHT - 2 * padding);
    } else {
      return padding + ((unit - minPx) / rangeX) * (CANVAS_WIDTH - 2 * padding);
    }
  };

  const generateRandomPoints = (count) => {
    const newPoints = [];
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let x, y, key;
      do {
        x = Math.random() * (MAX_X - MIN_X - 2) + MIN_X + 1;
        y = Math.random() * (MAX_Y - MIN_Y - 2) + MIN_Y + 1;
        key = `${x},${y}`;
      } while (used.has(key));
      used.add(key);
      newPoints.push({ x, y, id: i });
    }
    setPoints(newPoints);
    reset();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const newPoints = [];
      const used = new Set();
      lines.forEach((line) => {
        const parts = line.trim().split(/[\s,]+/);
        if (parts.length >= 2) {
          const x = parseFloat(parts[0]);
          const y = parseFloat(parts[1]);
          if (!isNaN(x) && !isNaN(y)) {
            const key = `${x},${y}`;
            if (!used.has(key)) {
              used.add(key);
              newPoints.push({ x, y, id: newPoints.length });
            }
          }
        }
      });
      if (newPoints.length >= 2) {
        setPoints(newPoints);
        reset();
      } else {
        alert('File must contain at least 2 valid points');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const distance = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  const divideAndConquer = (pts) => {
    const stepsList = [];
    const sortedByX = [...pts].sort((a, b) => a.x - b.x);
    const sortedByY = [...pts].sort((a, b) => a.y - b.y);

    const closestUtil = (px, py, n) => {
      if (n <= 3) {
        let minDist = Infinity;
        const pairs = [];
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const dist = distance(px[i], px[j]);
            stepsList.push({
              comparing: [px[i].id, px[j].id],
              distance: dist,
              isBest: dist < minDist,
              phase: 'Base',
              medianX: null
            });
            if (dist < minDist) {
              minDist = dist;
              pairs.length = 0;
              pairs.push([px[i], px[j]]);
            }
          }
        }
        return { minDist, pairs };
      }

      const mid = Math.floor(n / 2);
      const midPoint = px[mid];
      const pyl = py.filter(p => p.x <= midPoint.x);
      const pyr = py.filter(p => p.x > midPoint.x);
      
      stepsList.push({
        comparing: null,
        distance: null,
        isBest: false,
        phase: 'Divide',
        medianX: midPoint.x
      });
      
      const left = closestUtil(px.slice(0, mid), pyl, mid);
      const right = closestUtil(px.slice(mid), pyr, n - mid);
      let minDist = Math.min(left.minDist, right.minDist);
      let currentPairs = left.minDist < right.minDist ? left.pairs : right.pairs;

      const strip = py.filter(p => Math.abs(p.x - midPoint.x) < minDist);
      for (let i = 0; i < strip.length; i++) {
        for (let j = i + 1; j < strip.length && (strip[j].y - strip[i].y) < minDist; j++) {
          const dist = distance(strip[i], strip[j]);
          stepsList.push({
            comparing: [strip[i].id, strip[j].id],
            distance: dist,
            isBest: dist < minDist,
            phase: 'Strip',
            medianX: midPoint.x
          });
          if (dist < minDist) {
            minDist = dist;
            currentPairs = [[strip[i], strip[j]]];
          }
        }
      }
      return { minDist, pairs: currentPairs };
    };

    const res = closestUtil(sortedByX, sortedByY, pts.length);
    return { minDist: res.minDist, pair: res.pairs[0], allPairs: res.pairs, steps: stepsList };
  };

  const runAlgorithm = () => {
    if (points.length < 2) return;
    setIsRunning(true);
    setIsPaused(false);
    const ar = divideAndConquer(points);
    setSteps(ar.steps);
    setResult(ar);
    setStep(0);
  };

  const togglePause = () => setIsPaused(!isPaused);
  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setStep(0);
    setResult(null);
    setSteps([]);
    setCurrentPhase('');
  };

  useEffect(() => {
    if (isRunning && !isPaused && step < steps.length) {
      const timer = setTimeout(() => {
        setStep(step + 1);
        if (steps[step]) setCurrentPhase(steps[step].phase);
      }, 800);
      return () => clearTimeout(timer);
    } else if (isRunning && step >= steps.length) {
      setIsRunning(false);
    }
  }, [isRunning, isPaused, step, steps]);

  const currentStep = step < steps.length ? steps[step] : null;
  const isComplete = result && step >= steps.length;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => setCurrentPage('home')} className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <Home size={20} />Back to Home
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Closest Pair of Points</h1>

        <div className="bg-gray-100 rounded-xl p-6 mb-6 border border-gray-300">
          <div className="flex flex-wrap gap-4 mb-4">
            {!isRunning ? (
              <button onClick={runAlgorithm} disabled={points.length < 2} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <Play size={20} />Run
              </button>
            ) : (
              <button onClick={togglePause} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                {isPaused ? <Play size={20} /> : <Pause size={20} />}{isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            <button onClick={reset} className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-2 rounded-lg flex items-center gap-2">
              <RotateCcw size={20} />Reset
            </button>
            <button onClick={() => fileInputRef.current?.click()} disabled={isRunning} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg flex items-center gap-2">
              <Upload size={20} />Upload
            </button>
            <input ref={fileInputRef} type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
          </div>
          <div className="flex gap-4 items-center">
            <label className="text-gray-900">Points: {points.length}</label>
            <input type="range" min="5" max="100" value={Math.min(points.length, 100)} onChange={(e) => generateRandomPoints(parseInt(e.target.value))} disabled={isRunning} className="flex-1 max-w-xs" />
          </div>
        </div>

        {currentPhase && !isComplete && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg flex items-center justify-center border-2 border-blue-400">
                <span className="text-2xl font-bold text-blue-600">{currentPhase}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-bold text-lg mb-1">{currentPhase} Phase</p>
                <p className="text-gray-700 text-sm">
                  {currentPhase === 'Base' && 'Brute force comparison for small subsets (≤3 points). Checking all possible pairs to find the minimum distance.'}
                  {currentPhase === 'Divide' && 'Dividing the point set into left and right halves using the median x-coordinate. The yellow line shows the division boundary.'}
                  {currentPhase === 'Strip' && 'Checking points near the dividing line (within current minimum distance). Only comparing points whose y-coordinates are close together.'}
                </p>
                {currentStep && currentStep.comparing && (
                  <p className="text-gray-600 text-xs mt-2">
                    Currently comparing: Point P{currentStep.comparing[0]} and Point P{currentStep.comparing[1]}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
          <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="mx-auto bg-gray-800 rounded-lg">
            <defs>
              <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />

            {currentStep && currentStep.medianX !== null && (
              <line 
                x1={unitToPixel(currentStep.medianX)} 
                y1="0" 
                x2={unitToPixel(currentStep.medianX)} 
                y2={CANVAS_HEIGHT} 
                stroke="#fbbf24" 
                strokeWidth="3" 
                strokeDasharray="8,4"
                opacity="0.8"
              />
            )}

            {currentStep && currentStep.comparing && (
              <line x1={unitToPixel(points[currentStep.comparing[0]].x)} y1={unitToPixel(points[currentStep.comparing[0]].y, true)} x2={unitToPixel(points[currentStep.comparing[1]].x)} y2={unitToPixel(points[currentStep.comparing[1]].y, true)} stroke={currentStep.isBest ? "#10b981" : "#f97316"} strokeWidth="3" opacity="0.8" />
            )}

            {isComplete && result.allPairs && result.allPairs.map((pair, idx) => (
              <line key={idx} x1={unitToPixel(pair[0].x)} y1={unitToPixel(pair[0].y, true)} x2={unitToPixel(pair[1].x)} y2={unitToPixel(pair[1].y, true)} stroke="#10b981" strokeWidth="4" />
            ))}

            {points.map((point) => {
              const isInComp = currentStep?.comparing?.includes(point.id);
              const isInFinal = isComplete && result.allPairs?.some(pair => pair.some(p => p.id === point.id));
              return (
                <g key={point.id}>
                  <circle cx={unitToPixel(point.x)} cy={unitToPixel(point.y, true)} r={isInComp || isInFinal ? 8 : 6} fill={isInFinal ? "#10b981" : isInComp ? "#f97316" : "#8b5cf6"} stroke="white" strokeWidth="2" />
                  <text x={unitToPixel(point.x)} y={unitToPixel(point.y, true) - 15} fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">P{point.id}</text>
                </g>
              );
            })}
          </svg>

          <div className="mt-6 text-center">
            {isRunning && step < steps.length && (
              <div className="text-gray-900">
                <p className="text-lg">Step {step + 1} / {steps.length}</p>
                {currentStep && currentStep.comparing && (
                  <p className="text-gray-700">Distance: {currentStep.distance.toFixed(3)} units {currentStep.isBest && "✓"}</p>
                )}
                {currentStep && currentStep.medianX !== null && (
                  <p className="text-yellow-600 font-semibold">Median Line at x = {currentStep.medianX.toFixed(2)}</p>
                )}
              </div>
            )}
            {isComplete && (
              <div className="text-gray-900">
                <p className="font-bold text-green-600 text-xl">✓ Complete!</p>
                <p>Min Distance: {result.minDist.toFixed(3)} units</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;