import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Keypair } from '@solana/web3.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Service {
  serviceId: string;
  owner: string;
  url: string;
  priceUSDC: string;
  description: string;
  successCount: string;
  failureCount: string;
  publicKey: string;
}

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientPrivateKey, setClientPrivateKey] = useState<string>('');
  const [registerForm, setRegisterForm] = useState({
    serviceId: '',
    url: '',
    priceUSDC: '',
    description: '',
    ownerPrivateKey: '',
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/list`);
      setServices(response.data.endpoints || []);
    } catch (err: any) {
      console.error('Failed to load services:', err);
    }
  };

  const generateKeypair = () => {
    const keypair = Keypair.generate();
    const privateKey = JSON.stringify(Array.from(keypair.secretKey));
    setClientPrivateKey(privateKey);
    return privateKey;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/register`, registerForm);
      alert(`Service registered! TX: ${response.data.transaction}`);
      setRegisterForm({
        serviceId: '',
        url: '',
        priceUSDC: '',
        description: '',
        ownerPrivateKey: '',
      });
      loadServices();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUseService = async () => {
    if (!selectedService || !clientPrivateKey) {
      setError('Please select a service and provide client private key');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/api/use`, {
        serviceId: selectedService.serviceId,
        requestData: {
          method: 'GET',
        },
        clientPrivateKey,
      });

      setResult(response.data);
      loadServices(); // Refresh to get updated trust metrics
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Service call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🚀 x402 Agent Service Marketplace & Router</h1>
      <p>Register and use paid API services with x402 payments on Solana</p>

      <h2>Register New Service</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Service ID (unique identifier)"
          value={registerForm.serviceId}
          onChange={(e) => setRegisterForm({ ...registerForm, serviceId: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Service URL (must support x402)"
          value={registerForm.url}
          onChange={(e) => setRegisterForm({ ...registerForm, url: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price in USDC (e.g., 1000000 for $1)"
          value={registerForm.priceUSDC}
          onChange={(e) => setRegisterForm({ ...registerForm, priceUSDC: e.target.value })}
          required
        />
        <textarea
          placeholder="Service description"
          value={registerForm.description}
          onChange={(e) => setRegisterForm({ ...registerForm, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Owner Private Key (JSON array)"
          value={registerForm.ownerPrivateKey}
          onChange={(e) => setRegisterForm({ ...registerForm, ownerPrivateKey: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Service'}
        </button>
      </form>

      <h2>Available Services</h2>
      <button onClick={loadServices} style={{ marginBottom: '15px' }}>
        Refresh List
      </button>

      {services.length === 0 ? (
        <p>No services registered yet.</p>
      ) : (
        services.map((service) => (
          <div
            key={service.serviceId}
            className={`service-card ${selectedService?.serviceId === service.serviceId ? 'selected' : ''}`}
            onClick={() => setSelectedService(service)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{service.serviceId}</h3>
            <p><strong>URL:</strong> {service.url}</p>
            <p><strong>Description:</strong> {service.description}</p>
            <p><strong>Price:</strong> {Number(service.priceUSDC) / 1_000_000} USDC</p>
            <div className="metrics">
              <div className="metric">
                <span className="success">✓</span>
                <span>Success: {service.successCount}</span>
              </div>
              <div className="metric">
                <span className="failure">✗</span>
                <span>Failure: {service.failureCount}</span>
              </div>
            </div>
          </div>
        ))
      )}

      {selectedService && (
        <div style={{ marginTop: '30px' }}>
          <h2>Use Service: {selectedService.serviceId}</h2>
          <div style={{ marginBottom: '15px' }}>
            <label>
              Client Private Key (JSON array):
              <input
                type="text"
                value={clientPrivateKey}
                onChange={(e) => setClientPrivateKey(e.target.value)}
                placeholder="Paste private key or generate new"
              />
            </label>
            <button
              onClick={() => generateKeypair()}
              style={{ marginLeft: '10px', background: '#10b981' }}
            >
              Generate New Keypair
            </button>
          </div>
          <button onClick={handleUseService} disabled={loading || !clientPrivateKey}>
            {loading ? 'Processing...' : 'Call Service (x402 Payment)'}
          </button>
        </div>
      )}

      {error && <div className="error">Error: {error}</div>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          {result.paymentTx && (
            <div className="success-message">
              <strong>Payment Transaction:</strong>{' '}
              <a
                href={`https://solscan.io/tx/${result.paymentTx}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                {result.paymentTx}
              </a>
            </div>
          )}
          {result.trustMetrics && (
            <div style={{ marginTop: '10px' }}>
              <strong>Updated Trust Metrics:</strong>
              <div className="metrics">
                <div className="metric">
                  <span className="success">✓</span>
                  <span>Success: {result.trustMetrics.successCount}</span>
                </div>
                <div className="metric">
                  <span className="failure">✗</span>
                  <span>Failure: {result.trustMetrics.failureCount}</span>
                </div>
              </div>
            </div>
          )}
          <div className="result-box">
            <pre>{JSON.stringify(result.result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

