import React from "react";
import { RotateCcw, ArrowRight, Award, Percent, AlertCircle, Clock } from "lucide-react";
import type { TelemetryPoint } from "../hooks/useTypingTest";

interface ResultsDashboardProps {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  timeElapsed: number;
  telemetry: TelemetryPoint[];
  onRestart: () => void;
  onNextTest: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  wpm,
  rawWpm,
  accuracy,
  errors,
  timeElapsed,
  telemetry,
  onRestart,
  onNextTest,
}) => {
  // SVG Chart Config
  const svgWidth = 650;
  const svgHeight = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  // Calculate scales
  const chartData = telemetry.length > 0 ? telemetry : [{ second: 1, wpm: 0, rawWpm: 0, errors: 0 }];
  const maxWpm = Math.max(...chartData.map((d) => Math.max(d.wpm, d.rawWpm)), 60);
  const totalSeconds = Math.max(...chartData.map((d) => d.second), timeElapsed);

  const getX = (second: number) => {
    if (totalSeconds <= 1) return padding.left;
    const chartWidth = svgWidth - padding.left - padding.right;
    return padding.left + ((second - 1) / (totalSeconds - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    const chartHeight = svgHeight - padding.top - padding.bottom;
    return svgHeight - padding.bottom - (val / maxWpm) * chartHeight;
  };

  // Generate path points
  const wpmPoints = chartData.map((d) => `${getX(d.second)},${getY(d.wpm)}`).join(" ");
  const rawPoints = chartData.map((d) => `${getX(d.second)},${getY(d.rawWpm)}`).join(" ");

  // Create grid lines (5 increments)
  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxWpm / 4) * i);
    gridLines.push(val);
  }

  // Create X axis time markers (up to 6 increments)
  const timeMarkers = [];
  const timeStep = Math.max(1, Math.ceil(totalSeconds / 5));
  for (let t = 1; t <= totalSeconds; t += timeStep) {
    timeMarkers.push(t);
  }
  if (!timeMarkers.includes(totalSeconds) && totalSeconds > 1) {
    timeMarkers.push(totalSeconds);
  }

  return (
    <div className="results-container animate-fadeIn">
      <div className="results-header">
        <h2>Test Results</h2>
        <p className="text-muted text-center">Excellent effort! Keep practicing to improve.</p>
      </div>

      <div className="results-summary-grid">
        {/* WPM Card */}
        <div className="stat-card glass-panel wpm-highlight">
          <div className="stat-icon-wrapper">
            <Award className="stat-icon" />
          </div>
          <div className="stat-info">
            <span className="stat-label">wpm</span>
            <span className="stat-value glow-text">{wpm}</span>
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Percent className="stat-icon text-accent" />
          </div>
          <div className="stat-info">
            <span className="stat-label">accuracy</span>
            <span className="stat-value">{accuracy}%</span>
          </div>
        </div>

        {/* Errors Card */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <AlertCircle className="stat-icon text-incorrect" />
          </div>
          <div className="stat-info">
            <span className="stat-label">errors</span>
            <span className="stat-value">{errors}</span>
          </div>
        </div>

        {/* Time Card */}
        <div className="stat-card glass-panel">
          <div className="stat-icon-wrapper">
            <Clock className="stat-icon text-muted" />
          </div>
          <div className="stat-info">
            <span className="stat-label">time</span>
            <span className="stat-value">{timeElapsed}s</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Section */}
      <div className="results-chart-container glass-panel">
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot wpm-dot"></span>
            <span>wpm</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot raw-dot"></span>
            <span>raw wpm</span>
          </div>
          <div className="legend-item">
            <span className="legend-cross">×</span>
            <span>errors</span>
          </div>
        </div>

        <div className="svg-wrapper">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="telemetry-chart">
            {/* Gridlines & Y-Axis Labels */}
            {gridLines.map((val, idx) => {
              const y = getY(val);
              return (
                <g key={`grid-${idx}`} className="chart-grid-group">
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={svgWidth - padding.right}
                    y2={y}
                    className="grid-line"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    className="grid-text y-label"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* X-Axis labels */}
            {timeMarkers.map((t, idx) => {
              const x = getX(t);
              return (
                <text
                  key={`x-label-${idx}`}
                  x={x}
                  y={svgHeight - 10}
                  className="grid-text x-label"
                  textAnchor="middle"
                >
                  {t}s
                </text>
              );
            })}

            {/* WPM Area under curve (gradient style) */}
            {telemetry.length > 1 && (
              <path
                d={`M ${getX(1)} ${getY(0)} 
                   L ${wpmPoints} 
                   L ${getX(totalSeconds)} ${getY(0)} Z`}
                className="chart-area-wpm"
              />
            )}

            {/* Raw WPM Line */}
            {telemetry.length > 1 && (
              <polyline
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={rawPoints}
              />
            )}

            {/* WPM Line */}
            {telemetry.length > 1 && (
              <polyline
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="3"
                points={wpmPoints}
              />
            )}

            {/* Error Markers */}
            {chartData.map((d, idx) => {
              if (d.errors > 0) {
                const x = getX(d.second);
                // Plot error marks at the bottom of the chart
                const y = getY(0) - 10;
                return (
                  <g key={`err-${idx}`}>
                    <text
                      x={x}
                      y={y}
                      fill="var(--incorrect-color)"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      ×
                    </text>
                  </g>
                );
              }
              return null;
            })}
          </svg>
        </div>
      </div>

      <div className="results-metrics-footer">
        <div className="metrics-box text-muted">
          <span>Raw Speed: <b>{rawWpm} WPM</b></span>
          <span className="divider-dot">•</span>
          <span>Consistency Accuracy: <b>{accuracy}%</b></span>
        </div>
      </div>

      {/* Action triggers */}
      <div className="results-actions">
        <button className="btn-primary" onClick={onRestart}>
          <RotateCcw size={18} />
          <span>Restart Test</span>
        </button>

        <button className="btn-primary" onClick={onNextTest}>
          <span>Next Text</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
