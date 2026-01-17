"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ComposedChart, Line, Bar, XAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { ArrowRight, ArrowLeft, Info, DollarSign, TrendingUp, AlertTriangle, RefreshCcw, ExternalLink } from 'lucide-react';

// --- Constants (2026 Projection) ---
const CONSTANTS = {
  YMPE: 74600,
  MAX_CPP_65: 1507.65,
  MAX_OAS_65: 742.31,
  OAS_THRESHOLD: 90997,
  INFLATION: 0.021,
  WAGE_GROWTH: 0.021,
  EXPERT_LINK: "https://docs.google.com/forms/d/1EO4O7rEL4ViJKqGbXCUEMNlTMRCdo4h-9BoIxqGttv8/viewform",
};

// --- Shared Components ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900 rounded-xl border border-slate-800 shadow-xl ${className}`}>{children}</div>
);

const Label = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium text-slate-300 mb-2 ${className}`}>{children}</label>
);

const Input = React.forwardRef(({ type = "text", className = "", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    // [FIX] Prevent mouse wheel from changing numbers and allow natural page scroll
    onWheel={(e) => e.target.blur()}
    className={`flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-600 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

const Slider = ({ value, min, max, onChange }) => (
  <div className="relative w-full h-6 flex items-center cursor-pointer group">
    <div className="absolute w-full h-2 bg-slate-700 rounded-full group-hover:bg-slate-600 transition-colors"></div>
    <div className={`absolute h-2 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors`} style={{ width: `${((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100}%` }}></div>
    <input type="range" min={min} max={max} value={value || min} onChange={onChange} tabIndex={-1} className="absolute w-full h-full opacity-0 cursor-pointer" />
    <div className="absolute h-5 w-5 bg-white rounded-full shadow-lg border-2 border-indigo-500 pointer-events-none transition-all group-hover:scale-110" style={{ left: `calc(${((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100}% - 10px)` }}></div>
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-12 px-6";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-white",
  };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const Toggle = ({ checked, onCheckedChange, label, labelClassName = "text-sm" }) => (
  <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onCheckedChange(!checked)}>
    <div className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${checked ? 'bg-indigo-600' : 'bg-slate-700'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-4' : ''}`}></div>
    </div>
    <span className={`${labelClassName} text-slate-400 group-hover:text-slate-200 transition-colors select-none`}>{label}</span>
  </div>
);

// --- Page Component (Content Only - No Footer Here) ---
export default function RetireMinutePage() {
  const [step, setStep] = useState(1);
  const firstInputRef = useRef(null);

  // Tooltip States
  const [showAvgIncomeInfo, setShowAvgIncomeInfo] = useState(false);
  const [showOtherIncomeInfo, setShowOtherIncomeInfo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { if (firstInputRef.current) firstInputRef.current.focus(); }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  const [formData, setFormData] = useState({
    currentAge: 35,
    retirementAge: 65,
    province: 'Ontario',
    currentIncome: 50000,
    careerAvgIncome: 50000,
    useCurrentIncomeForAvg: false,
    otherRetirementIncome: 0,
    yearsInCanada: 40,
    yearsWorked: 30,
    childRearingYears: 0,
    hasPension: 'None',
    pensionYears: 20,
    pensionSalary: 50000,
    useAutoPensionCalc: false,
  });

  const [results, setResults] = useState(null);
  const [viewMode, setViewMode] = useState('today');

  const handleChange = (field, value) => {
    if (field === 'province' || field === 'hasPension') {
      setFormData(prev => ({ ...prev, [field]: value }));
      return;
    }
    const num = parseInt(value);
    if (value === '') setFormData(prev => ({ ...prev, [field]: '' }));
    else if (!isNaN(num)) setFormData(prev => ({ ...prev, [field]: num }));
  };

  const handleToggleChange = (field, value, clearField) => {
    setFormData(prev => ({ ...prev, [field]: value, [clearField]: value ? 0 : prev[clearField] }));
  };

  const calculateRetirement = () => {
    const { currentAge, retirementAge, currentIncome, careerAvgIncome, otherRetirementIncome, yearsInCanada, yearsWorked, childRearingYears, pensionYears, pensionSalary, hasPension, useAutoPensionCalc, useCurrentIncomeForAvg } = formData;

    const yearsToRetire = Math.max(0, retirementAge - currentAge);
    const inflationFactor = Math.pow(1 + CONSTANTS.INFLATION, yearsToRetire);
    const wageGrowthFactor = Math.pow(1 + CONSTANTS.WAGE_GROWTH, yearsToRetire);

    // OAS Base
    let oasAmount = (Math.min(yearsInCanada, 40) / 40) * CONSTANTS.MAX_OAS_65;
    if (retirementAge < 65) oasAmount -= oasAmount * 0.072 * (65 - retirementAge);
    if (retirementAge > 65) oasAmount += oasAmount * 0.084 * (retirementAge - 65);

    // CPP
    const effectiveAvgIncome = useCurrentIncomeForAvg ? currentIncome : careerAvgIncome;
    const earningsRatio = Math.min(effectiveAvgIncome / CONSTANTS.YMPE, 1.0);
    const contributionFactor = Math.min(yearsWorked + (childRearingYears * 0.5), 39) / 39;
    let cppAmount = CONSTANTS.MAX_CPP_65 * earningsRatio * contributionFactor;
    if (retirementAge < 65) cppAmount -= cppAmount * 0.072 * (65 - retirementAge);
    if (retirementAge > 65) cppAmount += cppAmount * 0.084 * (retirementAge - 65);

    // Workplace Pension
    let pensionAmount = 0;
    if (hasPension !== 'None') {
      let baseSalary = useAutoPensionCalc ? currentIncome : pensionSalary;
      const best5AvgSalaryFuture = baseSalary * wageGrowthFactor;
      const ympeFuture = CONSTANTS.YMPE * wageGrowthFactor;
      const annualPensionFuture = (0.013 * Math.min(best5AvgSalaryFuture, ympeFuture) * pensionYears) + (0.02 * Math.max(0, best5AvgSalaryFuture - ympeFuture) * pensionYears);
      pensionAmount = (annualPensionFuture / 12) / inflationFactor;
    }

    // OAS Clawback
    const otherIncomeValAnnual = Number(otherRetirementIncome) || 0;
    const totalRetireAnnualToday = (cppAmount + pensionAmount + oasAmount) * 12 + otherIncomeValAnnual;

    if (totalRetireAnnualToday > CONSTANTS.OAS_THRESHOLD) {
      const clawbackMonthly = ((totalRetireAnnualToday - CONSTANTS.OAS_THRESHOLD) * 0.15) / 12;
      oasAmount = Math.max(0, oasAmount - clawbackMonthly);
    }

    setResults({ oas: oasAmount, cpp: cppAmount, pension: pensionAmount, currentMonthlyIncome: currentIncome / 12, inflationFactor, targetAge: retirementAge, province: formData.province });
  };

  const handleNext = () => { if (step === 4) calculateRetirement(); setStep(prev => prev + 1); };
  const handleBack = () => setStep(prev => prev - 1);
  const handleStartOver = () => { setStep(1); setViewMode('today'); setResults(null); };

  const renderStep1 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
          Gain clarity on your <br className="md:hidden" /> retirement cash flow
        </h1>
        <p className="text-slate-400 text-base max-w-xs mx-auto md:max-w-md">
          Calculate your CPP, OAS, and pensions in <span className="text-indigo-400 font-semibold">60 seconds</span>.<br /> No sign-up needed.
        </p>
      </div>
      <Card className="p-5 space-y-6">
        <div><Label>Current Age</Label><div className="flex items-center space-x-4"><div className="flex-1"><Slider min={18} max={70} value={formData.currentAge} onChange={(e) => handleChange('currentAge', e.target.value)} /></div><div className="w-20"><Input ref={firstInputRef} type="number" className="text-center" value={formData.currentAge} onChange={(e) => handleChange('currentAge', e.target.value)} /></div></div></div>
        <div><Label>Target Retirement Age</Label><p className="text-xs text-slate-500 mb-3 flex items-center"><Info className="w-3 h-3 mr-1" /> Standard retirement age in Canada is 65.</p><div className="flex items-center space-x-4"><div className="flex-1"><Slider min={50} max={75} value={formData.retirementAge} onChange={(e) => handleChange('retirementAge', e.target.value)} /></div><div className="w-20"><Input type="number" className="text-center" value={formData.retirementAge} onChange={(e) => handleChange('retirementAge', e.target.value)} /></div></div></div>
        <div><Label>Province</Label><select className="w-full h-12 rounded-lg border border-slate-700 bg-slate-800 px-4 text-white appearance-none focus:ring-2 focus:ring-indigo-500" value={formData.province} onChange={(e) => handleChange('province', e.target.value)}>{["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"].map(p => <option key={p} value={p}>{p}</option>)}</select></div>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2"><h2 className="text-3xl font-bold text-white">Financial Overview</h2><p className="text-slate-400">This info helps estimate your overall government benefits.</p></div>
      <Card className="p-6 space-y-8">
        <div><Label>Current Annual Income (Pre-tax)</Label><div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><Input ref={firstInputRef} type="number" className="pl-12" value={formData.currentIncome} onChange={(e) => handleChange('currentIncome', e.target.value)} /></div></div>
        <div>
          <div className={`transition-all duration-300 ${formData.useCurrentIncomeForAvg ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center gap-2 mb-2"><Label className="mb-0">Estimated Career Average Income</Label><button onClick={() => setShowAvgIncomeInfo(!showAvgIncomeInfo)} className="text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"><Info size={16} /></button></div>
            {showAvgIncomeInfo && <div className="mb-3 p-3 bg-indigo-900/30 border border-indigo-800 rounded-lg text-xs text-indigo-200 leading-relaxed animate-in fade-in slide-in-from-top-1">CPP/QPP benefits are calculated based on your average earnings from <strong>age 18 to retirement</strong>. Estimating this helps improve accuracy.</div>}
            <div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><Input type="number" className="pl-12" value={formData.careerAvgIncome} onChange={(e) => handleChange('careerAvgIncome', e.target.value)} /></div>
            <p className="text-xs text-slate-500 mt-1 pl-1">Enter in today's dollars (current value).</p>
          </div>
          <div className="mt-2 pl-1"><Toggle label="Not sure? Auto-calculate using current income." checked={formData.useCurrentIncomeForAvg} onCheckedChange={(v) => handleToggleChange('useCurrentIncomeForAvg', v, 'careerAvgIncome')} labelClassName="text-xs" /></div>
        </div>
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Label className="mb-0">Other Annual Retirement Income (RRSP, etc.)</Label>
            <button onClick={() => setShowOtherIncomeInfo(!showOtherIncomeInfo)} className="text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"><Info size={16} /></button>
          </div>
          {showOtherIncomeInfo && (
            <div className="mb-3 p-3 bg-indigo-900/30 border border-indigo-800 rounded-lg text-xs text-indigo-200 leading-relaxed animate-in fade-in slide-in-from-top-1">
              Enter annual taxable income (e.g., RRSP/RRIF withdrawals, rental income).<br />
              <strong className="block mt-1 text-white">Do NOT include:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-indigo-300">
                <li>TFSA withdrawals (Tax-free, no effect on OAS)</li>
                <li>CPP, OAS, or Workplace Pension (Calculated automatically in the final step)</li>
              </ul>
            </div>
          )}
          <div className="relative mb-2"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><Input type="number" className="pl-12" value={formData.otherRetirementIncome} onChange={(e) => handleChange('otherRetirementIncome', e.target.value)} /></div>
          <p className="text-xs text-slate-500 mt-1 pl-1">This determines if your OAS is subject to recovery tax (clawback).</p>
        </div>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2"><h2 className="text-3xl font-bold text-white tracking-tight">Eligibility</h2><p className="text-slate-400">Residency and work history.</p></div>
      <Card className="p-6 space-y-8">
        <div>
          <Label>Years Living in Canada (Age 18 to Retirement)</Label>
          <div className="flex items-center space-x-4"><div className="flex-1"><Slider min={0} max={60} value={formData.yearsInCanada} onChange={(e) => handleChange('yearsInCanada', e.target.value)} /></div><div className="w-20"><Input ref={firstInputRef} type="number" className="text-center" value={formData.yearsInCanada} onChange={(e) => handleChange('yearsInCanada', e.target.value)} /></div></div>
          <p className="text-xs text-slate-500 mt-2">This determines your Old Age Security (OAS) amount.</p>
        </div>
        <div>
          <Label>Years Working in Canada (Age 18 to Retirement)</Label>
          <div className="flex items-center space-x-4"><div className="flex-1"><Slider min={0} max={60} value={formData.yearsWorked} onChange={(e) => handleChange('yearsWorked', e.target.value)} /></div><div className="w-20"><Input type="number" className="text-center" value={formData.yearsWorked} onChange={(e) => handleChange('yearsWorked', e.target.value)} /></div></div>
          <p className="text-xs text-slate-500 mt-2">This determines your CPP benefit amount.</p>
        </div>
      </Card>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2"><h2 className="text-3xl font-bold text-white tracking-tight">Adjustments</h2><p className="text-slate-400">Life events and pension plans.</p></div>
      <Card className="p-6 space-y-8">
        <div>
          <Label>Raising Children (Under 7)</Label>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">Did you take time off or work less to care for children under 7? We exclude these years so they don't lower your average.</p>
          <div className="flex items-center space-x-4"><div className="flex-1"><Slider min={0} max={40} value={formData.childRearingYears} onChange={(e) => handleChange('childRearingYears', e.target.value)} /></div><div className="w-20"><Input ref={firstInputRef} type="number" className="text-center" value={formData.childRearingYears} onChange={(e) => handleChange('childRearingYears', e.target.value)} /></div><span className="text-slate-400 text-sm font-medium">Years</span></div>
        </div>
        <div>
          <Label>Workplace Pension Plan</Label>
          <div className="relative mb-6">
            <select className="w-full h-12 rounded-lg border border-slate-700 bg-slate-800 px-4 text-white appearance-none" value={formData.hasPension} onChange={(e) => handleChange('hasPension', e.target.value)}>
              {["None", "OMERS", "HOOPP", "OTPP", "Federal", "Other"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
          </div>
          {formData.hasPension !== 'None' && <div className="mt-4 p-4 bg-slate-800/50 rounded-lg space-y-4">
            <div><Label>Years of Service at Retirement</Label><div className="flex items-center space-x-4"><div className="flex-1"><Slider min={0} max={40} value={formData.pensionYears} onChange={(e) => handleChange('pensionYears', e.target.value)} /></div><div className="w-20"><Input type="number" className="text-center" value={formData.pensionYears} onChange={(e) => handleChange('pensionYears', e.target.value)} /></div><span className="text-slate-400 text-sm font-medium">Years</span></div></div>
            <div><div className={formData.useAutoPensionCalc ? 'opacity-50 pointer-events-none' : ''}><Label>Best 5-Year Average Salary</Label><div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" /><Input type="number" className="pl-12" placeholder={formData.useAutoPensionCalc ? "Auto-calculating..." : ""} value={formData.pensionSalary} onChange={(e) => handleChange('pensionSalary', e.target.value)} /></div><p className="text-xs text-slate-500 mt-1 pl-1">Enter in today's dollars (current value).</p></div><div className="pl-1 pt-2"><Toggle label="Not sure? Auto-calculate using current income." checked={formData.useAutoPensionCalc} onCheckedChange={(val) => handleToggleChange('useAutoPensionCalc', val, 'pensionSalary')} labelClassName="text-xs" /></div></div>
          </div>}
        </div>
      </Card>
    </div>
  );

  const renderResults = () => {
    if (!results) return null;
    const isToday = viewMode === 'today';
    const inf = isToday ? 1 : results.inflationFactor;
    const totalRetire = (results.oas + results.cpp + results.pension) * inf;
    const pensionLabel = results.province === 'Quebec' ? 'QPP' : 'CPP';
    const shortfall = Math.max(0, (isToday ? results.currentMonthlyIncome : (results.currentMonthlyIncome * inf)) - totalRetire);

    const chartData = [
      {
        name: 'Current',
        Amount: isToday ? Math.round(results.currentMonthlyIncome) : 0,
        OAS: 0, CPP: 0, Pension: 0,
        Total: isToday ? Math.round(results.currentMonthlyIncome) : 0,
        fill: '#22d3ee'
      },
      {
        name: 'Retired',
        Amount: 0,
        OAS: Math.round(results.oas * inf),
        CPP: Math.round(results.cpp * inf),
        Pension: Math.round(results.pension * inf),
        Total: Math.round(totalRetire)
      }
    ].filter(d => isToday || d.name === 'Retired');

    const f = (v) => v ? `$${Math.round(v).toLocaleString()}` : '';

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800"><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-white">Retired at {results.targetAge}</h3><div className="bg-slate-800 p-1 rounded-lg flex"><button onClick={() => setViewMode('today')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Today's Value</button><button onClick={() => setViewMode('future')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Future Value</button></div></div><div className="grid grid-cols-2 gap-4 text-center divide-x divide-slate-800"><div><p className="text-slate-500 text-xs font-bold uppercase">Projected Monthly</p><p className="text-2xl font-bold text-white">${Math.round(totalRetire).toLocaleString()}</p></div><div><p className="text-slate-500 text-xs font-bold uppercase">Projected Yearly</p><p className="text-2xl font-bold text-white">${Math.round(totalRetire * 12).toLocaleString()}</p></div></div></div>
        <Card className="p-6 h-80 relative">
          <h3 className="text-center text-slate-300 font-bold mb-4">Monthly Income</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 30, right: 10, left: 10, bottom: 0 }} barGap={5}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} formatter={(v, n) => n === 'Total' ? [null, null] : [`$${Math.round(v).toLocaleString()}`, n === 'CPP' ? pensionLabel : n]} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px' }} payload={[{ value: 'Current', type: 'circle', id: 'Amount', color: '#22d3ee' }, { value: 'OAS', type: 'circle', id: 'OAS', color: '#10b981' }, { value: pensionLabel, type: 'circle', id: 'CPP', color: '#3b82f6' }, { value: 'Pension', type: 'circle', id: 'Pension', color: '#8b5cf6' }].filter(item => isToday || item.value !== 'Current')} />

              {/* Fixed Total Label (No Dot) */}
              <Line type="monotone" dataKey="Total" stroke="transparent" strokeWidth={0} dot={() => null} activeDot={() => null} legendType="none">
                <LabelList position="top" fill="#fff" formatter={f} fontSize={14} fontWeight="bold" />
              </Line>

              {/* Current Bar - No internal LabelList */}
              {isToday && <Bar dataKey="Amount" stackId="a" fill="#22d3ee" name="Current" barSize={60} />}

              <Bar dataKey="OAS" stackId="a" fill="#10b981" name="OAS" barSize={60}><LabelList dataKey="OAS" position="center" fill="white" formatter={f} fontSize={10} fontWeight="bold" /></Bar>
              <Bar dataKey="CPP" stackId="a" fill="#3b82f6" name={pensionLabel} barSize={60}><LabelList dataKey="CPP" position="center" fill="white" formatter={f} fontSize={10} fontWeight="bold" /></Bar>
              <Bar dataKey="Pension" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Pension" barSize={60}><LabelList dataKey="Pension" position="center" fill="white" formatter={f} fontSize={10} fontWeight="bold" /></Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
        {isToday && shortfall > 0 && <div className="bg-rose-950/30 border border-rose-900 rounded-xl p-5 flex flex-col items-center gap-2"><div className="flex items-center gap-2 text-rose-500"><AlertTriangle size={18} /><h3 className="font-bold">Monthly Shortfall</h3></div><p className="text-2xl font-bold text-rose-500">${Math.round(shortfall).toLocaleString()}</p></div>}
        <Button className="w-full h-14" onClick={() => window.open(CONSTANTS.EXPERT_LINK, '_blank')}>Consult an Expert <ExternalLink className="ml-2 w-4 h-4" /></Button>
        <p className="text-center text-xs text-slate-600">* Estimates based on FP Canada 2025 & 2026 tax constants.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 relative">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleStartOver} title="Back to Home"><TrendingUp className="text-indigo-500" size={24} /><span className="font-bold text-lg tracking-tight text-white">RetireMinute CA</span></div>
        <div className="flex space-x-1.5">{[1, 2, 3, 4].map(i => <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'bg-indigo-500 w-6' : 'bg-slate-800 w-2'}`} />)}</div>
      </header>
      <main className="flex-1 w-full max-w-md mx-auto p-6 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="flex-1">{step === 1 && renderStep1()}{step === 2 && renderStep2()}{step === 3 && renderStep3()}{step === 4 && renderStep4()}{step === 5 && renderResults()}</div>
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-row-reverse justify-between items-center mb-10">
            {step < 5 ? <Button onClick={handleNext} className="w-32">Next <ArrowRight className="ml-2 w-4 h-4" /></Button> : <Button variant="outline" onClick={handleStartOver} className="text-xs ml-auto border-slate-700 text-slate-400 hover:text-white"><RefreshCcw className="mr-2 w-3 h-3" /> Start Over</Button>}
            {step > 1 && <Button variant="ghost" onClick={handleBack} disabled={step === 1} className={step === 1 ? 'opacity-0' : ''}><ArrowLeft className="mr-2 w-4 h-4" /> Back</Button>}
          </div>
        </div>
        {/* Footer removed to avoid duplication with Layout.js */}
      </main>
    </div>
  );
}