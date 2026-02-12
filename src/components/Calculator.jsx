import { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ExternalLink,
  MessageCircle,
  Shield,
  Info
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

// Tooltip component
function Tooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span className="icol-tooltip-wrapper">
      <span
        className="icol-tooltip-trigger"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        <Info size={14} />
      </span>
      {show && (
        <span className="icol-tooltip-content">
          {text}
        </span>
      )}
    </span>
  );
}

// Main Calculator Component
export default function Calculator() {
  // Input state
  const [isB2B, setIsB2B] = useState(true);
  const [casesPerYear, setCasesPerYear] = useState(120);
  const [avgClaimAmount, setAvgClaimAmount] = useState(2500);
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

  // Calculations - now based on total cases
  const interestRate = isB2B ? INTEREST_B2B : INTEREST_B2C;
  const feesPerCase = Math.max(avgClaimAmount * PCT_FEES, MIN_FEE);
  const lossOldPerCase = avgClaimAmount * PCT_LOSS_OLD;
  const lossNewPerCase = avgClaimAmount * PCT_LOSS_NEW;

  // Total costs (based on all cases)
  const totalPersonalOld = COST_PERS_OLD * casesPerYear;
  const totalPersonalNew = COST_PERS_NEW * casesPerYear;
  const totalMatOld = COST_MAT_OLD * casesPerYear;
  const totalMatNew = COST_MAT_NEW * casesPerYear;
  const totalFees = feesPerCase * casesPerYear;
  const totalExtraOld = COST_EXTRA_OLD * casesPerYear;
  const totalLossOld = lossOldPerCase * casesPerYear;
  const totalLossNew = lossNewPerCase * casesPerYear;

  const totalOld = totalPersonalOld + totalMatOld + totalFees + totalExtraOld + totalLossOld;
  const totalNew = totalPersonalNew + totalMatNew + totalLossNew;
  const yearlySaving = totalOld - totalNew;

  const savedDays = (45 * casesPerYear / 60 / 8);
  const totalClaimVolume = avgClaimAmount * casesPerYear;
  const revenueNeeded = totalClaimVolume / (margin / 100);
  const compensationFactor = Math.round(100 / margin);

  // Animated values
  const animatedYearlySaving = useAnimatedNumber(yearlySaving);
  const animatedSavedDays = useAnimatedNumber(savedDays);
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
          <label>Fälle / Jahr</label>
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
          <label>
            Umsatzrendite (%)
            <Tooltip text="Die Umsatzrendite zeigt, wie viel Gewinn pro Euro Umsatz bleibt. Bei 4% Rendite bleiben von 100€ Umsatz nur 4€ Gewinn. Typische Werte: Handel 2-4%, Dienstleistung 5-10%, Software 15-25%." />
          </label>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Kostenvergleich für {formatNumber(casesPerYear)} Fälle/Jahr
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
                </td>
                <td className="icol-num old">{formatCurrency(totalPersonalOld)}</td>
                <td className="icol-num new">{formatCurrency(totalPersonalNew)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Material & Verwaltung</div>
                </td>
                <td className="icol-num old">{formatCurrency(totalMatOld)}</td>
                <td className="icol-num new">{formatCurrency(totalMatNew)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Inkassogebühren</div>
                </td>
                <td className="icol-num old">{formatCurrency(totalFees)}</td>
                <td className="icol-num new">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Evidenzhaltung & Einigung</div>
                </td>
                <td className="icol-num old">{formatCurrency(totalExtraOld)}</td>
                <td className="icol-num new">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td>
                  <div className="icol-row-title">Forderungsausfall</div>
                </td>
                <td className="icol-num old">{formatCurrency(totalLossOld)}</td>
                <td className="icol-num new">{formatCurrency(totalLossNew)}</td>
              </tr>
              <tr className="icol-total-row">
                <td><div className="icol-row-title">GESAMT / JAHR</div></td>
                <td className="icol-num old">{formatCurrency(totalOld)}</td>
                <td className="icol-num new">{formatCurrency(totalNew)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sidebar */}
        <div className="icol-sidebar">
          <div className="icol-result-hero">
            <div className="icol-label-light">Jährliche Ersparnis</div>
            <div className="icol-big-num">{formatShortCurrency(Math.round(animatedYearlySaving))}</div>
          </div>

          <div className="icol-benefit-box">
            <div className="icol-benefit-title">Effizienz-Steigerung</div>
            <div className="icol-benefit-val">
              +<span className="highlight">{animatedSavedDays.toFixed(1).replace('.', ',')}</span> Arbeitstage/Jahr
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

          <div className="icol-benefit-box">
            <div className="icol-benefit-title">Kompensations-Faktor</div>
            <div className="icol-benefit-val">
              <span className="highlight">{compensationFactor}x</span>
              <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '6px' }}>
                bei {margin}% Marge
              </span>
            </div>
          </div>

          <a href="https://app.incaseof.law" className="icol-sidebar-cta">
            Jetzt starten
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Footer - Compact */}
      <div className="icol-footer">
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <ExternalLink className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>API-Integration</h4>
          </div>
        </div>
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <Clock className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>Echtzeit-Status</h4>
          </div>
        </div>
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>Direkt-Kommunikation</h4>
          </div>
        </div>
        <div className="icol-benefit-item">
          <div className="icol-benefit-icon">
            <Shield className="w-4 h-4" />
          </div>
          <div className="icol-benefit-content">
            <h4>Keine versteckten Kosten</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
