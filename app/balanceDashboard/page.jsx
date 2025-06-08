"use client";

import DonutChart from "./DonutChart"

const sampleData = [
  { name: "A", value: 400 },
  { name: "B", value: 300 },
  { name: "C", value: 300 },
];

export default function BalanceDashboard() {
  return (
    <div>
      <DonutChart data={sampleData} />
    </div>
  );
}
