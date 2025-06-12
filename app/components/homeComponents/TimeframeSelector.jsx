export default function TimeframeSelector({ activeTimeframe, setActiveTimeframe }) {
  const timeframes = ["Day", "Month", "Year"];

  return (
    <div className="flex justify-center mb-6">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => setActiveTimeframe(timeframe.toLowerCase())}
          className={`px-4 py-2 text-sm font-medium ${
            activeTimeframe === timeframe.toLowerCase()
              ? "text-green-400 border-b-2 border-green-400"
              : "text-gray-400"
          }`}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}