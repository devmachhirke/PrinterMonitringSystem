'use client';

import { useEffect, useState } from 'react';
import { fetchAiPredictions, fetchMlModels, fetchPrinters, AiPredictionItem, MlModelItem, Printer } from '@/lib/api';
import StatCard from '@/components/StatCard';
import { Brain, Cpu, AlertTriangle, ShieldCheck, Activity, Calendar, Zap, CheckCircle2 } from 'lucide-react';

export default function AiAnalyticsPage() {
  const [predictions, setPredictions] = useState<AiPredictionItem[]>([]);
  const [models, setModels] = useState<MlModelItem[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [predData, modelData, printerData] = await Promise.all([
        fetchAiPredictions(),
        fetchMlModels(),
        fetchPrinters()
      ]);
      setPredictions(predData);
      setModels(modelData);
      setPrinters(printerData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const criticalPredictions = predictions.filter(p => p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          AI Predictive Maintenance &amp; ML Models
        </h1>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '4px' }}>
          Machine learning algorithms forecasting printer failure risks, fuser life, and supply depletion.
        </p>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <StatCard
          title="ACTIVE ML MODELS"
          value={models.length}
          subtitle="Trained inference models"
          icon={Brain}
          iconColor="168, 85, 247"
        />
        <StatCard
          title="PREDICTIVE INSIGHTS"
          value={predictions.length}
          subtitle="Generated forecasting records"
          icon={Cpu}
          iconColor="56, 189, 248"
        />
        <StatCard
          title="HIGH / CRITICAL RISKS"
          value={criticalPredictions.length}
          subtitle="Requires scheduled maintenance"
          icon={AlertTriangle}
          iconColor="244, 63, 94"
        />
        <StatCard
          title="AVERAGE MODEL ACCURACY"
          value={models.length > 0 ? `${(models.reduce((acc, m) => acc + m.accuracy, 0) / models.length).toFixed(1)}%` : '94.6%'}
          subtitle="Validated precision metric"
          icon={ShieldCheck}
          iconColor="16, 185, 129"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* PREDICTIONS LIST PANEL */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#38bdf8" />
            <span>AI Predictive Maintenance Forecasts</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {predictions.map(pred => {
              const isCrit = pred.riskLevel === 'CRITICAL';
              const isHigh = pred.riskLevel === 'HIGH';
              const isMed = pred.riskLevel === 'MEDIUM';

              const badgeBg = isCrit ? 'rgba(244, 63, 94, 0.15)' : isHigh ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)';
              const badgeColor = isCrit ? '#fb7185' : isHigh ? '#fbbf24' : '#38bdf8';

              return (
                <div
                  key={pred.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `4px solid ${badgeColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        {pred.printerName}
                      </h3>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: badgeBg,
                        color: badgeColor
                      }}>
                        {pred.riskLevel} RISK
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={13} color="#a855f7" /> Confidence: <strong style={{ color: '#cbd5e1' }}>{pred.confidence}%</strong>
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                    {pred.predictionValue}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    <span>Model: {pred.modelName || 'PrinterHealthNet v2.4'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Expected: {new Date(pred.predictedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ML MODELS REGISTRY PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={18} color="#a855f7" />
              <span>Registered ML Models</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {models.map(m => (
                <div key={m.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>{m.modelName}</span>
                    <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>{m.accuracy}% Acc</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginBottom: '6px' }}>Algorithm: {m.modelType} (v{m.version})</div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
