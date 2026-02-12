import { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Users,
  TrendingUp,
  Clock,
  Wallet,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  Calculator as CalcIcon,
  Euro,
  Percent,
  FileStack,
  ToggleLeft,
  ToggleRight,
  Scale,
  ShieldCheck,
  BadgePercent,
  FileWarning,
  Archive,
  ExternalLink,
  MessageCircle,
  Shield,
  DollarSign
} from 'lucide-react';

// Animated counter hook
function useAnimatedNumber(value, duration = 500) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const startValue = previousValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        previousValue.current = endValue;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
}

// Format currency
function formatCurrency(value, decimals = 0) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// Format number with thousand separators
function formatNumber(value, decimals = 0) {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

// Format short currency (Mio for millions)
function formatShortCurrency(value) {
  if (value >= 1000000) {
    return (value / 1000000).toLocaleString('de-DE', { maximumFractionDigits: 2 }) + ' Mio. €';
  }
  return formatNumber(value) + ' €';
}

// Main Calculator Component
export default function Calculator() {
  // Input state
  const [isB2B, setIsB2B] = useState(true);
  const [casesPerYear, setCasesPerYear] = useState(120);
  const [avgClaimAmount, setAvgClaimAmount] = useState(2500);
  const [writeOff, setWriteOff] = useState(50000);
  const [margin, setMargin] = useState(4);

  // Constants
  const INTEREST_B2B = 10.73;
  const INTEREST_B2C = 4.00;
  const COST_PERS_OLD = 30;
  const COST_MAT_OLD = 12;
  const COST_PERS_NEW = 7.5;
  const COST_MAT_NEW = 3;
  const PCT_FEES = 0.16;
  const MIN_FEE = 40;
  const COST_EXTRA_OLD = 75;
  const PCT_LOSS_OLD = 0.10;
  const PCT_LOSS_NEW = 0.02;

  // Calculations
  const interestRate = isB2B ? INTEREST_B2B : INTEREST_B2C;
  const fees = Math.max(avgClaimAmount * PCT_FEES, MIN_FEE);
  const lossOld = avgClaimAmount * PCT_LOSS_OLD;
  const lossNew = avgClaimAmount * PCT_LOSS_NEW;
  const totalOld = COST_PERS_OLD + COST_MAT_OLD + fees + COST_EXTRA_OLD + lossOld;
  const totalNew = COST_PERS_NEW + COST_MAT_NEW + lossNew;
  const savingPerCase = totalOld - totalNew;
  const yearlySaving = savingPerCase * casesPerYear;
  const savedDays = (45 * casesPerYear / 60 / 8);
  const reducedWriteOff = writeOff * 0.8;
  const revenueNeeded = writeOff / (margin / 100);
  const compensationFactor = Math.round(100 / margin);

  // Animated values
  const animatedYearlySaving = useAnimatedNumber(yearlySaving);
  const animatedSavedDays = useAnimatedNumber(savedDays);
  const animatedReducedWriteOff = useAnimatedNumber(reducedWriteOff);
  const animatedRevenueNeeded = useAnimatedNumber(revenueNeeded);

  // Sync slider and input
  const handleCasesSlider = (e) => setCasesPerYear(Number(e.target.value));
  const handleCasesInput = (e) => {
    const v = Math.min(2500, Math.max(1, parseInt(e.target.value) || 1));
    setCasesPerYear(v);
  };

  return (
    <div className="icol-wrapper">
      {/* Header */}
      <div className="icol-header">
        <svg className="icol-logo-img" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="8" width="196" height="34" rx="4" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
          <text x="15" y="33" fontFamily="Helvetica Neue, Arial, sans-serif" fontSize="22" fontWeight="700" fill="#1a1a1a">in case of</text>
        </svg>
        <div className="icol-header-right">
          <span className="icol-badge">Forderungsrechner</span>
        </div>
      </div>

      {/* Toggle Section */}
      <div className="icol-toggle-section">
        <span
          className={`icol-toggle-label ${isB2B ? 'active' : ''}`}
          onClick={() => setIsB2B(true)}
        >
          B2B
        </span>
        <div
          className={`icol-toggle-switch ${!isB2B ? 'b2c' : ''}`}
          onClick={() => setIsB2B(!isB2B)}
        />
        <span
          className={`icol-toggle-label ${!isB2B ? 'active' : ''}`}
          onClick={() => setIsB2B(false)}
        >
          B2C
        </span>
        <div className="icol-toggle-info">
          Verzugszinsen: <strong>{interestRate.toLocaleString('de-DE')}%</strong>
        </div>
      </div>

      {/* Controls */}
      <div className="icol-controls">
        <div className="icol-input-group">
          <label>Anzahl Fälle / Jahr</label>
          <div className="icol-slider-row">
            <input
              type="range"
              min="10"
              max="2500"
              step="10"
              value={casesPerYear}
              onChange={handleCasesSlider}
              className="icol-range"
            />
            <input
              type="number"
              min="1"
              value={casesPerYear}
              onChange={handleCasesInput}
              className="icol-manual-input"
            />
          </div>
        </div>
        <div className="icol-input-group">
          <label>Ø Forderung (€)</label>
          <input
            type="number"
            value={avgClaimAmount}
            step="100"
            onChange={(e) => setAvgClaimAmount(Number(e.target.value) || 0)}
            className="icol-input-field"
          />
        </div>
        <div className="icol-input-group">
          <label>Abschreibungen p.a. (€)</label>
          <input
            type="number"
            value={writeOff}
            step="1000"
            onChange={(e) => setWriteOff(Number(e.target.value) || 0)}
            className="icol-input-field"
          />
        </div>
        <div className="icol-input-group">
          <label>Umsatzrendite (%)</label>
          <input
            type="number"
            value={margin}
            step="0.5"
            min="0.5"
            max="50"
            onChange={(e) => setMargin(Number(e.target.value) || 4)}
            className="icol-input-field"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="icol-main-content">
        {/* Table Area */}
        <div className="icol-table-area">
          <div className="icol-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Kostenvergleich pro Forderung
          </div>
          <table className="icol-table">
            <thead>
              <tr>
                <th>Kostenfaktor</th>
                <th className="icol-num">Traditionell</th>
                <th className="icol-num">incaseof.law</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="icol-row-title">Interne Personalkosten</div>
                  <div className="icol-row-desc">30-45 Min. manuell vs. automatisiert</div>
                </td>
                <td className="icol-num old">{formatCurrency(COST_PERS_OLD, 2)}</td>
                <td className="icol-num new">{formatCurrency(COST_PERS_NEW, 2)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Material & Verwaltung</div>
                  <div className="icol-row-desc">Porto, Software, Archivierung</div>
                </td>
                <td className="icol-num old">{formatCurrency(COST_MAT_OLD, 2)}</td>
                <td className="icol-num new">{formatCurrency(COST_MAT_NEW, 2)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Inkassogebühren</div>
                  <div className="icol-row-desc">Provision & Bearbeitung (~16%)</div>
                </td>
                <td className="icol-num old">{formatCurrency(fees, 2)}</td>
                <td className="icol-num new">{formatCurrency(0, 2)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Evidenzhaltung & Einigung</div>
                  <div className="icol-row-desc">Überwachung, Ratenzahlung</div>
                </td>
                <td className="icol-num old">{formatCurrency(COST_EXTRA_OLD, 2)}</td>
                <td className="icol-num new">{formatCurrency(0, 2)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Forderungsausfall</div>
                  <div className="icol-row-desc">Wertberichtigung (10% vs. 2%)</div>
                </td>
                <td className="icol-num old">{formatCurrency(lossOld, 2)}</td>
                <td className="icol-num new">{formatCurrency(lossNew, 2)}</td>
              </tr>
              <tr className="icol-total-row">
                <td><div className="icol-row-title">GESAMT PRO FALL</div></td>
                <td className="icol-num old">{formatCurrency(totalOld, 2)}</td>
                <td className="icol-num new">{formatCurrency(totalNew, 2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="icol-disclaimer">
            * Berechnung basiert auf Marktdurchschnittswerten. Tatsächliche Werte variieren je nach Branche.
          </div>
        </div>

        {/* Sidebar */}
        <div className="icol-sidebar">
          <div className="icol-result-hero">
            <div className="icol-label-light">Jährliche Ersparnis</div>
            <div className="icol-big-num">{formatShortCurrency(Math.round(animatedYearlySaving))}</div>
            <div className="icol-sub-text">Zusätzliche Liquidität</div>
          </div>

          <div className="icol-benefit-box">
            <div className="icol-benefit-title">Ersparnis pro Fall</div>
            <div className="icol-cost-compare">
              <span className="old-cost">{formatCurrency(totalOld)}</span>
              <span className="arrow">→</span>
              <span className="new-cost">{formatCurrency(totalNew, 2)}</span>
            </div>
          </div>

          <div className="icol-benefit-box">
            <div className="icol-benefit-title">Effizienz-Steigerung</div>
            <div className="icol-benefit-val">
              +<span className="highlight">{animatedSavedDays.toFixed(1).replace('.', ',')}</span> Arbeitstage/Jahr
            </div>
          </div>

          <div className="icol-benefit-box">
            <div className="icol-benefit-title">Reduzierte Ausfälle</div>
            <div className="icol-benefit-val">
              <span className="highlight">{formatShortCurrency(Math.round(animatedReducedWriteOff))}</span> weniger
            </div>
          </div>

          <div className="icol-benefit-box">
            <div className="icol-benefit-title">Erfolgsquote</div>
            <div className="icol-benefit-val">
              <span style={{ textDecoration: 'line-through', color: '#666', fontSize: '0.85rem' }}>60%</span>
              {' → '}
              <span className="highlight">95%</span>
            </div>
          </div>

          <a href="https://app.incaseof.law" className="icol-sidebar-cta">
            Jetzt Forderung einreichen
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Hebel Section */}
      <div className="icol-hebel-section">
        <div className="icol-hebel-card">
          <div className="icol-hebel-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Der Liquiditäts-Hebel
          </div>
          <div className="icol-hebel-value">{formatShortCurrency(Math.round(animatedRevenueNeeded))}</div>
          <div className="icol-hebel-desc">
            <strong>Mehrumsatz nötig:</strong> Um einen Forderungsausfall von <strong>{formatShortCurrency(writeOff)}</strong> zu kompensieren, müssen Sie bei <strong>{margin.toLocaleString('de-DE')}%</strong> Marge diesen Umsatz zusätzlich generieren.
          </div>
        </div>
        <div className="icol-hebel-card">
          <div className="icol-hebel-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            Kompensations-Faktor
          </div>
          <div className="icol-hebel-value">{compensationFactor}x</div>
          <div className="icol-hebel-desc">
            Bei <strong>{margin.toLocaleString('de-DE')}%</strong> Marge braucht 1 schlechter Auftrag <strong>{compensationFactor}</strong> gute zur Kompensation.
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="icol-quote-section">
        <div className="icol-quote">
          Ein ausgefallener Auftrag braucht {compensationFactor} gute Aufträge, um kompensiert zu werden. incaseof.law reduziert Ihre Ausfälle um 80%.
        </div>
      </div>

      {/* CTA Section */}
      <div className="icol-cta-section">
        <div className="icol-cta-text">
          Bereit, Ihre Forderungen effizient einzutreiben?
          <span>Starten Sie jetzt und sparen Sie bis zu 90% der Kosten</span>
        </div>
        <a href="https://app.incaseof.law" className="icol-cta-btn">
          Jetzt Forderungen einreichen
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>

      {/* Footer */}
      <div className="icol-footer">
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <ExternalLink className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>API-Integration</h4>
            <p>Nahtlose Anbindung</p>
          </div>
        </div>
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <Clock className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>Echtzeit-Status</h4>
            <p>Volle Transparenz</p>
          </div>
        </div>
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>Direkt-Kommunikation</h4>
            <p>Rückfragen klären</p>
          </div>
        </div>
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <Shield className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>Keine versteckten Kosten</h4>
            <p>Transparente Preise</p>
          </div>
        </div>
      </div>
    </div>
  );
}
