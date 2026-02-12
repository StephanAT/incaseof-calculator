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
  Sparkles,
  Scale,
  ShieldCheck,
  BadgePercent,
  FileWarning,
  Archive
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

// Slider Input Component
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

// Toggle Switch Component
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

// Comparison Row Component
function ComparisonRow({ label, icon: Icon, traditional, incaseof, isHighlight = false, isBetter = true }) {
  return (
    <tr className={isHighlight ? 'bg-green-50/50' : ''}>
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isHighlight ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Icon className={`w-4 h-4 ${isHighlight ? 'text-green-600' : 'text-gray-500'}`} />
          </div>
          <span className="text-gray-900 font-medium">{label}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {!isBetter && <XCircle className="w-4 h-4 text-red-400" />}
          <span className="text-gray-600">{traditional}</span>
        </div>
      </td>
      <td className="py-4 pl-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {isBetter && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          <span className={`font-semibold ${isBetter ? 'text-green-600' : 'text-gray-600'}`}>{incaseof}</span>
        </div>
      </td>
    </tr>
  );
}

// Mini Value Card Component
function MiniValueCard({ title, value, subtitle, icon: Icon, color = 'green' }) {
  const colorClasses = {
    green: 'bg-green-50 border-green-100 text-green-600',
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600'
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium text-gray-600">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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
  const INTERNAL_COST_PER_CASE = 25; // € (30 min @ 50€/h)
  const ADMIN_COST_PER_CASE = 12; // €
  const KSV_ANNUAL_FEE = 300; // €
  const TRADITIONAL_INKASSO_FEE_PERCENT = 15; // % der Forderung
  const TRADITIONAL_EVIDENCE_FEE = 5; // € pro Fall
  const TRADITIONAL_DEFAULT_RATE = 25; // % Forderungsausfall
  const INCASEOF_DEFAULT_RATE = 12; // % Forderungsausfall (effektiver)
  const INCASEOF_INTERNAL_COST = 1.5; // € (2 min)
  const B2B_DELAY_COMPENSATION = 40; // € Verzugspauschale

  // Calculations
  const totalClaimVolume = casesPerYear * avgClaimAmount;
  const requiredRevenue = totalClaimVolume / (margin / 100);

  // Traditional costs
  const ksvPerCase = KSV_ANNUAL_FEE / Math.max(casesPerYear, 1);
  const traditionalInkassoFee = avgClaimAmount * (TRADITIONAL_INKASSO_FEE_PERCENT / 100);
  const traditionalDefaultLoss = avgClaimAmount * (TRADITIONAL_DEFAULT_RATE / 100);
  const traditionalInternalCost = showInternalCosts ? INTERNAL_COST_PER_CASE : 0;
  const traditionalTotalCostPerCase = traditionalInternalCost + ADMIN_COST_PER_CASE + ksvPerCase + traditionalInkassoFee + TRADITIONAL_EVIDENCE_FEE + traditionalDefaultLoss;

  // incaseof costs
  const incaseofDefaultLoss = avgClaimAmount * (INCASEOF_DEFAULT_RATE / 100);
  const incaseofInternalCost = showInternalCosts ? INCASEOF_INTERNAL_COST : 0;
  const incaseofTotalCostPerCase = incaseofInternalCost + incaseofDefaultLoss;

  // B2B bonus
  const b2bBonus = isB2B ? B2B_DELAY_COMPENSATION : 0;

  // Net per case
  const traditionalNetPerCase = avgClaimAmount - traditionalTotalCostPerCase;
  const incaseofNetPerCase = avgClaimAmount - incaseofTotalCostPerCase + b2bBonus;

  // Totals
  const traditionalNetTotal = traditionalNetPerCase * casesPerYear;
  const incaseofNetTotal = incaseofNetPerCase * casesPerYear;

  // Time savings
  const traditionalHours = (casesPerYear * 30) / 60;
  const incaseofHours = (casesPerYear * 2) / 60;
  const savedHours = traditionalHours - incaseofHours;
  const savedDays = savedHours / 8;

  // Advantage
  const liquidityAdvantage = incaseofNetTotal - traditionalNetTotal;
  const savingsPerCase = incaseofNetPerCase - traditionalNetPerCase;

  // Animated values
  const animatedLiquidityAdvantage = useAnimatedNumber(liquidityAdvantage);
  const animatedRequiredRevenue = useAnimatedNumber(requiredRevenue);
  const animatedSavedDays = useAnimatedNumber(savedDays);
  const animatedSavingsPerCase = useAnimatedNumber(savingsPerCase);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Liquiditäts-Rechner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Wie viel <span className="text-green-600">mehr</span> bleibt bei dir?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Vergleiche traditionelles Inkasso mit incaseof.law – transparent und fair.
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
            <div className="flex justify-center">
              <ToggleSwitch isB2B={isB2B} onChange={setIsB2B} />
            </div>

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

        {/* Main Content: Comparison (2/3) + Cards (1/3) */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">

          {/* Left: Comparison Table (2/3) */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-xl">
                  <Scale className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Kostenvergleich pro Fall</h3>
              </div>
              <div className="text-sm text-gray-500">
                bei {formatCurrency(avgClaimAmount)} Forderung
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-3 pr-4 text-gray-500 font-medium">Kostenpunkt</th>
                    <th className="py-3 px-4 text-center text-gray-500 font-medium">Traditionell</th>
                    <th className="py-3 pl-4 text-center text-green-600 font-medium">incaseof.law</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <ComparisonRow
                    label="Interner Aufwand"
                    icon={Clock}
                    traditional={formatCurrency(traditionalInternalCost)}
                    incaseof={formatCurrency(incaseofInternalCost)}
                    isBetter={true}
                  />
                  <ComparisonRow
                    label="Material & Admin"
                    icon={FileStack}
                    traditional={formatCurrency(ADMIN_COST_PER_CASE)}
                    incaseof={formatCurrency(0)}
                    isBetter={true}
                  />
                  <ComparisonRow
                    label="Mitgliedsbeitrag (anteilig)"
                    icon={BadgePercent}
                    traditional={formatCurrency(ksvPerCase, 2)}
                    incaseof={formatCurrency(0)}
                    isBetter={true}
                  />
                  <ComparisonRow
                    label="Inkassogebühren"
                    icon={Wallet}
                    traditional={`${TRADITIONAL_INKASSO_FEE_PERCENT}% = ${formatCurrency(traditionalInkassoFee)}`}
                    incaseof={formatCurrency(0)}
                    isHighlight={true}
                    isBetter={true}
                  />
                  <ComparisonRow
                    label="Evidenzhaltung"
                    icon={Archive}
                    traditional={formatCurrency(TRADITIONAL_EVIDENCE_FEE)}
                    incaseof="Kostenlos"
                    isBetter={true}
                  />
                  <ComparisonRow
                    label="Forderungsausfall"
                    icon={FileWarning}
                    traditional={`${TRADITIONAL_DEFAULT_RATE}% = ${formatCurrency(traditionalDefaultLoss)}`}
                    incaseof={`${INCASEOF_DEFAULT_RATE}% = ${formatCurrency(incaseofDefaultLoss)}`}
                    isHighlight={true}
                    isBetter={true}
                  />
                  {isB2B && (
                    <ComparisonRow
                      label="Verzugspauschale (B2B)"
                      icon={ShieldCheck}
                      traditional={formatCurrency(0)}
                      incaseof={`+${formatCurrency(B2B_DELAY_COMPENSATION)}`}
                      isBetter={true}
                    />
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200 bg-gray-50">
                    <td className="py-4 pr-4">
                      <span className="text-gray-900 font-bold text-lg">Netto pro Fall</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-600 font-bold text-lg">{formatCurrency(traditionalNetPerCase)}</span>
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <span className="text-green-600 font-bold text-lg">{formatCurrency(incaseofNetPerCase)}</span>
                    </td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="py-4 pr-4 rounded-bl-2xl">
                      <span className="text-green-700 font-bold">Dein Vorteil pro Fall</span>
                    </td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 pl-4 text-center rounded-br-2xl">
                      <span className="text-green-600 font-bold text-xl">+{formatCurrency(Math.round(animatedSavingsPerCase))}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Internal costs toggle */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setShowInternalCosts(!showInternalCosts)}
                className="flex items-center gap-3 text-sm"
              >
                {showInternalCosts ? (
                  <ToggleRight className="w-6 h-6 text-green-600" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
                <span className="text-gray-600">
                  Interne Personalkosten einrechnen
                  <span className="text-gray-400 ml-1">(30 Min. à €50/Std.)</span>
                </span>
              </button>
            </div>
          </div>

          {/* Right: Value Cards (1/3) */}
          <div className="space-y-4">

            {/* Card 1: Liquiditäts-Boost */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-green-200" />
                <span className="text-green-100 font-medium">Liquiditäts-Boost</span>
              </div>
              <div className="text-4xl font-bold mb-1">
                +{formatCurrency(Math.round(animatedLiquidityAdvantage))}
              </div>
              <p className="text-green-200 text-sm">
                mehr Liquidität pro Jahr
              </p>
              <div className="mt-4 pt-4 border-t border-green-500/30">
                <p className="text-green-100 text-xs">
                  Bei {casesPerYear} Fällen à {formatCurrency(avgClaimAmount)}
                </p>
              </div>
            </div>

            {/* Card 2: Zeit-Gewinn */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 font-medium">Zeit-Gewinn</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-gray-900">{Math.round(animatedSavedDays)}</span>
                <span className="text-gray-500 mb-1">Arbeitstage/Jahr</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Produktivität zurück für dein Team
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <p className="text-gray-400 text-xs">Vorher</p>
                  <p className="text-gray-700 font-semibold">{Math.round(traditionalHours)} Std.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-2 text-center">
                  <p className="text-green-600 text-xs">Nachher</p>
                  <p className="text-green-700 font-semibold">{Math.round(incaseofHours)} Std.</p>
                </div>
              </div>
            </div>

            {/* Card 3: Umsatz-Hebel */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-gray-600 font-medium">Umsatz-Hebel</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatCurrency(Math.round(animatedRequiredRevenue))}
              </div>
              <p className="text-gray-500 text-sm">
                Umsatz nötig, um {formatCurrency(totalClaimVolume)} Verlust bei {margin}% Marge auszugleichen.
              </p>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-amber-700 text-xs flex items-start gap-2">
                  <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Statt neue Kunden zu jagen, realisieren wir dein bestehendes Geld.</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Dein jährlicher Vorteil</span>
          </div>

          <div className="text-5xl sm:text-6xl font-bold text-green-600 mb-2">
            +{formatCurrency(Math.round(animatedLiquidityAdvantage))}
          </div>
          <p className="text-xl text-gray-500 mb-8">
            mehr Liquidität mit incaseof.law
          </p>

          <a
            href="https://app.incaseof.law"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Jetzt {formatCurrency(Math.round(liquidityAdvantage))} sichern
            <ArrowRight className="w-5 h-5" />
          </a>

          <p className="text-gray-400 mt-4 text-sm">
            Kostenlos starten · Keine Mitgliedschaft · Keine versteckten Gebühren
          </p>
        </div>

      </div>
    </div>
  );
}
