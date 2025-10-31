import { useState } from "react";

export default function Architecture() {
  const [showLegend, setShowLegend] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">
            Bank Fraud Detection Architecture
          </h1>
          <a
            href="/"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            ← Back to Home
          </a>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">System Overview</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This architecture illustrates the complete end-to-end workflow for
            fraud detection using <strong>microservices, Kafka, ML,</strong> and{" "}
            <strong>AWS infrastructure.</strong>
          </p>
        </div>

        {/* Architecture Image */}
        <div className="relative flex justify-center">
          <div className="overflow-auto max-h-[85vh] bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            <img
              src="/assets/architecture-diagram.png"
              alt="Bank Fraud Detection System Architecture"
              className="w-full h-auto rounded-lg hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Floating Legend Panel */}
          <div
            className={`hidden lg:block fixed top-24 right-8 w-72 bg-white shadow-xl border border-gray-200 rounded-xl p-5 transition-all duration-500 ${
              showLegend ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <h3 className="font-bold text-lg text-indigo-700 mb-3">
              🧭 Architecture Legend
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                <span className="font-semibold text-indigo-600">AWS ECR:</span>{" "}
                Stores Docker images deployed via Jenkins pipelines.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">EC2:</span>{" "}
                Hosts backend services like Core Banking, AIES, and Kafka.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Kafka:</span>{" "}
                Real-time transaction stream between services.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Lambda:</span>{" "}
                Automates fraud report generation and uploads to S3.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">RDS (MySQL):</span>{" "}
                Stores transactional and flagged data.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Prometheus + Grafana:</span>{" "}
                Metrics and performance monitoring layer.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Elastic Stack:</span>{" "}
                Centralized logging with Logstash, Elasticsearch, and Kibana.
              </li>
              <li>
                <span className="font-semibold text-indigo-600">Frontend (React/Nginx):</span>{" "}
                User interface for bank staff and customers.
              </li>
            </ul>
          </div>
        </div>

        {/* Toggle Legend Button for Mobile */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="fixed bottom-6 right-6 lg:hidden bg-indigo-600 text-white rounded-full p-3 shadow-lg"
        >
          {showLegend ? "Hide Legend" : "Show Legend"}
        </button>

        {/* Layers Section */}
        <section className="mt-20 text-center">
          <h3 className="text-2xl font-semibold mb-6">Key Layers</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <h4 className="font-semibold text-indigo-700 mb-2">User Layer</h4>
              <p className="text-gray-600 text-sm">
                The React-based frontend hosted on Nginx provides a secure
                payment interface for users and staff.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <h4 className="font-semibold text-indigo-700 mb-2">
                Private Services Layer
              </h4>
              <p className="text-gray-600 text-sm">
                Includes Core Banking, AI Evaluation, and ML Fraud Detection
                services connected through Kafka.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <h4 className="font-semibold text-indigo-700 mb-2">
                DevOps & Storage Layer
              </h4>
              <p className="text-gray-600 text-sm">
                CI/CD pipelines with Jenkins, Docker, and ECR, along with AWS
                RDS, S3, and monitoring via Grafana + Prometheus.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-16 text-center">
        <p>© 2025 Bank Fraud Detection System • Built with React + TailwindCSS</p>
      </footer>
    </div>
  );
}
