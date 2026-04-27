export default function MetricsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Metrics Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Key Metrics</h2>
          <p className="text-gray-600">
            Overview of your health and fitness data.
          </p>
        </div>
        {/* Placeholder for charts and graphs */}
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          Charts and Graphs
        </div>
      </div>
    </div>
  );
}
