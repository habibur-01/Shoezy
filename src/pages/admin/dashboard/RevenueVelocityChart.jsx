import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

/**
 * Generate smooth cubic Bezier curve path through a list of points
 */
function getSmoothCurvePath(points) {
  if (!points || points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

export const RevenueVelocityChart = ({
  chartRange = "Today",
  setChartRange,
  chartData = [],
  revenueTrend,
  isLoading = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Available tabs matching user requirements: Today, This Week, This Month, 90D
  const TABS = [
    { id: "Today", label: "Today" },
    { id: "This Week", label: "This Week" },
    { id: "This Month", label: "This Month" },
    { id: "90D", label: "90D" },
  ];

  // Quantitative summary values
  const totalRevenue = chartData.reduce(
    (acc, curr) => acc + (Number(curr.revenue) || 0),
    0,
  );
  const totalOrders = chartData.reduce(
    (acc, curr) => acc + (Number(curr.orders) || 0),
    0,
  );

  const windowRevenueFormatted = revenueTrend?.windowRevenue?.formatted
    ? revenueTrend.windowRevenue.formatted
    : `$${totalRevenue.toLocaleString()}`;

  const totalOrdersFormatted =
    revenueTrend?.totalOrders !== undefined
      ? revenueTrend.totalOrders
      : revenueTrend?.completedOrders !== undefined
        ? revenueTrend.completedOrders
        : totalOrders;

  const fulfilledOrdersFormatted =
    revenueTrend?.fulfilledOrders !== undefined
      ? revenueTrend.fulfilledOrders
      : null;

  const avgBasketFormatted = revenueTrend?.avgBasketValue?.formatted
    ? revenueTrend.avgBasketValue.formatted
    : `$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}`;

  // SVG Geometry Dimensions
  const svgWidth = 800;
  const svgHeight = 290;
  const marginLeft = 52;
  const marginRight = 44;
  const marginTop = 52;
  const marginBottom = 36;

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;
  const bottomY = marginTop + chartHeight;

  // Compute scale maximums with clean visual headroom
  const rawMaxRev = Math.max(
    ...chartData.map((d) => Number(d.revenue) || 0),
    100,
  );
  const maxRevenueScale = useMemo(() => {
    if (rawMaxRev <= 500) return 600;
    if (rawMaxRev <= 1000) return 1200;
    if (rawMaxRev <= 3000) return 4000;
    if (rawMaxRev <= 6000) return 8000;
    if (rawMaxRev <= 10000) return 12000;
    return Math.ceil((rawMaxRev * 1.25) / 2000) * 2000;
  }, [rawMaxRev]);

  const rawMaxOrders = Math.max(
    ...chartData.map((d) => Number(d.orders) || 0),
    10,
  );
  const maxOrdersScale = useMemo(() => {
    if (rawMaxOrders <= 20) return 25;
    if (rawMaxOrders <= 40) return 40;
    if (rawMaxOrders <= 80) return 100;
    return Math.ceil((rawMaxOrders * 1.25) / 10) * 10;
  }, [rawMaxOrders]);

  // Generate 2D coordinates for Revenue and Orders
  const points = useMemo(() => {
    const N = Math.max(1, chartData.length);
    return chartData.map((d, i) => {
      const x = marginLeft + (i / Math.max(1, N - 1)) * chartWidth;
      const rev = Number(d.revenue) || 0;
      const ord = Number(d.orders) || 0;

      const revY = bottomY - (rev / maxRevenueScale) * chartHeight;
      const ordY = bottomY - (ord / maxOrdersScale) * chartHeight;

      return {
        x,
        revY: Math.max(marginTop - 10, Math.min(bottomY, revY)),
        ordY: Math.max(marginTop - 10, Math.min(bottomY, ordY)),
        revenue: rev,
        orders: ord,
        label: d.label,
      };
    });
  }, [
    chartData,
    marginLeft,
    chartWidth,
    maxRevenueScale,
    maxOrdersScale,
    bottomY,
    chartHeight,
    marginTop,
  ]);

  // Smooth Area Paths
  const revenuePoints = points.map((p) => ({ x: p.x, y: p.revY }));
  const ordersPoints = points.map((p) => ({ x: p.x, y: p.ordY }));

  const revenueLinePath = getSmoothCurvePath(revenuePoints);
  const ordersLinePath = getSmoothCurvePath(ordersPoints);

  const revenueAreaPath =
    revenuePoints.length > 0
      ? `${revenueLinePath} L ${revenuePoints[revenuePoints.length - 1].x.toFixed(1)},${bottomY} L ${revenuePoints[0].x.toFixed(1)},${bottomY} Z`
      : "";

  const ordersAreaPath =
    ordersPoints.length > 0
      ? `${ordersLinePath} L ${ordersPoints[ordersPoints.length - 1].x.toFixed(1)},${bottomY} L ${ordersPoints[0].x.toFixed(1)},${bottomY} Z`
      : "";

  // Identify default peak index (highest revenue checkpoint)
  const peakIndex = useMemo(() => {
    if (points.length === 0) return 0;
    let maxIdx = 0;
    let maxVal = -1;
    points.forEach((p, idx) => {
      if (p.revenue > maxVal) {
        maxVal = p.revenue;
        maxIdx = idx;
      }
    });
    return maxIdx;
  }, [points]);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : peakIndex;
  const activePoint = points[activeIndex] || points[0] || null;

  // Format currency for badge pill (e.g. $5.6K or $850)
  const formatRevBadge = (val) => {
    if (val >= 1000) {
      const k = val / 1000;
      return `$${k >= 10 ? k.toFixed(0) : k.toFixed(1)}K`;
    }
    return `$${val}`;
  };

  // Format Y-axis ticks
  const formatYRev = (val) => {
    if (val === 0) return "0";
    if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
    return `${val}`;
  };

  const handleMouseMove = (e) => {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = svgWidth / rect.width;
    const mouseSvgX = clientX * scaleX;

    let nearestIdx = 0;
    let minDist = Infinity;
    points.forEach((p, idx) => {
      const dist = Math.abs(p.x - mouseSvgX);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = idx;
      }
    });

    setHoveredIndex(nearestIdx);
  };

  return (
    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
      {/* Top Header & Interactive Tabs / Legends */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4 border-b border-zinc-100">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            Revenue & Sales Velocity
          </h3>
          <p className="text-xs text-zinc-500">
            Gross sales volume over selected period
          </p>
        </div>
        {/* Left: Timeframe Tabs matching user screenshot */}
        <div className="flex items-center gap-2">
          {TABS.map((tab) => {
            const isActive = chartRange === tab.id || chartRange === tab.label;
            return (
              <button
                key={tab.id}
                id={`btn-tab-${tab.id.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setChartRange(tab.id)}
                disabled={isLoading}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? "border-orange-400 dark:border-orange-500/80 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 mb-4">
        {/* Summary metric banner */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-3.5 bg-zinc-50/80 dark:bg-zinc-800/40 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
            Window Revenue
          </div>
          <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
            {windowRevenueFormatted}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
            Total Orders
          </div>
          <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
            {totalOrdersFormatted}
          </div>
          {fulfilledOrdersFormatted !== null && (
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              {fulfilledOrdersFormatted} fulfilled
            </div>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
            Avg Basket Value
          </div>
          <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
            {avgBasketFormatted}
          </div>
        </div>
      </div> */}
        {/* Right: Legends matching user screenshot */}
        <div className="flex items-center gap-4 justify-end flex-1">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span className="w-3.5 h-0.5 rounded-full bg-[#f97316]" />
            <span>Revenue ($)</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            <span className="w-3.5 h-0.5 rounded-full bg-[#10b981]" />
            <span>Orders</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Area Chart Canvas */}
      <div
        className="relative w-full overflow-hidden select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[340px] overflow-visible"
        >
          <defs>
            {/* Revenue Warm Orange Gradient */}
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#f97316" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </linearGradient>

            {/* Orders Soft Emerald Gradient */}
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
              <stop offset="80%" stopColor="#10b981" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Dual Y-Axis Labels */}
          {[0, 1, 2, 3, 4].map((step) => {
            const y = bottomY - (step / 4) * chartHeight;
            const revTick = Math.round((step / 4) * maxRevenueScale);
            const ordTick = Math.round((step / 4) * maxOrdersScale);

            return (
              <g key={step} className="transition-all">
                {/* Horizontal Gridline */}
                <line
                  x1={marginLeft}
                  y1={y}
                  x2={svgWidth - marginRight}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray={step === 0 ? "none" : "2 2"}
                  className="text-zinc-200/80 dark:text-zinc-800"
                />

                {/* Left Y Axis Tick Label (Revenue) */}
                <text
                  x={marginLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="11"
                  fontFamily="monospace"
                  className="fill-zinc-400 dark:fill-zinc-500 font-medium"
                >
                  {formatYRev(revTick)}
                </text>

                {/* Right Y Axis Tick Label (Orders) */}
                <text
                  x={svgWidth - marginRight + 8}
                  y={y + 3.5}
                  textAnchor="start"
                  fontSize="11"
                  fontFamily="monospace"
                  className="fill-zinc-400 dark:fill-zinc-500 font-medium"
                >
                  {ordTick}
                </text>
              </g>
            );
          })}

          {/* Orders Area Fill */}
          {ordersAreaPath && (
            <path
              d={ordersAreaPath}
              fill="url(#ordersGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* Revenue Area Fill */}
          {revenueAreaPath && (
            <path
              d={revenueAreaPath}
              fill="url(#revenueGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* Orders Stroke Line */}
          {ordersLinePath && (
            <path
              d={ordersLinePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* Revenue Stroke Line */}
          {revenueLinePath && (
            <path
              d={revenueLinePath}
              fill="none"
              stroke="#f97316"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* Active Checkpoint Vertical Dashed Guide & Badges */}
          {activePoint && (
            <g className="transition-all duration-150 ease-out">
              {/* Vertical Dashed Guide Line */}
              <line
                x1={activePoint.x}
                y1={marginTop - 8}
                x2={activePoint.x}
                y2={bottomY}
                stroke="#94a3b8"
                strokeWidth="1.2"
                strokeDasharray="3 3"
                className="opacity-80"
              />

              {/* Revenue Dot & Pill Badge */}
              <g>
                <circle
                  cx={activePoint.x}
                  cy={activePoint.revY}
                  r="4.5"
                  fill="#f97316"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="shadow-md"
                />

                {/* Orange Pill for Revenue */}
                <g
                  transform={`translate(${activePoint.x - 30}, ${Math.max(
                    6,
                    activePoint.revY - 32,
                  )})`}
                >
                  <rect
                    width="60"
                    height="22"
                    rx="6"
                    fill="#f97316"
                    className="shadow-lg"
                  />
                  <text
                    x="30"
                    y="15"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {formatRevBadge(activePoint.revenue)}
                  </text>
                </g>
              </g>

              {/* Orders Dot & Pill Badge */}
              <g>
                <circle
                  cx={activePoint.x}
                  cy={activePoint.ordY}
                  r="4.5"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="shadow-md"
                />

                {/* Green Pill for Orders */}
                <g
                  transform={`translate(${activePoint.x - 20}, ${
                    activePoint.ordY >= activePoint.revY - 30 &&
                    activePoint.ordY <= activePoint.revY + 30
                      ? Math.min(bottomY - 26, activePoint.ordY + 12)
                      : Math.max(marginTop, activePoint.ordY - 28)
                  })`}
                >
                  <rect
                    width="40"
                    height="20"
                    rx="5"
                    fill="#10b981"
                    className="shadow-lg"
                  />
                  <text
                    x="20"
                    y="14"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {activePoint.orders}
                  </text>
                </g>
              </g>
            </g>
          )}

          {/* Bottom X-Axis Checkpoint Time Labels */}
          {points.map((p, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <text
                key={idx}
                x={p.x}
                y={bottomY + 20}
                textAnchor="middle"
                fontSize="11"
                className={`transition-colors font-medium ${
                  isCurrent
                    ? "fill-zinc-900 dark:fill-zinc-100 font-bold"
                    : "fill-zinc-500 dark:fill-zinc-400"
                }`}
              >
                {p.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
