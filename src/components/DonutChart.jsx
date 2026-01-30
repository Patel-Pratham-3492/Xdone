export default function DonutChart({ completed, total, color }) {
  // radius and stroke will scale with container
  const size = 200; // base size (desktop)
  const stroke = 14;

  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = total === 0 ? 0 : completed / total;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="donut-wrapper">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
      >
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            transition: "stroke-dashoffset 0.6s ease"
          }}
        />

        {/* Text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={size / 6}
          fill="#0f172a"
          fontWeight="600"
        >
          {completed}/{total}
        </text>
      </svg>
    </div>
  );
}
