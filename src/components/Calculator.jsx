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
  ToggleRight
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

      // Easing function
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

// Slider Input Component
function SliderInput({ label, value, onChange, min, max, step = 1, icon: Icon, unit = '', prefix = '' }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
          <Icon className="w-4 h-4 text-blue-400" />
          {label}
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
            className="w-24 bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-right text-white font-semibold focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="text-slate-400 text-sm w-8">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <div
          className="absolute h-2 bg-gradient-to-r from-blue-600 to-blue-400 rounded-l-full top-1/2 -translate-y-1/2 pointer-events-none"
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
      <div className="flex justify-between text-xs text-slate-500">
        <span>{prefix}{formatNumber(min)}{unit}</span>
        <span>{prefix}{formatNumber(max)}{unit}</span>
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ isB2B, onChange }) {
  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      <button
        onClick={() => onChange(true)}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          isB2B
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Building2 className="w-5 h-5" />
        B2B (Unternehmen)
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
          !isB2B
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Users className="w-5 h-5" />
        B2C (Verbraucher)
      </button>
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ value, max, color = 'blue', label, showBonus = false, bonusValue = 0 }) {
  const percentage = (value / max) * 100;
  const bonusPercentage = (bonusValue / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">{formatCurrency(value)}</span>
      </div>
      <div className="h-8 bg-slate-700/50 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-400' :
            color === 'green' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
            'bg-gradient-to-r from-slate-600 to-slate-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        {showBonus && bonusValue > 0 && (
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${bonusPercentage}%` }}
          />
        )}
      </div>
    </div>
  );
}

// Value Card Component
function ValueCard({ title, icon: Icon, children, highlight = false, className = '' }) {
  return (
    <div className={`
      relative p-6 rounded-2xl border transition-all duration-300
      ${highlight
        ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 border-emerald-500/30 card-glow-success'
        : 'bg-slate-800/50 border-slate-700/50 card-glow hover:border-slate-600'
      }
      ${className}
    `}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
          <Icon className={`w-6 h-6 ${highlight ? 'text-emerald-400' : 'text-blue-400'}`} />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
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
  const INTEREST_RATE_B2B = 10.73; // %
  const INTEREST_RATE_B2C = 6.0; // %
  const INTERNAL_COST_PER_CASE = 25; // € (30 min @ 50€/h)
  const ADMIN_COST_PER_CASE = 12; // €
  const KSV_ANNUAL_FEE = 300; // €
  const FAILURE_PENALTY = 40; // € (Negativpauschale)
  const INCASEOF_INTERNAL_COST = 1.5; // € (2 min)
  const B2B_DELAY_COMPENSATION = 40; // € Verzugspauschale
  const AVG_COLLECTION_DAYS = 60; // Average days to collect

  // Calculations
  const interestRate = isB2B ? INTEREST_RATE_B2B : INTEREST_RATE_B2C;
  const totalClaimVolume = casesPerYear * avgClaimAmount;

  // Required additional revenue to compensate losses
  const requiredRevenue = totalClaimVolume / (margin / 100);

  // Interest earned (assuming 60 days average)
  const interestPerCase = (avgClaimAmount * (interestRate / 100) * (AVG_COLLECTION_DAYS / 365));
  const totalInterest = interestPerCase * casesPerYear;

  // B2B delay compensation
  const totalDelayCompensation = isB2B ? B2B_DELAY_COMPENSATION * casesPerYear : 0;

  // Traditional costs per case
  const ksvPerCase = KSV_ANNUAL_FEE / Math.max(casesPerYear, 1);
  const traditionalCostPerCase = (showInternalCosts ? INTERNAL_COST_PER_CASE : 0) + ADMIN_COST_PER_CASE + ksvPerCase;
  const traditionalTotalCosts = traditionalCostPerCase * casesPerYear;

  // Traditional: They often keep the interest
  const traditionalNetPerCase = avgClaimAmount - traditionalCostPerCase;
  const traditionalNetTotal = traditionalNetPerCase * casesPerYear;

  // incaseof.law costs and net
  const incaseofCostPerCase = showInternalCosts ? INCASEOF_INTERNAL_COST : 0;
  const incaseofTotalCosts = incaseofCostPerCase * casesPerYear;
  const incaseofNetPerCase = avgClaimAmount + interestPerCase + (isB2B ? B2B_DELAY_COMPENSATION : 0) - incaseofCostPerCase;
  const incaseofNetTotal = incaseofNetPerCase * casesPerYear;

  // Time savings
  const traditionalHours = (casesPerYear * 30) / 60;
  const traditionalDays = traditionalHours / 8;
  const incaseofHours = (casesPerYear * 2) / 60;
  const savedHours = traditionalHours - incaseofHours;
  const savedDays = savedHours / 8;

  // Difference / Advantage
  const liquidityAdvantage = incaseofNetTotal - traditionalNetTotal;

  // Animated values
  const animatedLiquidityAdvantage = useAnimatedNumber(liquidityAdvantage);
  const animatedRequiredRevenue = useAnimatedNumber(requiredRevenue);
  const animatedSavedDays = useAnimatedNumber(savedDays);
  const animatedTotalInterest = useAnimatedNumber(totalInterest);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Revenue Recovery Calculator</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Wie viel <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Liquidität</span> verlierst du?
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Berechne in Sekunden, wie viel Geld und Zeit du mit incaseof.law zurückgewinnen kannst.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CalcIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Deine Situation</h2>
          </div>

          <div className="space-y-8">
            {/* B2B/B2C Toggle */}
            <ToggleSwitch isB2B={isB2B} onChange={setIsB2B} />

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
          <ValueCard title="Der Liquiditäts-Boost" icon={Wallet} highlight={true}>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-400 mb-4">Netto-Auszahlung pro {formatCurrency(10000)} Forderung</p>
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

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-sm text-emerald-300 mb-1">Dein jährlicher Zinsvorteil</p>
                <p className="text-3xl font-bold text-emerald-400">
                  +{formatCurrency(Math.round(animatedTotalInterest))}
                </p>
                <p className="text-xs text-emerald-400/70 mt-2">
                  Während andere deine Zinsen behalten, zahlen wir sie dir aus.
                </p>
              </div>

              {isB2B && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-300">
                    + {formatCurrency(totalDelayCompensation)} Verzugspauschale (B2B)
                  </p>
                </div>
              )}
            </div>
          </ValueCard>

          {/* Card 2: Zeit-Gewinn */}
          <ValueCard title="Der Zeit-Gewinn" icon={Clock}>
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  {/* Circle background */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="12"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(savedDays / traditionalDays) * 440} 440`}
                      className="transition-all duration-500"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {Math.round(animatedSavedDays)}
                    </span>
                    <span className="text-sm text-slate-400">Tage/Jahr</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-white mb-2">
                  Gewonnene Produktivität
                </p>
                <p className="text-slate-400">
                  Du schenkst deiner Buchhaltung <span className="text-blue-400 font-semibold">{Math.round(savedDays)} volle Arbeitstage</span> pro Jahr zurück.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-slate-700/30 rounded-lg text-center">
                  <p className="text-slate-400">Traditionell</p>
                  <p className="text-white font-semibold">{Math.round(traditionalHours)} Std.</p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-center">
                  <p className="text-blue-300">incaseof.law</p>
                  <p className="text-blue-400 font-semibold">{Math.round(incaseofHours)} Std.</p>
                </div>
              </div>
            </div>
          </ValueCard>

          {/* Card 3: Umsatz-Hebel */}
          <ValueCard title="Der Umsatz-Hebel" icon={TrendingUp}>
            <div className="space-y-6">
              <div className="text-center py-4">
                <p className="text-sm text-slate-400 mb-2">Benötigter Mehrumsatz</p>
                <p className="text-4xl sm:text-5xl font-bold text-white">
                  {formatCurrency(Math.round(animatedRequiredRevenue))}
                </p>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-xl">
                <p className="text-slate-300 leading-relaxed">
                  Bei <span className="text-white font-semibold">{margin}% Marge</span> musst du{' '}
                  <span className="text-amber-400 font-semibold">{formatCurrency(Math.round(requiredRevenue))}</span>{' '}
                  Umsatz generieren, um{' '}
                  <span className="text-white font-semibold">{formatCurrency(totalClaimVolume)}</span>{' '}
                  offene Forderungen auszugleichen.
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-xl">
                <Zap className="w-8 h-8 text-blue-400 shrink-0" />
                <p className="text-sm text-slate-300">
                  <span className="text-white font-semibold">Dein Vertriebs-Joker:</span> Statt neue Kunden zu akquirieren, realisieren wir dein bestehendes Geld.
                </p>
              </div>
            </div>
          </ValueCard>
        </div>

        {/* Reality Check Toggle */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-8">
          <button
            onClick={() => setShowInternalCosts(!showInternalCosts)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-3">
              {showInternalCosts ? (
                <ToggleRight className="w-8 h-8 text-blue-400" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-500" />
              )}
              <div className="text-left">
                <p className="font-medium text-white">Realitäts-Check: Interne Kosten einrechnen?</p>
                <p className="text-sm text-slate-400">
                  Deine Mitarbeiter verbringen Zeit mit Mahnungen statt Wertschöpfung.
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              showInternalCosts ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
            }`}>
              {showInternalCosts ? 'Aktiv' : 'Aus'}
            </span>
          </button>
        </div>

        {/* Summary & CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full mb-6">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400 font-medium">Dein Vorteil mit incaseof.law</span>
          </div>

          <div className="text-5xl sm:text-6xl font-bold text-white mb-4">
            +{formatCurrency(Math.round(animatedLiquidityAdvantage))}
          </div>
          <p className="text-xl text-slate-300 mb-8">
            mehr Liquidität pro Jahr
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://app.incaseof.law"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
            >
              Jetzt {formatCurrency(Math.round(liquidityAdvantage))} Liquidität sichern
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <p className="text-slate-400 mt-4">
            Kostenlos starten. Keine Mitgliedschaft. Keine versteckten Gebühren.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sm:p-8 overflow-x-auto">
          <h3 className="text-xl font-semibold text-white mb-6">Detaillierter Vergleich pro Fall</h3>

          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 text-slate-400 font-medium">Kostenpunkt</th>
                <th className="text-right py-3 text-slate-400 font-medium">Traditionell</th>
                <th className="text-right py-3 text-emerald-400 font-medium">incaseof.law</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr>
                <td className="py-3 text-slate-300">Interner Aufwand (Zeit)</td>
                <td className="py-3 text-right text-slate-400">
                  <div className="flex items-center justify-end gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    {formatCurrency(showInternalCosts ? INTERNAL_COST_PER_CASE : 0)}
                  </div>
                </td>
                <td className="py-3 text-right text-emerald-400">
                  <div className="flex items-center justify-end gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {formatCurrency(showInternalCosts ? INCASEOF_INTERNAL_COST : 0)}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300">Material & Admin</td>
                <td className="py-3 text-right text-slate-400">{formatCurrency(ADMIN_COST_PER_CASE)}</td>
                <td className="py-3 text-right text-emerald-400">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300">Mitgliedsbeitrag (umgelegt)</td>
                <td className="py-3 text-right text-slate-400">{formatCurrency(ksvPerCase, 2)}</td>
                <td className="py-3 text-right text-emerald-400">{formatCurrency(0)}</td>
              </tr>
              <tr>
                <td className="py-3 text-slate-300">Verzugszinsen</td>
                <td className="py-3 text-right text-red-400">
                  <span className="text-xs">(oft einbehalten)</span>
                </td>
                <td className="py-3 text-right text-emerald-400">+{formatCurrency(interestPerCase, 2)}</td>
              </tr>
              {isB2B && (
                <tr>
                  <td className="py-3 text-slate-300">Verzugspauschale (B2B)</td>
                  <td className="py-3 text-right text-slate-400">{formatCurrency(0)}</td>
                  <td className="py-3 text-right text-emerald-400">+{formatCurrency(B2B_DELAY_COMPENSATION)}</td>
                </tr>
              )}
              <tr className="font-semibold">
                <td className="py-4 text-white">Netto pro Fall</td>
                <td className="py-4 text-right text-white">{formatCurrency(traditionalNetPerCase, 2)}</td>
                <td className="py-4 text-right text-emerald-400">{formatCurrency(incaseofNetPerCase, 2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>
            Berechnung basiert auf durchschnittlichen Marktwerten. Tatsächliche Ergebnisse können variieren.
          </p>
          <p className="mt-2">
            © 2026 incaseof.law GmbH · Rathausstraße 21/13, 1010 Wien
          </p>
        </div>
      </div>
    </div>
  );
}
