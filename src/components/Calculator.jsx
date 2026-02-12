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
  Scale,
  ShieldCheck,
  BadgePercent,
  FileWarning,
  Archive,
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

// Tooltip component
function Tooltip({ text }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex ml-1">
      <span
        className="inline-flex items-center justify-center text-brand-primary cursor-help opacity-70 hover:opacity-100 transition-opacity"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        <Info size={14} />
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-gray-900 text-white text-xs font-normal normal-case tracking-normal leading-relaxed rounded-lg shadow-lg z-50">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
        </span>
      )}
    </span>
  );
}

// Slider Input Component
function SliderInput({ label, value, onChange, min, max, step = 1, icon: Icon, unit = '', prefix = '', tooltip }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary-dark uppercase tracking-wide">
          <Icon className="w-3.5 h-3.5 text-brand-primary" />
          {label}
          {tooltip && <Tooltip text={tooltip} />}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
            className="w-20 bg-white border-2 border-brand-bg-light rounded-lg px-2 py-1 text-right text-gray-900 font-semibold text-sm focus:border-brand-primary focus:outline-none transition-all"
          />
          {unit && <span className="text-gray-500 text-xs w-6">{unit}</span>}
        </div>
      </div>
      <div className="relative">
        <div
          className="absolute h-1 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 bg-brand-bg-light rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-brand-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
        />
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ isB2B, onChange }) {
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-xl">
      <button
        onClick={() => onChange(true)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          isB2B
            ? 'bg-white text-brand-primary-dark shadow-sm'
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <Building2 className="w-4 h-4" />
        B2B
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          !isB2B
            ? 'bg-white text-brand-primary-dark shadow-sm'
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <Users className="w-4 h-4" />
        B2C
      </button>
    </div>
  );
}

// Comparison Row Component
function ComparisonRow({ label, icon: Icon, traditional, incaseof, isHighlight = false, isBetter = true }) {
  return (
    <tr className={isHighlight ? 'bg-brand-bg-light/50' : ''}>
      <td className="py-2.5 pr-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isHighlight ? 'bg-brand-bg-light' : 'bg-gray-100'}`}>
            <Icon className={`w-3.5 h-3.5 ${isHighlight ? 'text-brand-primary' : 'text-gray-500'}`} />
          </div>
          <span className="text-gray-900 font-medium text-sm">{label}</span>
        </div>
      </td>
      <td className="py-2.5 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {!isBetter && <XCircle className="w-3.5 h-3.5 text-red-400" />}
          <span className="text-gray-600 text-sm">{traditional}</span>
        </div>
      </td>
      <td className="py-2.5 pl-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          {isBetter && <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />}
          <span className={`text-sm font-semibold ${isBetter ? 'text-brand-success' : 'text-gray-600'}`}>{incaseof}</span>
        </div>
      </td>
    </tr>
  );
}

// Main Calculator Component
export default function Calculator() {
  // Input state
  const [isB2B, setIsB2B] = useState(true);
  const [casesPerYear, setCasesPerYear] = useState(120);
  const [avgClaimAmount, setAvgClaimAmount] = useState(2500);

  // Fixed margin for compensation factor calculation (typical SMB margin)
  const margin = 4;

  // Constants
  const INTERNAL_COST_PER_CASE = 25;
  const ADMIN_COST_PER_CASE = 12;
  const KSV_ANNUAL_FEE = 300;
  const TRADITIONAL_INKASSO_FEE_PERCENT = 15;
  const TRADITIONAL_EVIDENCE_FEE = 5;
  const TRADITIONAL_DEFAULT_RATE = 25;
  const INCASEOF_DEFAULT_RATE = 12;
  const INCASEOF_INTERNAL_COST = 1.5;
  const B2B_DELAY_COMPENSATION = 40;

  // Per-case calculations
  const ksvPerCase = KSV_ANNUAL_FEE / Math.max(casesPerYear, 1);
  const traditionalInkassoFee = avgClaimAmount * (TRADITIONAL_INKASSO_FEE_PERCENT / 100);
  const traditionalDefaultLoss = avgClaimAmount * (TRADITIONAL_DEFAULT_RATE / 100);
  const incaseofDefaultLoss = avgClaimAmount * (INCASEOF_DEFAULT_RATE / 100);

  // Total costs (yearly)
  const totalInternalOld = INTERNAL_COST_PER_CASE * casesPerYear;
  const totalInternalNew = INCASEOF_INTERNAL_COST * casesPerYear;
  const totalAdminOld = ADMIN_COST_PER_CASE * casesPerYear;
  const totalKSV = KSV_ANNUAL_FEE;
  const totalInkassoFees = traditionalInkassoFee * casesPerYear;
  const totalEvidenceOld = TRADITIONAL_EVIDENCE_FEE * casesPerYear;
  const totalDefaultOld = traditionalDefaultLoss * casesPerYear;
  const totalDefaultNew = incaseofDefaultLoss * casesPerYear;
  const totalB2BBonus = isB2B ? B2B_DELAY_COMPENSATION * casesPerYear : 0;

  const totalTraditional = totalInternalOld + totalAdminOld + totalKSV + totalInkassoFees + totalEvidenceOld + totalDefaultOld;
  const totalIncaseof = totalInternalNew + totalDefaultNew - totalB2BBonus;

  // Time savings
  const traditionalHours = (casesPerYear * 30) / 60;
  const incaseofHours = (casesPerYear * 2) / 60;
  const savedDays = (traditionalHours - incaseofHours) / 8;

  // Advantage
  const liquidityAdvantage = totalTraditional - totalIncaseof;
  const totalClaimVolume = casesPerYear * avgClaimAmount;
  const requiredRevenue = totalClaimVolume / (margin / 100);
  const compensationFactor = Math.round(100 / margin);

  // Animated values
  const animatedLiquidityAdvantage = useAnimatedNumber(liquidityAdvantage);
  const animatedSavedDays = useAnimatedNumber(savedDays);
  const animatedRequiredRevenue = useAnimatedNumber(requiredRevenue);

  return (
    <div className="w-full min-h-screen py-4 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        {/* Header - Compact */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg-light border border-brand-primary/20 rounded-full mb-3">
            <CalcIcon className="w-4 h-4 text-brand-primary" />
            <span className="text-brand-primary-dark text-sm font-semibold">Forderungsrechner</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Wie viel <span className="text-brand-primary">mehr</span> bleibt bei dir?
          </h2>
        </div>

        {/* Input Section - Compact */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex justify-center lg:justify-start">
              <ToggleSwitch isB2B={isB2B} onChange={setIsB2B} />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SliderInput
                label="Fälle / Jahr"
                value={casesPerYear}
                onChange={setCasesPerYear}
                min={10}
                max={500}
                step={10}
                icon={FileStack}
              />
              <SliderInput
                label="Ø Forderung"
                value={avgClaimAmount}
                onChange={setAvgClaimAmount}
                min={100}
                max={20000}
                step={100}
                icon={Euro}
                prefix="€"
              />
            </div>
          </div>
        </div>

        {/* Main Content: Comparison (2/3) + Cards (1/3) */}
        <div className="grid lg:grid-cols-3 gap-4 mb-4">

          {/* Left: Comparison Table (2/3) */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-brand-bg-light rounded-lg">
                  <Scale className="w-4 h-4 text-brand-primary" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Kostenvergleich für {formatNumber(casesPerYear)} Fälle/Jahr</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-3 text-xs text-gray-500 font-medium uppercase"></th>
                    <th className="py-2 px-3 text-center text-xs text-gray-500 font-medium uppercase">Traditionell</th>
                    <th className="py-2 pl-3 text-center text-xs text-brand-primary font-medium uppercase">incaseof.law</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Kosten - combined row */}
                  <tr>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-gray-100">
                          <Wallet className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium text-sm">Kosten</span>
                          <p className="text-xs text-gray-400">Material, Mitgliedschaften, Inkasso, Evidenzhaltung</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-red-600 font-semibold text-sm">{formatCurrency(totalAdminOld + totalKSV + totalInkassoFees + totalEvidenceOld)}</span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        <span className="text-brand-success font-semibold text-sm">{formatCurrency(0)}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Rückholung - how much more you recover */}
                  <tr className="bg-brand-bg-light/30">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-bg-light">
                          <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium text-sm">Rückholquote</span>
                          <p className="text-xs text-gray-400">Anteil der erfolgreich eingeholten Forderungen</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-gray-600 font-semibold text-sm">{100 - TRADITIONAL_DEFAULT_RATE}%</span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        <span className="text-brand-success font-semibold text-sm">{100 - INCASEOF_DEFAULT_RATE}%</span>
                      </div>
                    </td>
                  </tr>

                  {/* Mehr zurückgeholt */}
                  <tr className="bg-brand-bg-light/50">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-brand-primary/20">
                          <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
                        </div>
                        <span className="text-brand-primary-dark font-medium text-sm">Mehr zurückgeholt</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-gray-400 text-sm">—</span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <span className="text-brand-primary font-bold text-sm">+{formatCurrency(totalDefaultOld - totalDefaultNew)}</span>
                    </td>
                  </tr>

                  {/* Zeit gespart */}
                  <tr>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-100">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium text-sm">Zeit gespart</span>
                          <p className="text-xs text-gray-400">Interne Arbeitszeit pro Jahr</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-gray-600 text-sm">{Math.round(traditionalHours)} Std.</span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        <span className="text-brand-success font-semibold text-sm">{Math.round(incaseofHours)} Std.</span>
                      </div>
                    </td>
                  </tr>

                  {/* Eintreibungszeit */}
                  <tr className="bg-brand-bg-light/30">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-amber-100">
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div>
                          <span className="text-gray-900 font-medium text-sm">Eintreibungszeit</span>
                          <p className="text-xs text-gray-400">Durchschnittliche Dauer bis Zahlung</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-gray-600 text-sm">41 Tage</span>
                    </td>
                    <td className="py-3 pl-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        <span className="text-brand-success font-semibold text-sm">21 Tage</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-brand-primary bg-gradient-to-r from-brand-bg-light to-brand-bg-light/50">
                    <td className="py-4 pr-3 rounded-bl-xl">
                      <span className="text-brand-primary-dark font-bold text-base">Netto mehr Umsatz / Jahr</span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="text-gray-500 font-semibold">{formatCurrency(totalClaimVolume - totalTraditional)}</span>
                    </td>
                    <td className="py-4 pl-3 text-center rounded-br-xl">
                      <div className="inline-flex items-center gap-2 bg-brand-primary text-white px-3 py-1.5 rounded-lg">
                        <span className="font-bold text-lg">{formatCurrency(totalClaimVolume - Math.max(0, totalIncaseof))}</span>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Right: Value Cards (1/3) */}
          <div className="space-y-3">

            {/* Card 1: Liquiditäts-Boost */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-brand-secondary" />
                <span className="text-brand-bg-light text-sm font-medium">Liquiditäts-Boost</span>
              </div>
              <div className="text-3xl font-bold text-brand-secondary mb-1">
                +{formatCurrency(Math.round(animatedLiquidityAdvantage))}
              </div>
              <p className="text-brand-bg-light text-xs">
                mehr Liquidität pro Jahr
              </p>
            </div>

            {/* Card 2: Zeit-Gewinn */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600 text-sm font-medium">Zeit-Gewinn</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-gray-900">{Math.round(animatedSavedDays)}</span>
                <span className="text-gray-500 text-sm">Arbeitstage/Jahr</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Unser AI-Inkasso automatisiert den gesamten Prozess – du sparst dir interne Ressourcen.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg p-1.5 text-center">
                  <p className="text-gray-400">Vorher</p>
                  <p className="text-gray-700 font-semibold">{Math.round(traditionalHours)} Std.</p>
                </div>
                <div className="bg-brand-bg-light rounded-lg p-1.5 text-center">
                  <p className="text-brand-primary">Nachher</p>
                  <p className="text-brand-primary-dark font-semibold">{Math.round(incaseofHours)} Std.</p>
                </div>
              </div>
            </div>

            {/* Card 3: Kompensations-Faktor */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm font-medium">Kompensations-Faktor</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-2xl font-bold text-gray-900">{compensationFactor}x</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Eine nicht eingetriebene Forderung frisst den Gewinn aus {compensationFactor} erfolgreichen Aufträgen.
              </p>
            </div>

          </div>
        </div>

        {/* CTA Section - Compact */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-2xl p-5 text-center text-white">
          <p className="text-brand-bg-light text-sm mb-1">Gesamter finanzieller Vorteil</p>
          <div className="text-3xl font-bold text-brand-secondary mb-4">
            +{formatCurrency(Math.round(animatedLiquidityAdvantage))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://app.incaseof.law"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-brand-primary-dark font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Jetzt {formatCurrency(Math.round(liquidityAdvantage))} sichern
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://app.incaseof.law"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary border-2 border-white text-white font-semibold rounded-xl hover:bg-brand-primary-dark transition-all"
            >
              Jetzt Forderung einreichen
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
