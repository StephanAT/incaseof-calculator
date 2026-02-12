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
  Sparkles
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

// Slider Input Component - incaseof.law style
function SliderInput({ label, value, onChange, min, max, step = 1, icon: Icon, unit = '', prefix = '' }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Icon className="w-4 h-4 text-green-600" />
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
            className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-right text-gray-900 font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
          />
          <span className="text-gray-500 text-sm w-8">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <div
          className="absolute h-2 bg-gradient-to-r from-green-600 to-green-500 rounded-full top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>{prefix}{formatNumber(min)}{unit}</span>
        <span>{prefix}{formatNumber(max)}{unit}</span>
      </div>
    </div>
  );
}

// Toggle Switch Component - incaseof.law style
function ToggleSwitch({ isB2B, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3 p-1 bg-gray-100 rounded-2xl">
      <button
        onClick={() => onChange(true)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
          isB2B
            ? 'bg-white text-green-700 shadow-sm'
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <Building2 className="w-4 h-4" />
        B2B
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
          !isB2B
            ? 'bg-white text-green-700 shadow-sm'
            : 'bg-transparent text-gray-500 hover:text-gray-700'
        }`}
      >
        <Users className="w-4 h-4" />
        B2C
      </button>
    </div>
  );
}

// Progress Bar Component - incaseof.law style
function ProgressBar({ value, max, color = 'green', label, showBonus = false, bonusValue = 0 }) {
  const percentage = (value / max) * 100;
  const bonusPercentage = (bonusValue / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      </div>
      <div className="h-6 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            color === 'green' ? 'bg-gradient-to-r from-green-600 to-green-500' :
            'bg-gray-300'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {showBonus && bonusValue > 0 && (
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-500 ease-out"
            style={{ width: `${bonusPercentage}%` }}
          />
        )}
      </div>
    </div>
  );
}

// Value Card Component - incaseof.law style
function ValueCard({ title, icon: Icon, children, highlight = false, className = '' }) {
  return (
    <div className={`
      relative p-6 rounded-3xl border transition-all duration-300
      ${highlight
        ? 'bg-green-50 border-green-200 shadow-lg'
        : 'bg-white border-gray-100 shadow-sm hover:shadow-md'
      }
      ${className}
    `}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2.5 rounded-2xl ${highlight ? 'bg-green-100' : 'bg-gray-50'}`}>
          <Icon className={`w-5 h-5 ${highlight ? 'text-green-600' : 'text-gray-600'}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// Main Calculator Component
export default function Calculator() {
  // Input state
  const [isB2B, setIsB2B] = useState(true);
  const [casesPerYear, setCasesPerYear] = useState(50);
  const [avgClaimAmount, setAvgClaimAmount] = useState(2000);
  const [margin, setMargin] = useState(4);
  const [showInternalCosts, setShowInternalCosts] = useState(true);

  // Constants
  const INTEREST_RATE_B2B = 10.73;
  const INTEREST_RATE_B2C = 6.0;
  const INTERNAL_COST_PER_CASE = 25;
  const ADMIN_COST_PER_CASE = 12;
  const KSV_ANNUAL_FEE = 300;
  const INCASEOF_INTERNAL_COST = 1.5;
  const B2B_DELAY_COMPENSATION = 40;
  const AVG_COLLECTION_DAYS = 60;

  // Calculations
  const interestRate = isB2B ? INTEREST_RATE_B2B : INTEREST_RATE_B2C;
  const totalClaimVolume = casesPerYear * avgClaimAmount;
  const requiredRevenue = totalClaimVolume / (margin / 100);
  const interestPerCase = (avgClaimAmount * (interestRate / 100) * (AVG_COLLECTION_DAYS / 365));
  const totalInterest = interestPerCase * casesPerYear;
  const totalDelayCompensation = isB2B ? B2B_DELAY_COMPENSATION * casesPerYear : 0;

  const ksvPerCase = KSV_ANNUAL_FEE / Math.max(casesPerYear, 1);
  const traditionalCostPerCase = (showInternalCosts ? INTERNAL_COST_PER_CASE : 0) + ADMIN_COST_PER_CASE + ksvPerCase;
  const traditionalNetPerCase = avgClaimAmount - traditionalCostPerCase;
  const traditionalNetTotal = traditionalNetPerCase * casesPerYear;

  const incaseofCostPerCase = showInternalCosts ? INCASEOF_INTERNAL_COST : 0;
  const incaseofNetPerCase = avgClaimAmount + interestPerCase + (isB2B ? B2B_DELAY_COMPENSATION : 0) - incaseofCostPerCase;
  const incaseofNetTotal = incaseofNetPerCase * casesPerYear;

  const traditionalHours = (casesPerYear * 30) / 60;
  const traditionalDays = traditionalHours / 8;
  const incaseofHours = (casesPerYear * 2) / 60;
  const savedHours = traditionalHours - incaseofHours;
  const savedDays = savedHours / 8;

  const liquidityAdvantage = incaseofNetTotal - traditionalNetTotal;

  // Animated values
  const animatedLiquidityAdvantage = useAnimatedNumber(liquidityAdvantage);
  const animatedRequiredRevenue = useAnimatedNumber(requiredRevenue);
  const animatedSavedDays = useAnimatedNumber(savedDays);
  const animatedTotalInterest = useAnimatedNumber(totalInterest);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Liquiditäts-Rechner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Wie viel <span className="text-green-600">Liquidität</span> gewinnst du?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Berechne in Sekunden, wie viel Geld und Zeit du mit incaseof.law zurückholst.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-50 rounded-xl">
              <CalcIcon className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Deine Situation</h3>
          </div>

          <div className="space-y-8">
            {/* B2B/B2C Toggle */}
            <div className="flex justify-center">
              <ToggleSwitch isB2B={isB2B} onChange={setIsB2B} />
            </div>

            {/* Sliders Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <SliderInput
                label="Fälle pro Jahr"
                value={casesPerYear}
                onChange={setCasesPerYear}
                min={1}
                max={500}
                icon={FileStack}
              />
              <SliderInput
                label="Ø Forderungshöhe"
                value={avgClaimAmount}
                onChange={setAvgClaimAmount}
                min={100}
                max={20000}
                step={100}
                icon={Euro}
                prefix="€ "
              />
              <SliderInput
                label="Deine Umsatzrendite"
                value={margin}
                onChange={setMargin}
                min={1}
                max={30}
                icon={Percent}
                unit="%"
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Card 1: Liquiditäts-Boost */}
          <ValueCard title="Liquiditäts-Boost" icon={Wallet} highlight={true}>
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500 mb-3">Netto pro {formatCurrency(10000)} Forderung</p>
                <ProgressBar
                  value={10000 - (traditionalCostPerCase * (10000 / avgClaimAmount))}
                  max={12000}
                  color="gray"
                  label="Traditionell"
                />
                <div className="mt-3">
                  <ProgressBar
                    value={10000}
                    max={12000}
                    color="green"
                    label="incaseof.law"
                    showBonus={true}
                    bonusValue={interestPerCase * (10000 / avgClaimAmount) + (isB2B ? B2B_DELAY_COMPENSATION * (10000 / avgClaimAmount) : 0)}
                  />
                </div>
              </div>

              <div className="p-4 bg-green-100/50 border border-green-200 rounded-2xl">
                <p className="text-sm text-green-700 mb-1">Dein jährlicher Zinsvorteil</p>
                <p className="text-2xl font-bold text-green-600">
                  +{formatCurrency(Math.round(animatedTotalInterest))}
                </p>
                <p className="text-xs text-green-600/70 mt-1">
                  Wir zahlen dir die Zinsen aus – andere behalten sie.
                </p>
              </div>

              {isB2B && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700">
                    + {formatCurrency(totalDelayCompensation)} Verzugspauschale
                  </p>
                </div>
              )}
            </div>
          </ValueCard>

          {/* Card 2: Zeit-Gewinn */}
          <ValueCard title="Zeit-Gewinn" icon={Clock}>
            <div className="space-y-5">
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(savedDays / Math.max(traditionalDays, 1)) * 352} 352`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {Math.round(animatedSavedDays)}
                    </span>
                    <span className="text-xs text-gray-500">Tage/Jahr</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Schenke deiner Buchhaltung <span className="text-green-600 font-semibold">{Math.round(savedDays)} Arbeitstage</span> zurück.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-500 text-xs">Traditionell</p>
                  <p className="text-gray-900 font-semibold">{Math.round(traditionalHours)} Std.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl text-center">
                  <p className="text-green-600 text-xs">incaseof.law</p>
                  <p className="text-green-700 font-semibold">{Math.round(incaseofHours)} Std.</p>
                </div>
              </div>
            </div>
          </ValueCard>

          {/* Card 3: Umsatz-Hebel */}
          <ValueCard title="Umsatz-Hebel" icon={TrendingUp}>
            <div className="space-y-5">
              <div className="text-center py-3">
                <p className="text-sm text-gray-500 mb-1">Benötigter Mehrumsatz</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(Math.round(animatedRequiredRevenue))}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bei <span className="font-semibold text-gray-900">{margin}% Marge</span> brauchst du{' '}
                  <span className="font-semibold text-amber-600">{formatCurrency(Math.round(requiredRevenue))}</span>{' '}
                  Umsatz, um{' '}
                  <span className="font-semibold text-gray-900">{formatCurrency(totalClaimVolume)}</span>{' '}
                  Verlust auszugleichen.
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl">
                <Zap className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">Dein Joker:</span> Statt neue Kunden zu akquirieren, realisieren wir dein bestehendes Geld.
                </p>
              </div>
            </div>
          </ValueCard>
        </div>

        {/* Reality Check Toggle */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-8">
          <button
            onClick={() => setShowInternalCosts(!showInternalCosts)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              {showInternalCosts ? (
                <ToggleRight className="w-7 h-7 text-green-600" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-gray-400" />
              )}
              <div className="text-left">
                <p className="font-medium text-gray-900">Interne Kosten einrechnen?</p>
                <p className="text-sm text-gray-500">
                  Zeit für Mahnungen = verlorene Produktivität
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              showInternalCosts ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {showInternalCosts ? 'Aktiv' : 'Aus'}
            </span>
          </button>
        </div>

        {/* Summary & CTA */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">Dein Vorteil mit incaseof.law</span>
          </div>

          <div className="text-5xl sm:text-6xl font-bold mb-3">
            +{formatCurrency(Math.round(animatedLiquidityAdvantage))}
          </div>
          <p className="text-xl text-green-100 mb-8">
            mehr Liquidität pro Jahr
          </p>

          <a
            href="https://app.incaseof.law"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Jetzt {formatCurrency(Math.round(liquidityAdvantage))} sichern
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-green-200 mt-4 text-sm">
            Kostenlos starten · Keine Mitgliedschaft · Keine versteckten Gebühren
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-10 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Vergleich pro Fall</h3>

          <table className="w-full min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 text-gray-500 font-medium text-sm">Kostenpunkt</th>
                <th className="text-right py-3 text-gray-500 font-medium text-sm">Traditionell</th>
                <th className="text-right py-3 text-green-600 font-medium text-sm">incaseof.law</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-3 text-gray-700 text-sm">Interner Aufwand</td>
                <td className="py-3 text-right text-gray-500 text-sm">
                  <span className="flex items-center justify-end gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    {formatCurrency(showInternalCosts ? INTERNAL_COST_PER_CASE : 0)}
                  </span>
                </td>
                <td className="py-3 text-right text-green-600 text-sm">
                  <span className="flex items-center justify-end gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {formatCurrency(showInternalCosts ? INCASEOF_INTERNAL_COST : 0)}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700 text-sm">Material & Admin</td>
                <td className="py-3 text-right text-gray-500 text-sm">{formatCurrency(ADMIN_COST_PER_CASE)}</td>
                <td className="py-3 text-right text-green-600 text-sm">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700 text-sm">Mitgliedsbeitrag</td>
                <td className="py-3 text-right text-gray-500 text-sm">{formatCurrency(ksvPerCase, 2)}</td>
                <td className="py-3 text-right text-green-600 text-sm">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700 text-sm">Verzugszinsen</td>
                <td className="py-3 text-right text-red-400 text-sm">
                  <span className="text-xs">(einbehalten)</span>
                </td>
                <td className="py-3 text-right text-green-600 text-sm font-medium">+{formatCurrency(interestPerCase, 2)}</td>
              </tr>
              {isB2B && (
                <tr>
                  <td className="py-3 text-gray-700 text-sm">Verzugspauschale</td>
                  <td className="py-3 text-right text-gray-500 text-sm">{formatCurrency(0)}</td>
                  <td className="py-3 text-right text-green-600 text-sm font-medium">+{formatCurrency(B2B_DELAY_COMPENSATION)}</td>
                </tr>
              )}
              <tr className="font-semibold border-t border-gray-200">
                <td className="py-4 text-gray-900">Netto pro Fall</td>
                <td className="py-4 text-right text-gray-900">{formatCurrency(traditionalNetPerCase, 2)}</td>
                <td className="py-4 text-right text-green-600">{formatCurrency(incaseofNetPerCase, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
