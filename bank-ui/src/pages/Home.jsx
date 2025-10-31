import React, { useState, useEffect } from 'react';
import { Shield, QrCode, Zap, Activity, Database, Brain, Bell, CheckCircle, Smartphone, Scan, ArrowRight, Server, GitBranch, Layers, Lock, Eye, TrendingUp, Users, Clock, Code, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [activeFlow, setActiveFlow] = useState(0);
  const [activeTab, setActiveTab] = useState('qr');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % 8);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const flowSteps = [
    { step: 1, title: 'User Login', component: 'Bank (React)', icon: Users, color: 'blue' },
    { step: 2, title: 'Payment Initiated', component: 'Bank (React)', icon: QrCode, color: 'blue' },
    { step: 3, title: 'Transaction Created', component: 'CBS (Spring Boot)', icon: Server, color: 'green' },
    { step: 4, title: 'Kafka: txn-topic', component: 'Message Broker', icon: GitBranch, color: 'purple' },
    { step: 5, title: 'Data Enrichment', component: 'AIES (Spring Boot)', icon: Database, color: 'orange' },
    { step: 6, title: 'ML Prediction', component: 'ML Model (Python)', icon: Brain, color: 'pink' },
    { step: 7, title: 'Fraud Alert', component: 'AIES → CBS', icon: Bell, color: 'red' },
    { step: 8, title: 'SSE Notification', component: 'Real-time Update', icon: Zap, color: 'yellow' }
  ];

  const services = [
    {
      name: 'Bank (Frontend)',
      tech: 'React 19 + Vite + Tailwind',
      port: '5173',
      icon: Smartphone,
      color: 'blue',
      features: ['Customer Login', 'QR Payments', 'Transaction Dashboard', 'Real-time Alerts']
    },
    {
      name: 'CBS',
      tech: 'Spring Boot 3.5.6 + MySQL',
      port: '8080',
      icon: Server,
      color: 'green',
      features: ['Account Management', 'Transaction Processing', 'Event Publishing', 'SSE Notifications']
    },
    {
      name: 'AIES',
      tech: 'Spring Boot 3.5.6 + MySQL',
      port: '8081',
      icon: Database,
      color: 'orange',
      features: ['Data Enrichment', 'Historical Analysis', 'ML Coordination', 'Fraud Flagging']
    },
    {
      name: 'ML Model',
      tech: 'Python + scikit-learn',
      port: 'N/A',
      icon: Brain,
      color: 'pink',
      features: ['Random Forest Classifier', 'Feature Extraction', 'Pattern Recognition', 'Fraud Prediction']
    }
  ];

  const kafkaTopics = [
    { name: 'txn-topic', from: 'CBS', to: 'AIES', purpose: 'New Transactions' },
    { name: 'model-txn', from: 'AIES', to: 'ML Model', purpose: 'Enriched Transactions' },
    { name: 'model-resp-txn', from: 'ML Model', to: 'AIES', purpose: 'Fraud Predictions' },
    { name: 'notification-prod', from: 'AIES', to: 'CBS', purpose: 'Fraud Alerts' }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-600', bgLight: 'bg-blue-100', ring: 'ring-blue-300' },
    green: { bg: 'bg-green-500', border: 'border-green-200', text: 'text-green-600', bgLight: 'bg-green-100', ring: 'ring-green-300' },
    purple: { bg: 'bg-purple-500', border: 'border-purple-200', text: 'text-purple-600', bgLight: 'bg-purple-100', ring: 'ring-purple-300' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-200', text: 'text-orange-600', bgLight: 'bg-orange-100', ring: 'ring-orange-300' },
    pink: { bg: 'bg-pink-500', border: 'border-pink-200', text: 'text-pink-600', bgLight: 'bg-pink-100', ring: 'ring-pink-300' },
    red: { bg: 'bg-red-500', border: 'border-red-200', text: 'text-red-600', bgLight: 'bg-red-100', ring: 'ring-red-300' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-200', text: 'text-yellow-600', bgLight: 'bg-yellow-100', ring: 'ring-yellow-300' }
  };

  return (
    <div className="bg-gray-50 text-gray-900">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Microservices-Based Fraud Detection</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Real-Time Bank Fraud Detection System
          </h1>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Complete banking platform with QR payments, AI-powered fraud detection, and real-time monitoring.
            Built with microservices architecture using Spring Boot, React, and Machine Learning.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {[
              { icon: Zap, label: 'Response Time', value: '<50ms' },
              { icon: Shield, label: 'Accuracy', value: '99.8%' },
              { icon: Activity, label: 'Updates', value: 'Real-Time' },
              { icon: Database, label: 'Architecture', value: 'Scalable' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-cyan-300" />
                  <div className="font-bold text-sm mb-1">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button  className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2">
              <Link to={'/arch'}>Explore Architecture </Link>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition">
              <Link to={'https://github.com/anshbkeai/ccd'}>View On Github </Link>
            </button>
          </div>
        </div>
      </section>

      {/* MICROSERVICES ARCHITECTURE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
              <Layers className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Microservices Architecture</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Four Independent Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Distributed system with React frontend, Spring Boot backends, Python ML service, and Kafka message broker
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              const colors = colorClasses[service.color];
              return (
                <div key={index} className={`bg-white border-2 ${colors.border} rounded-xl p-6 hover:shadow-lg transition`}>
                  <div className={`w-12 h-12 ${colors.bgLight} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.tech}</p>
                  <div className={`text-xs font-mono ${colors.bgLight} px-2 py-1 rounded inline-block mb-4`}>
                    Port: {service.port}
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Kafka Topics */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Apache Kafka Message Broker</h3>
                <p className="text-sm text-gray-600">Real-time event streaming between services</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {kafkaTopics.map((topic, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="font-mono text-sm font-bold text-purple-600 mb-2">{topic.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                    <span className="font-semibold">{topic.from}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{topic.to}</span>
                  </div>
                  <div className="text-xs text-gray-500">{topic.purpose}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRANSACTION FLOW VISUALIZATION */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-4">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">Complete Transaction Flow</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">From Payment to Fraud Detection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how a transaction flows through all services in real-time
            </p>
          </div>

          <div className="relative">
            {/* Flow Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {flowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeFlow === index;
                const colors = colorClasses[step.color];
                
                return (
                  <div key={index} className={`text-center transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 opacity-60'}`}>
                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${isActive ? `ring-4 ring-offset-2 ${colors.ring}` : ''}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="font-bold text-sm mb-1">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.component}</div>
                    <div className="text-xs font-mono text-gray-400 mt-1">Step {step.step}</div>
                  </div>
                );
              })}
            </div>

            {/* Flow Description */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold mb-6">Transaction Processing Steps:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1-2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">User Initiates Payment</h4>
                    <p className="text-sm text-gray-600">Customer logs in with Customer ID, scans QR code, and submits payment with amount and note</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">3-4</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">CBS Creates Transaction</h4>
                    <p className="text-sm text-gray-600">Core Banking Service creates TransactionEvent with UUID, saves to MySQL, and publishes to Kafka txn-topic</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">AIES Enriches Data</h4>
                    <p className="text-sm text-gray-600">Fetches last 10 debit/credit transactions for both debtor and creditor, creates enriched ModelTransaction</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">ML Model Predicts Fraud</h4>
                    <p className="text-sm text-gray-600">Random Forest classifier analyzes patterns, extracts features, and predicts is_fraud with reason</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-sm">7-8</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Alert & Notification</h4>
                    <p className="text-sm text-gray-600">AIES flags transaction in database, publishes to notification-prod, CBS sends SSE alert to frontend dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR PAYMENT FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <QrCode className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">QR Code Payments</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Scan & Pay with QR Codes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple scanning options: webcam, image upload, or Google Lens
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex border-b border-blue-200 mb-6">
              <button
                onClick={() => setActiveTab('qr')}
                className={`px-6 py-3 font-semibold transition ${activeTab === 'qr' ? 'bg-white text-blue-600 rounded-t-lg' : 'text-gray-600'}`}
              >
                <QrCode className="w-5 h-5 inline mr-2" />
                Generate QR
              </button>
              <button
                onClick={() => setActiveTab('scan')}
                className={`px-6 py-3 font-semibold transition ${activeTab === 'scan' ? 'bg-white text-blue-600 rounded-t-lg' : 'text-gray-600'}`}
              >
                <Scan className="w-5 h-5 inline mr-2" />
                Scan Options
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`px-6 py-3 font-semibold transition ${activeTab === 'payment' ? 'bg-white text-blue-600 rounded-t-lg' : 'text-gray-600'}`}
              >
                <Smartphone className="w-5 h-5 inline mr-2" />
                Payment Flow
              </button>
            </div>

            {activeTab === 'qr' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 text-center shadow-md">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-32 h-32 text-blue-500" />
                  </div>
                  <div className="font-mono text-xs text-gray-500 bg-gray-50 rounded px-3 py-2 inline-block">
                    /topay?account_id=CUST123&scheme=CUSTOMER-ID
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Personal QR Code</h3>
                  <p className="text-gray-600">Each customer gets a unique QR code generated using qrcode.react</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Encodes payment URL with account ID and scheme</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Display on dashboard for receiving payments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <span className="text-sm">Share via screenshot or print for local stores</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'scan' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold mb-2">Webcam Scanning</h4>
                    <p className="text-sm text-gray-600 mb-3">Real-time camera scanning using html5-qrcode</p>
                    <div className="text-xs text-gray-500">Live detection • Auto-focus</div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Smartphone className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold mb-2">Image Upload</h4>
                    <p className="text-sm text-gray-600 mb-3">Upload QR images from gallery using jsQR</p>
                    <div className="text-xs text-gray-500">JPEG/PNG • Batch processing</div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <Scan className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-bold mb-2">Google Lens</h4>
                    <p className="text-sm text-gray-600 mb-3">Scan QR codes from anywhere - stores, screens, receipts</p>
                    <div className="text-xs text-gray-500">Universal • Cross-platform</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['html5-qrcode', 'jsQR', 'react-webcam', 'qrcode.react'].map((tech, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">From Account</label>
                      <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm font-mono">CUST123</div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">To Account (Auto-filled)</label>
                      <div className="bg-green-50 rounded-lg px-4 py-3 text-sm font-mono">CUST456</div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Amount</label>
                      <input type="text" placeholder="₹ 1,000.00" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 block mb-2">Note (Optional)</label>
                      <input type="text" placeholder="Payment for services" className="w-full border-2 border-gray-300 rounded-lg px-4 py-3" />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition">
                      Pay Now
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">API Request Flow</h3>
                  <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-xs overflow-x-auto">
                    <div>POST /dummy/pay</div>
                    <div className="text-gray-500 mt-2">{'{'}</div>
                    <div className="ml-4 text-yellow-300">"fromAccount": {'{'}</div>
                    <div className="ml-8">"id": "CUST123",</div>
                    <div className="ml-8">"scheme": "CUSTOMER-ID"</div>
                    <div className="ml-4 text-yellow-300">{'}'},</div>
                    <div className="ml-4 text-yellow-300">"toAccount": {'{'}</div>
                    <div className="ml-8">"id": "CUST456",</div>
                    <div className="ml-8">"scheme": "CUSTOMER-ID"</div>
                    <div className="ml-4 text-yellow-300">{'}'}</div>
                    <div className="ml-4">"amount": 1000,</div>
                    <div className="ml-4">"note": "Payment"</div>
                    <div className="text-gray-500">{'}'}</div>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span>CBS creates transaction UUID</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span>Saves to MySQL database</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span>Publishes to Kafka txn-topic</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                      <span>Returns transaction status</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BANK DASHBOARD */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
                <Bell className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">Bank Monitoring Dashboard</span>
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                Real-Time Fraud Alerts via SSE
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Server-Sent Events push fraud notifications instantly from CBS to the bank dashboard with complete transaction details.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-md">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-600" />
                    Live SSE Connection
                  </h4>
                  <p className="text-sm text-gray-600">Connects to CBS endpoint for real-time fraud alerts</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">GET /sse/alerts</code>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500 shadow-md">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Flagged Transactions Table
                  </h4>
                  <p className="text-sm text-gray-600">Paginated view of all suspicious transactions with details</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">GET /dummy/bank/flagged?page=0&size=10</code>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-md">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-600" />
                    Transaction Details Drawer
                  </h4>
                  <p className="text-sm text-gray-600">Click any transaction to view full debtor/creditor info with "Mark as Safe" action</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Fraud Alert Dashboard</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      Live SSE
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {[
                    { id: 'TXN-8521', from: 'ACC-7734', to: 'ACC-9021', amount: '₹25,000', risk: 'High', reason: 'Unusual amount', time: '2 min ago' },
                    { id: 'TXN-8520', from: 'ACC-5512', to: 'ACC-3390', amount: '₹15,800', risk: 'Medium', reason: 'New recipient', time: '5 min ago' },
                    { id: 'TXN-8519', from: 'ACC-2289', to: 'ACC-6677', amount: '₹8,500', risk: 'High', reason: 'Multiple txns', time: '8 min ago' }
                  ].map((txn, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-red-300 transition cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-semibold">{txn.id}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          txn.risk === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {txn.risk} Risk
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {txn.from} → {txn.to}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{txn.amount}</span>
                        <span className="text-xs text-gray-500">{txn.time}</span>
                      </div>
                      <div className="text-xs text-red-600 mt-2">⚠️ {txn.reason}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl px-4 py-3 text-white shadow-xl">
                <div className="text-2xl font-bold">99.8%</div>
                <div className="text-xs">Detection Rate</div>
              </div>

              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl px-4 py-3 text-white shadow-xl">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-100 rounded-full px-4 py-2 mb-4">
              <Code className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-600">Technology Stack</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">Built With Modern Technologies</h2>
            <p className="text-xl text-gray-600">Production-ready stack for reliability, scalability, and performance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <Smartphone className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-lg mb-3">Frontend</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• React 19 + Vite 7</li>
                <li>• Tailwind CSS 4</li>
                <li>• React Router 7</li>
                <li>• Lucide React Icons</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <Server className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="font-bold text-lg mb-3">Backend</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Spring Boot 3.5.6</li>
                <li>• Java 21</li>
                <li>• Spring Data JPA</li>
                <li>• Lombok</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-xl p-6 border border-pink-200">
              <Brain className="w-10 h-10 text-pink-600 mb-4" />
              <h3 className="font-bold text-lg mb-3">ML Service</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Python 3</li>
                <li>• scikit-learn</li>
                <li>• pandas & numpy</li>
                <li>• pytest</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <Database className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="font-bold text-lg mb-3">Infrastructure</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Apache Kafka 7.6.0</li>
                <li>• MySQL 8.0+</li>
                <li>• Docker Compose</li>
                <li>• Zookeeper</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <QrCode className="w-8 h-8" />
              QR Code Libraries
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Generation</h4>
                <div className="space-y-2">
                  <div className="bg-white/10 rounded-lg px-4 py-3">
                    <code className="text-cyan-300">qrcode.react</code>
                    <p className="text-xs text-gray-400 mt-1">Generate personal QR codes for receiving payments</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Scanning</h4>
                <div className="space-y-2">
                  <div className="bg-white/10 rounded-lg px-4 py-3">
                    <code className="text-green-300">html5-qrcode</code>
                    <p className="text-xs text-gray-400 mt-1">Real-time webcam scanning</p>
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-3">
                    <code className="text-yellow-300">jsQR</code>
                    <p className="text-xs text-gray-400 mt-1">Image upload processing</p>
                  </div>
                  <div className="bg-white/10 rounded-lg px-4 py-3">
                    <code className="text-purple-300">react-webcam</code>
                    <p className="text-xs text-gray-400 mt-1">Camera component integration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API ENDPOINTS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">REST API Endpoints</h2>
            <p className="text-xl text-gray-600">Core Banking Service (CBS) REST APIs</p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-mono font-bold mr-3">GET</span>
                  <code className="text-lg font-mono">/dummy/{'{id}'}</code>
                </div>
              </div>
              <p className="text-sm text-gray-600">Fetch customer account details by Customer ID</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-green-500 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-mono font-bold mr-3">GET</span>
                  <code className="text-lg font-mono">/dummy/{'{id}'}/last10txn</code>
                </div>
              </div>
              <p className="text-sm text-gray-600">Get last 10 transactions for an account (credit and debit)</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-purple-500 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-mono font-bold mr-3">POST</span>
                  <code className="text-lg font-mono">/dummy/pay</code>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Initiate payment transaction between accounts</p>
              <div className="bg-gray-50 rounded p-3 text-xs font-mono overflow-x-auto">
                <div>{'{'} "fromAccount": {'{'} "id": "CUST123", "scheme": "CUSTOMER-ID" {'}'},</div>
                <div>  "toAccount": {'{'} "id": "CUST456", "scheme": "CUSTOMER-ID" {'}'},</div>
                <div>  "amount": 1000, "note": "Payment" {'}'}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-mono font-bold mr-3">GET</span>
                  <code className="text-lg font-mono">/dummy/bank/flagged?page=0&size=10</code>
                </div>
              </div>
              <p className="text-sm text-gray-600">Paginated list of flagged/fraudulent transactions for bank dashboard</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm font-mono font-bold mr-3">SSE</span>
                  <code className="text-lg font-mono">/sse/alerts</code>
                </div>
              </div>
              <p className="text-sm text-gray-600">Server-Sent Events endpoint for real-time fraud alert notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Own?
          </h2>
          
          
          

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Lock, label: 'Secure' },
              { icon: Zap, label: 'Fast' },
              { icon: Code, label: 'Open Source' },
              { icon: TrendingUp, label: 'Scalable' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-semibold">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
                <Shield className="w-6 h-6" />
                FraudDetect
              </div>
              <p className="text-sm">Real-time fraud detection with microservices architecture.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white cursor-pointer transition">Bank Frontend</div>
                <div className="hover:text-white cursor-pointer transition">CBS Service</div>
                <div className="hover:text-white cursor-pointer transition">AIES Service</div>
                <div className="hover:text-white cursor-pointer transition">ML Model</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Technology</h4>
              <div className="space-y-2 text-sm">
                <div className="hover:text-white cursor-pointer transition">React + Spring Boot</div>
                <div className="hover:text-white cursor-pointer transition">Apache Kafka</div>
                <div className="hover:text-white cursor-pointer transition">MySQL Database</div>
                <div className="hover:text-white cursor-pointer transition">Python ML</div>
              </div>
            </div>
            
            
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            <p>© 2025 Bank Fraud Detection System. Built with React, Spring Boot, Kafka & Python ML.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}