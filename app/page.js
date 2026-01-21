"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { ArrowRight, ArrowLeft, Info, DollarSign, TrendingUp, AlertTriangle, RefreshCcw, ExternalLink, Calculator, X, Scale, Share2, CheckCircle2, PieChart, Download, ToggleRight, ToggleLeft, ChevronDown, ChevronUp, Lightbulb, PartyPopper, Globe, HelpCircle, Lock, Shield } from 'lucide-react';

// --- [설정] GA4 측정 ID 입력란 ---
// 발급받은 'G-XXXXXXX' 코드를 아래 따옴표 안에 넣으세요.
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

// --- 미리보기 환경 호환성을 위한 임시 Link 컴포넌트 ---
const Link = ({ href, children, className, ...props }) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

// --- Google Analytics Helper ---
// 윈도우 객체에 gtag가 있는지 확인하고 이벤트를 전송하는 안전한 함수
const trackEvent = (action, category, label, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
    // 개발 모드 확인용 로그 (배포 전 삭제 가능)
    console.log(`📡 GA4 Event: ${action}`, { category, label, value });
  }
};

if (typeof window !== 'undefined') {
  window.gtag = window.gtag || function() { (window.dataLayer = window.dataLayer || []).push(arguments); };
}

// --- 다국어 사전 (TRANSLATIONS) ---
const TRANSLATIONS = {
  en: {
    title_main: "RetireMinute",
    hero_title: "Retire with Confidence.",
    hero_subtitle: <>Calculate your CPP & OAS in <span className="text-indigo-400 font-semibold">60 seconds</span>. <span className="inline-block"><Lock size={12} className="inline mb-0.5"/> No login, no email, just results.</span></>,
    guides_link: "Guides",
    current_age: "Current Age",
    target_retirement_age: "Target Retirement Age",
    standard_age_note: "Standard retirement age in Canada is 65.",
    province: "Province",
    next: "Next",
    back: "Back",
    financial_overview: "Financial Overview",
    financial_subtitle: "Let's build your financial snapshot.",
    annual_income: "Current Annual Income (Pre-tax)",
    career_avg: "Estimated Career Average Income",
    other_income: "Other Annual Retirement Income (RRSP, etc.)",
    eligibility: "Eligibility",
    residency: "Years Living in Canada (Age 18 to Retirement)",
    work_history: "Years Working in Canada (Age 18 to Retirement)",
    adjustments: "Adjustments",
    child_rearing: "Raising Children (Under 7)",
    child_rearing_note: "Enter the total number of years you had low or no income to care for a child under 7. (For multiple children, count the total calendar years, do not simply multiply.)",
    pension_plan: "Workplace Pension Plan",
    pension_years: "Years of Service at Retirement",
    best_5_salary: "Best 5-Year Average Salary",
    results_title: "Retired at",
    today_val: "Today's Value",
    future_val: "Future Value",
    monthly: "MONTHLY",
    yearly: "YEARLY",
    comparison_title: "Monthly Income Comparison",
    compare_scenarios: "Compare Scenarios",
    show_after_tax: "Show After-Tax (Net)",
    breakdown: "Income Breakdown",
    source: "Source",
    diff: "Diff",
    gap_analysis: "Reality Check",
    shortfall_label: "Income Gap to Fill",
    surplus_label: "Monthly Surplus",
    savings_label: "Savings Needed",
    target_70_label: "Target: 70% of Net Income",
    target_70_tooltip: "Why 70%? In retirement, you typically have reduced expenses (no mortgage, no CPP/EI contributions, no commute, and no need to save for retirement). 70% of your current net income is the standard benchmark to maintain your lifestyle.",
    savings_desc_combined: "Monthly savings needed from today until retirement to cover your shortfall from retirement to age 90.",
    savings_tooltip_detail: "This calculation assumes a 5% real investment return and accounts for the 10% OAS increase at age 75. It projects your cash flow year-by-year until age 90.",
    surplus_desc: "You are On Track! Your projected income exceeds the 70% target.",
    expert_shortfall: "See How to Fix This Gap",
    expert_surplus: "Maximize My Wealth",
    download_pdf: "Download PDF Report",
    new_calc: "New Calc",
    copy_results: "Copy Results",
    copied: "Copied!",
    legal: "Legal & Privacy",
    disclaimer_footer: "* Estimates based on FP Canada 2025 & 2026 tax constants. These figures are for informational purposes and subject to change based on government legislation.",
    tax_note: "Estimated based on {province} 2026 tax brackets. Includes Age Amount tax credit logic if applicable.",
    warn_retire_age: "Retirement age cannot be earlier than your current age.",
    warn_residency_max: "OAS residency is counted after age 18. Max possible is {val} years.",
    warn_worked_max: "Cannot exceed years living in Canada.",
    warn_pension_max: "Cannot exceed total years worked in Canada.",
    note_residency: "This determines your Old Age Security (OAS) amount.",
    note_work_history: "This determines your CPP/QPP benefit amount.",
    note_todays_dollars: "Enter estimate in Today's Dollars.",
    cpp_enhancement_note: "Note: Includes estimated Enhanced CPP benefits for your age group.",
    info_career_avg: (
      <>
        We've started you off with averages. Adjust to fit your life:<br/><br/>
        • <strong>Early Career:</strong> Expect significant salary growth? → <strong>Enter a higher amount.</strong><br/>
        • <strong>Peak Earner:</strong> Was your past income lower? → <strong>Enter a lower amount.</strong>
      </>
    ),
    info_other_income: (
      <>
        Enter annual taxable income (e.g., RRSP/RRIF withdrawals, rental income).<br />
        <strong className="block mt-1 text-white">Do NOT include:</strong>
        <ul className="list-disc pl-4 mt-1 space-y-1 text-indigo-300">
          <li>TFSA withdrawals (Tax-free, no effect on OAS)</li>
          <li>CPP/QPP, OAS, or Workplace Pension (Calculated automatically in the final step)</li>
        </ul>
      </>
    ),
    info_pension_salary: "Assumes your career level remains constant. We use your current income to estimate your future best 5-year average. Adjust amount if you expect significant promotions or changes.",
    faq_section: "Frequently Asked Questions",
    blog_section: "Retirement Planning Guides",
    pension_note: "* Pension reduced by 3% per year before age 65",
    total_net: "TOTAL (Net)",
    total_gross: "TOTAL (Gross)",
    trust_marker: "Based on FP Canada Standards",
    legal_box_title: "Important Disclaimer",
    legal_box_text: "This calculator is for educational purposes only and does not constitute financial advice. Results are estimates based on 2026 FP Canada assumptions. Actual amounts may vary. We do not store your data.",
    step_indicator: "Step {current} of 4",
    step_1_label: "Basics",
    step_2_label: "Income",
    step_3_label: "History",
    step_4_label: "Details",
  },
  ko: {
    title_main: "RetireMinute",
    hero_title: "자신감 있는 은퇴를 준비하세요.",
    hero_subtitle: <>60초 만에 CPP와 OAS를 계산하세요.<br className="md:hidden"/> <span className="inline-block"><Lock size={12} className="inline mb-0.5"/> 로그인·이메일 없이 바로 확인하는 내 연금 리포트</span></>,
    guides_link: "가이드",
    current_age: "현재 나이",
    target_retirement_age: "희망 은퇴 연령",
    standard_age_note: "캐나다의 표준 은퇴 연령은 65세입니다.",
    province: "거주 주",
    next: "다음",
    back: "이전",
    financial_overview: "재정 정보",
    financial_subtitle: "재무 스냅샷을 함께 만들어봅시다.",
    annual_income: "현재 연간 소득 (세전)",
    career_avg: "예상 평생 평균 소득",
    other_income: "기타 은퇴 소득 (RRSP 등)",
    eligibility: "자격 요건",
    residency: "캐나다 거주 기간 (18세 ~ 은퇴)",
    work_history: "캐나다 근무 기간 (18세 ~ 은퇴)",
    adjustments: "추가 조정",
    child_rearing: "자녀 양육 기간 (7세 미만)",
    child_rearing_note: "7세 미만의 자녀를 돌보기 위해 일을 쉬거나 근무를 줄이셨나요? 이 기간은 평균 소득 계산에서 제외하여 연금액이 낮아지는 것을 방지합니다.",
    pension_plan: "직장 연금 (RPP)",
    pension_years: "은퇴 시점 근속 연수",
    best_5_salary: "최고 소득 5년 평균",
    results_title: "은퇴 나이:",
    today_val: "현재 가치",
    future_val: "미래 가치",
    monthly: "월 예상 수령액",
    yearly: "연 예상 수령액",
    comparison_title: "월 소득 비교",
    compare_scenarios: "시나리오 비교",
    show_after_tax: "세후(실수령액) 보기",
    breakdown: "항목별 상세 내역",
    source: "항목",
    diff: "차이",
    gap_analysis: <>현실 점검<br />(Reality Check)</>,
    shortfall_label: "채워야 할 월 소득 갭",
    surplus_label: "월 예상 여유액",
    savings_label: "필요 월 저축액",
    target_70_label: "목표: 현재 세후 소득의 70%",
    target_70_tooltip: "왜 70%인가요? 은퇴 후에는 모기지 상환 완료, 국민연금(CPP)/고용보험(EI) 납부 중단, 은퇴 저축 불필요, 출퇴근 비용 절감 등으로 인해 현재 소득의 70%만 있어도 동일한 생활 수준을 유지할 수 있다는 것이 정설입니다.",
    savings_desc_combined: "은퇴 후부터 90세까지의 부족 자금을 마련하기 위해, 오늘부터 은퇴 전까지 매월 저축해야 할 금액입니다.",
    savings_tooltip_detail: "이 계산은 연 5% 실질 투자 수익률을 가정하며, 75세에 10% 인상되는 OAS 연금까지 모두 반영하여 90세까지의 현금 흐름을 시뮬레이션한 결과입니다.",
    surplus_desc: "현재 궤도에 잘 올라와 있습니다(On Track). 예상 소득이 목표치(70%)를 초과합니다.",
    expert_shortfall: "이 갭을 해결하는 방법 보기",
    expert_surplus: "내 자산 극대화하기",
    download_pdf: "PDF 리포트 다운로드",
    new_calc: "새로 계산",
    copy_results: "결과 복사",
    copied: "복사 완료!",
    legal: "법적 고지 및 개인정보",
    disclaimer_footer: "* FP Canada 2025 & 2026 세무 데이터를 기반으로 한 추정치입니다. 이 수치는 정보 제공용이며 정부 정책에 따라 변경될 수 있습니다.",
    tax_note: "{province} 주의 2026년 세율 기준. (조건 충족 시 노인 세액 공제 Age Amount 반영)",
    warn_retire_age: "은퇴 나이는 현재 나이보다 적을 수 없습니다.",
    warn_residency_max: "OAS 거주 기간은 18세 이후부터 계산됩니다. 최대 {val}년입니다.",
    warn_worked_max: "캐나다 거주 기간을 초과할 수 없습니다.",
    warn_pension_max: "총 근무 기간을 초과할 수 없습니다.",
    note_residency: "이 기간은 노령 보장 연금(OAS) 수령액을 결정합니다.",
    note_work_history: "이 기간은 국민 연금(CPP/QPP) 수령액을 결정합니다.",
    note_todays_dollars: "현재 가치(Today's Dollars) 기준 추산액을 입력하세요.",
    cpp_enhancement_note: "참고: 젊은 세대의 경우, 향후 CPP 확장(Enhanced CPP) 효과가 반영되었습니다.",
    on_track_title: "은퇴 준비가 순조롭습니다",
    info_career_avg: (
      <>
        평균값으로 시작해 드렸습니다. 당신의 삶에 맞춰 조정하세요:<br/><br/>
        • <strong>커리어 초기:</strong> 소득 증가 예상 → <strong>현재보다 높게 입력</strong><br/>
        • <strong>소득 전성기:</strong> 과거 소득 낮음 → <strong>현재보다 낮게 입력</strong>
      </>
    ),
    info_other_income: (
      <>
        연간 과세 대상 은퇴 소득을 입력하세요 (예: RRSP/RRIF 인출금, 임대 소득 등).<br />
        <strong className="block mt-1 text-white">포함하지 말아야 할 것:</strong>
        <ul className="list-disc pl-4 mt-1 space-y-1 text-indigo-300">
          <li>TFSA 인출 (비과세이므로 OAS에 영향 없음)</li>
          <li>CPP/QPP, OAS, 직장 연금 (마지막 단계에서 자동 계산됨)</li>
        </ul>
      </>
    ),
    info_pension_salary: "현재 경력 수준이 유지된다고 가정하고, 현재 소득을 바탕으로 미래의 '최고 소득 5년 평균'을 추정합니다. 향후 큰 폭의 승진이나 급여 변동이 예상된다면 금액을 수정하세요.",
    faq_section: "자주 묻는 질문",
    blog_section: "은퇴 계획 가이드",
    pension_note: "* 65세 이전 은퇴 시 연금액이 연 3%씩 감액됩니다.",
    total_net: "총 월 수령액 (세후)",
    total_gross: "총 월 수령액 (세전)",
    trust_marker: "Based on FP Canada Standards",
    legal_box_title: "중요 면책 조항",
    legal_box_text: "이 결과는 교육 목적의 시뮬레이션이며 재무적 조언이 아닙니다. 2026 FP Canada 가정치를 기반으로 하며 실제 수령액은 다를 수 있습니다. 귀하의 데이터는 서버에 저장되지 않습니다.",
    step_indicator: "{current} / 4 단계",
    step_1_label: "기본 정보",
    step_2_label: "재정 정보",
    step_3_label: "자격 요건",
    step_4_label: "상세 조정",
  },
  zh: {
    title_main: "RetireMinute",
    hero_title: "自信迈向退休生活",
    hero_subtitle: <>60秒估算您的CPP和OAS。<br className="md:hidden"/> <span className="inline-block"><Lock size={12} className="inline mb-0.5"/> 无需登录，无需邮件，直接查看结果。</span></>,
    guides_link: "指南",
    current_age: "当前年龄",
    target_retirement_age: "预计退休年龄",
    standard_age_note: "加拿大的标准退休年龄为65岁。",
    province: "居住省份",
    next: "下一步",
    back: "上一步",
    financial_overview: "财务概览",
    financial_subtitle: "让我们建立您的财务快照。",
    annual_income: "当前年收入 (税前)",
    career_avg: "预计职业生涯平均收入",
    other_income: "其他退休收入 (RRSP/RRIF等)",
    eligibility: "资格条件",
    residency: "在加拿大居住年限 (18岁至退休)",
    work_history: "在加拿大工作年限 (18岁至退休)",
    adjustments: "附加调整",
    child_rearing: "抚养子女年数 (7岁以下)",
    child_rearing_note: "请输入因照顾7岁以下儿童而导致低收入 or 无收入的总年数。（若是多名子女，请计算实际总日历年数，而非简单相乘）。",
    pension_plan: "确定给付型 (DB) 养老金",
    pension_years: "退休时的服务年限",
    best_5_salary: "最高5年平均工资",
    results_title: "退休年龄：",
    today_val: "现值",
    future_val: "未来价值",
    monthly: "月预估领",
    yearly: "每年",
    comparison_title: "月收入对比",
    compare_scenarios: "方案对比",
    show_after_tax: "显示税后 (净收入)",
    breakdown: "收入构成明细",
    source: "来源",
    diff: "差异",
    gap_analysis: <>退休现实检验<br />(Reality Check)</>,
    shortfall_label: "需填补的月收入缺口",
    surplus_label: "每月盈余 (Surplus)",
    savings_label: "每月需储蓄",
    target_70_label: "目标：税后收入的70%",
    target_70_tooltip: "为什么是70%？退休后通常没有房贷、无需缴纳CPP/EI、无通勤费用，也不需再为退休储蓄。因此，当前净收入的70%通常足以维持生活水平。",
    savings_desc_combined: "为填补退休后至90岁的资金缺口，从今天起至退休前每月需要的储蓄额。",
    savings_tooltip_detail: "此计算假设年投资回报率为5%，并已计入75岁时OAS增加10%的因素，模拟至90岁的现金流。",
    surplus_desc: "步入正轨 (On Track)！您的预计收入超过了70%的目标。",
    expert_shortfall: "查看如何填补缺口",
    expert_surplus: "最大化我的财富",
    download_pdf: "下载PDF报告",
    new_calc: "重新计算",
    copy_results: "复制结果",
    copied: "已复制！",
    legal: "法律与隐私",
    disclaimer_footer: "* 估算基于FP Canada 2025 & 2026税务常数。这些数字仅供参考，可能会根据政府立法而变化。",
    tax_note: "基于{province} 2026年单身老年人的税级估算。（如适用，包含老年人免税额 Age Amount）",
    warn_retire_age: "退休年龄不能早于当前年龄。",
    warn_residency_max: "OAS居住期限从18岁起计算。最大为{val}年。",
    warn_worked_max: "不能超过在加拿大的居住年限。",
    warn_pension_max: "不能超过在加拿大的总工作年限。",
    note_residency: "这决定了您的养老金(OAS)金额。",
    note_work_history: "这决定了您的退休金(CPP/QPP)福利金额。",
    note_todays_dollars: "请输入按现值（Today's Dollars）估算的金额。",
    cpp_enhancement_note: "注意：已包含针对您年龄组的Enhanced CPP估算。",
    info_career_avg: (
      <>
        我们以平均值开始。请根据您的生活进行调整：<br/><br/>
        • <strong>职业早期：</strong> 预计未来收入大幅增长？ → <strong>输入更高金额</strong><br/>
        • <strong>收入高峰期：</strong> 过去收入较低？ → <strong>输入更低金额</strong>
      </>
    ),
    info_other_income: (
      <>
        输入年度应纳税收入（如RRSP/RRIF提款、租金收入）。<br />
        <strong className="block mt-1 text-white">请勿包括：</strong>
        <ul className="list-disc pl-4 mt-1 space-y-1 text-indigo-300">
          <li>TFSA提款（免税，不影响OAS）</li>
          <li>CPP/QPP、OAS或职场退休金（将在最后一步自动计算）</li>
        </ul>
      </>
    ),
    info_pension_salary: "假设您的职业水平保持不变。我们使用当前收入来估算您未来最高的5年平均工资。如果您预计会有大幅晋升或变动，请进行调整。",
    faq_section: "常见问题",
    blog_section: "退休规划指南",
    pension_note: "* 65岁之前退休，退休金每年减少3%",
    total_net: "每月总净收入",
    total_gross: "每月总总收入",
    trust_marker: "Based on FP Canada Standards",
    legal_box_title: "重要免责声明",
    legal_box_text: "本计算器仅用于教育目的，不构成财务建议。结果基于2026 FP Canada假设估算。实际金额可能会有所不同。我们不会存储您的数据。",
    step_indicator: "第 {current} 步，共 4 步",
    step_1_label: "基本信息",
    step_2_label: "财务概览",
    step_3_label: "资格条件",
    step_4_label: "详细调整",
  },
  fr: {
    title_main: "RetireMinute",
    hero_title: "Prenez votre retraite en toute confiance.",
    hero_subtitle: <>Calculez votre RPC et SV en <span className="text-indigo-400 font-semibold">60 secondes</span>. <span className="inline-block"><Lock size={12} className="inline mb-0.5"/> Pas de connexion, pas d'e-mail, juste des résultats.</span></>,
    guides_link: "Guides",
    current_age: "Âge actuel",
    target_retirement_age: "Âge de retraite visé",
    standard_age_note: "L'âge standard de la retraite au Canada est de 65 ans.",
    province: "Province",
    next: "Suivant",
    back: "Retour",
    financial_overview: "Aperçu financier",
    financial_subtitle: "Construisons votre aperçu financier.",
    annual_income: "Revenu annuel actuel (avant impôt)",
    career_avg: "Revenu moyen de carrière estimé",
    other_income: "Autres revenus de retraite (REER, etc.)",
    eligibility: "Admissibilité",
    residency: "Années vécues au Canada (De 18 ans à la retraite)",
    work_history: "Années travaillées au Canada (De 18 ans à la retraite)",
    adjustments: "Ajustements",
    child_rearing: "Élever des enfants (Moins de 7 ans)",
    child_rearing_note: "Entrez le nombre total d'années où vous avez eu un revenu faible ou nul pour vous occuper d'un enfant de moins de 7 ans. (Pour plusieurs enfants, additionnez les années civiles réelles, ne multipliez pas simplement.)",
    pension_plan: "Régime de retraite au travail",
    pension_years: "Années de service cumulées",
    best_5_salary: "Salaire moyen des 5 meilleures années",
    results_title: "Retraite à",
    today_val: "Valeur actuelle",
    future_val: "Valeur future",
    monthly: "MENSUEL",
    yearly: "ANNUEL",
    comparison_title: "Comparaison du revenu mensuel",
    compare_scenarios: "Comparer les scénarios",
    show_after_tax: "Voir après impôt (Net)",
    breakdown: "Répartition du revenu",
    source: "Source",
    diff: "Diff",
    gap_analysis: <>Bilan de réalité<br />(Reality Check)</>,
    shortfall_label: "Manque à gagner",
    surplus_label: "Capacité d'épargne",
    savings_label: "Épargne requise",
    target_70_label: "Cible : 70 % du revenu net",
    target_70_tooltip: "Pourquoi 70 % ? À la retraite, vous n'avez généralement plus d'hypothèque, de cotisations RPC/AE, de frais de déplacement, ni besoin d'épargner pour la retraite. 70 % de votre revenu net actuel suffit généralement à maintenir votre niveau de vie.",
    savings_desc_combined: "Vous pouvez combler cet écart en épargnant ce montant chaque mois d'ici la retraite.",
    savings_tooltip_detail: "Ce calcul suppose un rendement réel de 5 % et tient compte de l'augmentation de 10 % de la SV à 75 ans, projetant vos flux de trésorerie jusqu'à 90 ans.",
    surplus_desc: "Sur la bonne voie (On Track) ! Votre revenu projeté dépasse l'objectif de 70 %.",
    expert_shortfall: "Voir comment combler cet écart",
    expert_surplus: "Optimiser mon patrimoine",
    download_pdf: "Télécharger le rapport PDF",
    new_calc: "Nouveau calcul",
    copy_results: "Copier les résultats",
    copied: "Copié !",
    legal: "Mentions légales & Confidentialité",
    disclaimer_footer: "* Estimations basées sur les constantes fiscales 2025 et 2026 de FP Canada. Ces chiffres sont à titre informatif et sujets à changement selon la législation gouvernementale.",
    tax_note: "Estimé sur la base des tranches d'imposition 2026 de {province}. Comprend le crédit en raison de l'âge si applicable.",
    warn_retire_age: "L'âge de la retraite ne peut pas être inférieur à votre âge actuel.",
    warn_residency_max: "La résidence pour la SV est comptée après 18 ans. Le maximum possible est de {val} ans.",
    warn_worked_max: "Ne peut excéder les années vécues au Canada.",
    warn_pension_max: "Ne peut excéder le total des années travaillées au Canada.",
    note_residency: "Ceci détermine votre montant de la Sécurité de la vieillesse (SV).",
    note_work_history: "Ceci détermine votre montant de prestations du RPC/RRQ.",
    note_todays_dollars: "Entrez une estimation en dollars d'aujourd'hui.",
    cpp_enhancement_note: "Note : Comprend les prestations du RPC bonifié estimées pour votre groupe d'âge.",
    info_career_avg: (
      <>
        Ce montant est pré-rempli avec votre revenu actuel. Ajustez manuellement si votre moyenne à vie (en dollars d'aujourd'hui) diffère :<br/><br/>
        • <strong>Début de carrière :</strong> Vous prévoyez une forte croissance salariale ? → <strong>Entrez un montant plus élevé.</strong><br/>
        • <strong>Revenu maximal atteint :</strong> Votre revenu passé était plus faible ? → <strong>Entrez un montant plus faible.</strong>
      </>
    ),
    info_other_income: (
      <>
        Entrez le revenu de retraite annuel imposable (ex: retraits REER/FERR, revenus locatifs).<br />
        <strong className="block mt-1 text-white">NE PAS inclure :</strong>
        <ul className="list-disc pl-4 mt-1 space-y-1 text-indigo-300">
          <li>Retraits CELI (non imposables, sans effet sur la SV)</li>
          <li>RPC/RRQ, SV ou pension de travail (calculés automatiquement à la dernière étape)</li>
        </ul>
      </>
    ),
    info_pension_salary: "Suppose que votre niveau de carrière reste constant. Nous utilisons votre revenu actuel pour estimer votre future moyenne des 5 meilleures années. Ajustez le montant si vous prévoyez des promotions ou changements importants.",
    faq_section: "Foire aux questions",
    blog_section: "Guides de planification de retraite",
    pension_note: "* Pension réduite de 3 % par an avant 65 ans",
    total_net: "TOTAL (Net)",
    total_gross: "TOTAL (Brut)",
    trust_marker: "Based on FP Canada Standards",
    legal_box_title: "Avis de non-responsabilité",
    legal_box_text: "Ce calculateur est à des fins éducatives uniquement et ne constitue pas un conseil financier. Les résultats sont des estimations basées sur les hypothèses de FP Canada 2026. Nous ne stockons pas vos données.",
    step_indicator: "Étape {current} sur 4",
    step_1_label: "Base",
    step_2_label: "Revenus",
    step_3_label: "Historique",
    step_4_label: "Détails",
  }
};

const FAQ_DATA = {
  en: [
    { q: "When is the best age to take CPP/QPP? (60 vs 65 vs 70)", a: "You can start receiving CPP or QPP as early as age 60 with a permanent reduction (up to 36% less), or delay until age 70 for a permanent increase (up to 42% more). It depends on your health and cash flow." },
    { q: "What is the OAS clawback limit for 2026?", a: "In 2026, if income exceeds ~$90,997, OAS is reduced by 15 cents for every dollar over." },
    { q: "Is my workplace pension taxable?", a: "Yes. Defined Benefit pensions and RRSP withdrawals are fully taxable income. TFSA withdrawals are tax-free." },
    { q: "How much income do I need to retire in Canada?", a: "A common rule is 70% of pre-retirement income. Expenses often decrease (no mortgage, no commute)." }
  ],
  ko: [
    { q: "CPP는 몇 살에 받는 것이 가장 좋나요? (60 vs 65 vs 70)", a: "60세 조기 수령은 최대 36% 감액, 70세 연기 수령은 42% 가산됩니다. 건강 상태와 재정 상황에 따라 다릅니다." },
    { q: "2026년 OAS 회수(Clawback) 한도는 얼마인가요?", a: "2026년 기준 연 소득이 약 $90,997를 초과하면, 초과분 1달러당 15센트의 OAS가 감액됩니다." },
    { q: "직장 연금도 과세 대상인가요?", a: "네, 직장 연금(DB/DC)과 RRSP 인출액은 전액 과세 대상 소득입니다. 반면 TFSA 인출은 비과세입니다." },
    { q: "캐나다에서 은퇴하려면 얼마가 필요할까요?", a: "보통 은퇴 전 소득의 70%를 목표로 합니다. 은퇴 후에는 모기지 상환이나 출퇴근 비용이 줄어들기 때문입니다." }
  ],
  zh: [
    { q: "什么时候领取CPP最好？(60 vs 65 vs 70)", a: "60岁早领最多减36%；70岁晚领最多加42%。这取决于您的健康和现金流。" },
    { q: "2026年的OAS回收限额是多少？", a: "2026年，如果收入超过约$90,997，每超过1加元，OAS将减少15分。" },
    { q: "我的职场退休金需要纳税吗？", a: "是的。固定收益（DB）养老金和RRSP提款均视为应纳税收入。TFSA提款则是免税的。" },
    { q: "在加拿大退休需要多少收入？", a: "通常的经验法则是退休前收入的70%。退休后开支通常会减少（如房贷还清、无通勤费）。" }
  ],
  fr: [
    { q: "Quel est le meilleur âge pour prendre le RPC/RRQ ?", a: "À 60 ans, c'est jusqu'à 36 % de moins ; à 70 ans, c'est 42 % de plus. Cela dépend de votre santé et de vos besoins de liquidités." },
    { q: "Quelle est la limite de récupération de la SV pour 2026 ?", a: "En 2026, si le revenu dépasse ~90 997 $, la SV est réduite de 15 cents pour chaque dollar excédentaire." },
    { q: "Ma pension de travail est-elle imposable ?", a: "Oui. Les pensions à prestations déterminées et les retraits REER sont entièrement imposables. Les retraits CELI sont non imposables." },
    { q: "De combien de revenus ai-je besoin pour la retraite ?", a: "La règle générale vise 70 % du revenu pré-retraite. Les dépenses diminuent souvent (plus d'hypothèque, plus de transport)." }
  ]
};

const BLOG_POSTS = [
  { title: "How to Maximize CPP/QPP in 2026", href: "/blog/cpp-guide", icon: TrendingUp },
  { title: "Avoiding OAS Clawback", href: "/blog/oas-clawback", icon: AlertTriangle },
  { title: "RRSP vs. TFSA Strategy", href: "/blog/rrsp-vs-tfsa", icon: Scale },
  { title: "Real Cost of Retirement", href: "/blog/retirement-cost", icon: DollarSign },
];

const CONSTANTS = {
  YMPE: 74600,
  MAX_CPP_65: 1507.65,
  MAX_OAS_65: 742.31,
  OAS_THRESHOLD: 90997,
  INFLATION: 0.021,
  WAGE_GROWTH: 0.021,
  INVESTMENT_RETURN: 0.05,
  EXPERT_LINK: "https://docs.google.com/forms/d/1EO4O7rEL4ViJKqGbXCUEMNlTMRCdo4h-9BoIxqGttv8/viewform",
  SITE_URL: "https://retireminute.ca",
};

const TAX_DATA = {
  groups: {
    low: ["British Columbia", "Ontario", "Nunavut", "Northwest Territories", "Yukon"],
    mid: ["Alberta", "Saskatchewan", "Manitoba"],
    high: ["Quebec", "New Brunswick", "Nova Scotia", "Prince Edward Island", "Newfoundland and Labrador"]
  },
  brackets: [25000, 35000, 50000, 75000, 100000, 130000], 
  rates: {
    low: [0, 0.05, 0.10, 0.16, 0.20, 0.24, 0.28], 
    mid: [0, 0.07, 0.13, 0.19, 0.23, 0.27, 0.30], 
    high: [0, 0.10, 0.16, 0.22, 0.27, 0.31, 0.35] 
  }
};

const LegalCenter = ({ onClose }) => (
  <div className="fixed inset-0 z-[100] bg-slate-950 overflow-y-auto animate-in fade-in duration-300">
    <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-10 text-left">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <Scale className="text-indigo-500 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Legal Center</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>
      <div className="prose prose-invert max-w-none text-slate-300 space-y-10">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white border-l-2 border-indigo-500 pl-4">
            <h3 className="text-xl font-bold m-0">Legal Disclaimer</h3>
          </div>
          <div className="pl-4 space-y-4 text-sm leading-relaxed text-slate-400">
            <p>RetireMinute is an independent digital tool provided for informational and educational purposes only. It does not constitute financial, investment, legal, or tax advice.</p>
            <p><strong>Accuracy & Estimates:</strong> Calculations are estimates based on current Canadian retirement income legislation. Actual benefits may differ due to policy changes or individual eligibility.</p>
            <p><strong>No Liability:</strong> We make no guarantees regarding accuracy. Always consult with a Qualified Financial Planner (QFP).</p>
          </div>
        </section>
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-white border-l-2 border-indigo-500 pl-4">
            <h3 className="text-xl font-bold m-0">Privacy Policy</h3>
          </div>
          <div className="pl-4 space-y-4 text-sm leading-relaxed text-slate-400">
            <div>
              <h4 className="text-slate-200 font-bold mb-1">1. Data Privacy Guarantee</h4>
              <p>The financial data you enter is processed <strong>locally in your browser</strong>. We do not store or transmit your financial information.</p>
            </div>
          </div>
        </section>
        <section className="pt-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500">© 2026 RetireMinute. All rights reserved.</p>
        </section>
      </div>
      <div className="pt-6 pb-10">
        <Button onClick={onClose} className="w-full">Back to Calculator</Button>
      </div>
    </div>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-slate-900 rounded-xl border border-slate-800 shadow-xl ${className}`}>{children}</div>
);

const Label = ({ children, className = "", lang = 'en' }) => (
  <label className={`block text-sm font-medium text-slate-300 mb-2 ${className} ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{children}</label>
);

const CurrencyInput = React.forwardRef(({ value, onChange, placeholder, ...props }, ref) => (
  <div className="group flex items-center h-12 w-full rounded-lg border border-slate-700 bg-slate-800 focus-within:ring-2 focus-within:ring-indigo-500 transition-all overflow-hidden">
    <div className="flex items-center justify-center pl-4 pr-1 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
      <DollarSign className="h-5 w-5" />
    </div>
    <input
      ref={ref}
      type="number"
      value={value}
      onChange={onChange}
      onWheel={(e) => e.target.blur()}
      placeholder={placeholder}
      className="flex-1 h-full bg-transparent border-none text-base text-white placeholder:text-slate-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none px-2"
      {...props}
    />
  </div>
));
CurrencyInput.displayName = "CurrencyInput";

const Input = React.forwardRef(({ type = "text", className = "", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    onWheel={(e) => e.target.blur()}
    className={`flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-900 disabled:text-slate-600 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

const Slider = ({ value, min, max, onChange, step = 1 }) => (
  <div className="relative w-full h-6 flex items-center cursor-pointer group mb-6">
    <div className="absolute w-full h-2 bg-slate-700 rounded-full group-hover:bg-slate-600 transition-colors"></div>
    <div 
      className={`absolute h-2 bg-indigo-500 rounded-full group-hover:bg-indigo-400 transition-colors`} 
      style={{ width: `${((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100}%` }}
    ></div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step}
      value={value || min} 
      onChange={onChange} 
      tabIndex={-1} 
      className="absolute w-full h-full opacity-0 cursor-pointer" 
    />
    <div 
      className="absolute h-5 w-5 bg-white rounded-full shadow-lg border-2 border-indigo-500 pointer-events-none transition-all group-hover:scale-110" 
      style={{ left: `calc(${((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100}% - 10px)` }}
    ></div>
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[3.5rem] h-auto py-3 px-6 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/50 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300",
    ghost: "hover:bg-slate-800 text-slate-400 hover:text-white",
  };
  return <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>{children}</button>;
};

const CountUp = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeProgress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);
  return <>{prefix}{Math.round(count).toLocaleString()}{suffix}</>;
};

const CustomAnimatedLabel = (props) => {
  const { x, y, width, value } = props;
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeProgress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);
  if (value === undefined || value === null) return null;
  return (
    <text x={x + width / 2} y={y - 10} fill="#fff" textAnchor="middle" fontSize={12} fontWeight="bold">
      ${Math.round(count).toLocaleString()}
    </text>
  );
};

export default function App() {
  const [lang, setLang] = useState('en');
  const t = (key, params = {}) => {
    let content = TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
    if (typeof content === 'function') {
      return content(params);
    }
    if (typeof content === 'string') {
        for (const prop in params) {
            content = content.replace(`{${prop}}`, String(params[prop]));
        }
    }
    return content;
  };

  const [step, setStep] = useState(1);
  const [showLegal, setShowLegal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
   
  const [showGapInfo, setShowGapInfo] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showAfterTax, setShowAfterTax] = useState(false);
  const [showTargetInfo, setShowTargetInfo] = useState(false);
  const [compareAge, setCompareAge] = useState(65);
   
  const [inputWarning, setInputWarning] = useState({ field: null, message: null });
  const firstInputRef = useRef(null);

  const [showAvgIncomeInfo, setShowAvgIncomeInfo] = useState(false);
  const [showOtherIncomeInfo, setShowOtherIncomeInfo] = useState(false);
  const [showPensionSalaryInfo, setShowPensionSalaryInfo] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const [formData, setFormData] = useState({
    currentAge: 35,
    retirementAge: 65,
    province: 'Ontario',
    currentIncome: '', 
    careerAvgIncome: '', 
    otherRetirementIncome: '', 
    yearsInCanada: 0,
    yearsWorked: 0,
    childRearingYears: 0,
    hasPension: 'None',
    pensionYears: 0,
    pensionSalary: '',
  });

  const [results, setResults] = useState(null);
  const [viewMode, setViewMode] = useState('today');

  useEffect(() => {
    const timer = setTimeout(() => { if (firstInputRef.current) firstInputRef.current.focus(); }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
      document.title = "RetireMinute | 2026 Canada Retirement Calculator";
  }, []);

  const handleChange = (field, value) => {
    if (field === 'province' || field === 'hasPension') {
      setFormData(prev => ({ ...prev, [field]: value }));
      return;
    }
    const num = parseInt(value);
    const newValue = value === '' ? '' : (isNaN(num) ? 0 : num);
    let finalValue = newValue;
    let updates = {};

    setInputWarning({ field: null, message: null });

    if (field === 'currentAge') {
      if (finalValue > 70) finalValue = 70;
      if (finalValue > formData.retirementAge) {
        updates.retirementAge = finalValue;
      }
    }

    if (field === 'retirementAge') {
      if (finalValue > 75) finalValue = 75;
      if (finalValue < formData.currentAge) {
        setInputWarning({ field: 'retirementAge', message: t('warn_retire_age') });
      }
      const maxResidency = Math.max(0, finalValue - 18);
      if (formData.yearsInCanada > maxResidency) {
        updates.yearsInCanada = maxResidency;
        if (formData.yearsWorked > maxResidency) updates.yearsWorked = maxResidency;
      }
    }

    if (field === 'yearsInCanada') {
      const maxPossible = Math.max(0, formData.retirementAge - 18);
      if (finalValue > maxPossible) {
        finalValue = maxPossible;
        setInputWarning({ field: 'yearsInCanada', message: t('warn_residency_max', { val: maxPossible }) });
      }
    }

    if (field === 'yearsWorked') {
      if (finalValue > formData.yearsInCanada) {
        finalValue = formData.yearsInCanada;
        setInputWarning({ field: 'yearsWorked', message: t('warn_worked_max') });
      }
    }

    if (field === 'pensionYears') {
      if (finalValue > formData.yearsWorked) {
        finalValue = formData.yearsWorked;
        setInputWarning({ field: 'pensionYears', message: t('warn_pension_max') });
      }
    }
    
    updates[field] = finalValue;
    if (field === 'currentIncome') {
        updates.careerAvgIncome = finalValue;
        updates.pensionSalary = finalValue;
    }
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.retirementAge >= formData.currentAge;
    if (step === 2) return formData.currentIncome !== '' && Number(formData.currentIncome) > 0;
    if (step === 3) return formData.yearsInCanada !== '' && Number(formData.yearsInCanada) > 0;
    return true;
  };

  const getTaxRate = (province, annualIncome) => {
    let group = 'low';
    if (TAX_DATA.groups.mid.includes(province)) group = 'mid';
    if (TAX_DATA.groups.high.includes(province)) group = 'high';
    const rates = TAX_DATA.rates[group];
    const brackets = TAX_DATA.brackets;
    for (let i = 0; i < brackets.length; i++) {
      if (annualIncome <= brackets[i]) return rates[i];
    }
    return rates[rates.length - 1]; 
  };

  const calculateBenefits = (targetAge) => {
    const { currentAge, currentIncome, careerAvgIncome, otherRetirementIncome, yearsInCanada, yearsWorked, childRearingYears, pensionYears, pensionSalary, hasPension, province } = formData;
    const ageDifference = targetAge - formData.retirementAge;
    const adjInCanada = Math.min(40, Math.max(0, Number(yearsInCanada) + ageDifference));
    const adjWorked = Math.min(40, Math.max(0, Number(yearsWorked) + ageDifference));
    const adjPensionYears = Math.max(0, Number(pensionYears) + ageDifference);

    const yearsToRetire = Math.max(0, targetAge - Number(currentAge));
    const inflationFactor = Math.pow(1 + CONSTANTS.INFLATION, yearsToRetire);
    const wageGrowthFactor = Math.pow(1 + CONSTANTS.WAGE_GROWTH, yearsToRetire);

    let oasAmount = 0;
    if (targetAge >= 65) {
      let baseOAS = (Math.min(adjInCanada, 40) / 40) * CONSTANTS.MAX_OAS_65;
      if (targetAge > 65) baseOAS += baseOAS * 0.006 * Math.min(60, (Math.min(targetAge, 70) - 65) * 12); 
      oasAmount = Math.max(0, baseOAS);
    }

    // [New Logic 1.1] Enhanced CPP Factor for Younger Generations
    // Heuristic: More years contributing after 2019 -> Higher enhancement
    const currentYear = 2026;
    const retirementYear = currentYear + (targetAge - currentAge);
    const yearsContributingAfter2019 = Math.max(0, retirementYear - 2019);
    
    // Enhancement Factor: Scale from 1.0 to 1.33 based on 40 years maturity
    let enhancementFactor = 1.0;
    if (yearsContributingAfter2019 > 0) {
      const enhancementRatio = Math.min(yearsContributingAfter2019 / 40, 1.0);
      enhancementFactor = 1.0 + (enhancementRatio * 0.33);
    }

    // [New Logic 1.2] Child Rearing Drop-out (CRDO) Correction
    // Instead of adding to years worked, we improve the earnings ratio by effectively reducing the denominator
    const maxContributoryMonths = Math.max(0, targetAge - 18) * 12;
    const dropOutMonths = Number(childRearingYears) * 12;
    // Ensure effective period is not too small (min 10 years)
    const effectiveN = Math.max(maxContributoryMonths - dropOutMonths, 120);
    
    // Estimate Total Lifetime Earnings based on user input (Career Avg * Years Worked)
    // Then re-calculate ratio against YMPE with effective N
    const totalLifetimeEarnings = Number(careerAvgIncome) * Number(yearsWorked);
    // Adjusted Earnings Ratio (simulating drop-out)
    const adjustedEarningsRatio = Math.min(totalLifetimeEarnings / (CONSTANTS.YMPE * (effectiveN / 12)), 1.0);
    
    // Basic Contribution Factor (Years / 39)
    const contributionFactor = Math.min(adjWorked, 40) / 39;

    let cppAmount = 0;
    if (targetAge >= 60) {
      // Base CPP formula with new CRDO ratio
      let baseCPP = CONSTANTS.MAX_CPP_65 * adjustedEarningsRatio * Math.min(contributionFactor, 1.0);
      
      // Apply Enhancement
      baseCPP = baseCPP * enhancementFactor;

      if (targetAge < 65) baseCPP -= baseCPP * 0.006 * (65 - targetAge) * 12;
      else if (targetAge > 65) baseCPP += baseCPP * 0.007 * Math.min(60, (Math.min(targetAge, 70) - 65) * 12);
      cppAmount = Math.max(0, baseCPP);
    }

    let pensionAmount = 0;
    if (hasPension !== 'None' && targetAge >= 55) {
      const best5AvgFuture = Number(pensionSalary) * wageGrowthFactor;
      // [Expert Fix 3] Bridge Benefit Consideration
      const accrualRate = targetAge < 65 ? 0.02 : 0.013;
      const annualPension = (accrualRate * Math.min(best5AvgFuture, CONSTANTS.YMPE * wageGrowthFactor) * adjPensionYears) + (0.02 * Math.max(0, best5AvgFuture - CONSTANTS.YMPE * wageGrowthFactor) * adjPensionYears);
      pensionAmount = Math.max(0, (annualPension / 12) / inflationFactor);
      if (targetAge < 65) pensionAmount *= (1 - 0.03 * (65 - targetAge)); 
    }

    const totalRetireAnnual = (cppAmount + pensionAmount + oasAmount) * 12 + Number(otherRetirementIncome);
    if (totalRetireAnnual > CONSTANTS.OAS_THRESHOLD) {
      oasAmount = Math.max(0, oasAmount - (((totalRetireAnnual - CONSTANTS.OAS_THRESHOLD) * 0.15) / 12));
    }

    // [New Logic 1.3] Age Amount Tax Credit Precision
    let taxRate = getTaxRate(province, totalRetireAnnual);
    let finalTaxRate = taxRate;
    
    if (targetAge >= 65 && totalRetireAnnual < CONSTANTS.OAS_THRESHOLD) {
       // Estimate Age Amount Credit ($9000 base, 15% credit rate)
       const ageAmountBase = 9000;
       // Reduction if income > threshold (approx $44k)
       const ageCreditReduction = Math.max(0, (totalRetireAnnual - 44325) * 0.15);
       const ageCredit = Math.max(0, ageAmountBase - ageCreditReduction) * 0.15;
       
       // Convert credit to effective rate reduction
       const taxReductionRate = totalRetireAnnual > 0 ? (ageCredit / totalRetireAnnual) : 0;
       finalTaxRate = Math.max(0, taxRate - taxReductionRate);
    }

    return { oas: oasAmount, cpp: cppAmount, pension: pensionAmount, total: oasAmount + cppAmount + pensionAmount + (Number(otherRetirementIncome) / 12), otherMonthly: Number(otherRetirementIncome) / 12, inflationFactor, taxRate: finalTaxRate, netFactor: 1 - finalTaxRate };
  };

  const calculateRetirement = () => {
    // 1. Calculate Base Scenarios
    const base = calculateBenefits(formData.retirementAge);
    const compare = calculateBenefits(compareAge);

    // 2. Calculate Current Net Income
    const currentTaxRate = getTaxRate(formData.province, Number(formData.currentIncome));
    const currentMonthlyGross = Number(formData.currentIncome) / 12;
    const currentMonthlyNet = currentMonthlyGross * (1 - currentTaxRate);
    
    // 3. [Expert Fix 4] Target = 70% of Pre-retirement NET Income
    const targetMonthlyNet = currentMonthlyNet * 0.7;
    
    // 4. Calculate Initial Monthly Net Income at Retirement
    const retirementMonthlyNet = base.total * base.netFactor;

    // 5. Calculate Monthly Shortfall (Snapshot at retirement start)
    const shortfallBase = Math.max(0, targetMonthlyNet - retirementMonthlyNet);
    const surplusBase = Math.max(0, retirementMonthlyNet - targetMonthlyNet);

    // 6. [Expert Fix 1 & 2] Cash Flow Projection for Savings Needed (90 years)
    // We calculate the Present Value of the gap for every month from retirement to age 90.
    // This allows us to account for: 
    // - Bridge benefit dropping at 65 (if retired early)
    // - OAS increasing at 75
    // - Constant Target (real terms) vs Changing Income
    
    const yearsToRetire = Math.max(0, Number(formData.retirementAge) - Number(formData.currentAge));
    const realReturn = (1 + CONSTANTS.INVESTMENT_RETURN) / (1 + CONSTANTS.INFLATION) - 1;
    const monthlyRealRate = realReturn / 12;

    let totalNestEggNeeded = 0;
    
    // Iterate from retirement age to 90
    for (let age = formData.retirementAge; age < 90; age++) {
        // Calculate benefits for this specific age year
        // Note: calculateBenefits(age) handles the Bridge Benefit logic (2.0% < 65, 1.3% >= 65)
        let benefitsAtAge = calculateBenefits(age);
        
        // [Expert Fix 2] Apply OAS 10% boost if age >= 75
        let oas = benefitsAtAge.oas;
        if (age >= 75) {
            oas = oas * 1.1; 
        }
        
        // Recalculate total for this age
        let monthlyGrossAtAge = benefitsAtAge.cpp + benefitsAtAge.pension + oas + benefitsAtAge.otherMonthly;
        let monthlyNetAtAge = monthlyGrossAtAge * benefitsAtAge.netFactor;

        // Gap for this month (Real Terms)
        let gap = Math.max(0, targetMonthlyNet - monthlyNetAtAge);
        
        if (gap > 0) {
             // Present Value of 12 months of gap at this specific future time, discounted back to retirement date
             // PV = Gap * 12 / (1+r)^(age - retirementAge)
             let pvGapYear = (gap * 12) / Math.pow(1 + realReturn, age - formData.retirementAge);
             totalNestEggNeeded += pvGapYear;
        }
    }

    // Calculate monthly savings needed from NOW until retirement to hit that Nest Egg
    let savingsNeeded = 0;
    if (totalNestEggNeeded > 0) {
        if (yearsToRetire === 0) {
            savingsNeeded = totalNestEggNeeded; // Lump sum needed now (edge case)
        } else {
             const monthsToRetire = yearsToRetire * 12;
             // PMT Formula: PV * r / ((1+r)^n - 1)
             savingsNeeded = totalNestEggNeeded * monthlyRealRate / (Math.pow(1 + monthlyRealRate, monthsToRetire) - 1);
        }
    }
    
    // [Analytics] Track Calculate Event
    trackEvent('calculate_completed', 'engagement', 'Results Generated', Math.round(base.total));

    setResults({ 
      base: { ...base, age: formData.retirementAge }, 
      compare: { ...compare, age: compareAge }, 
      currentMonthlyIncome: currentMonthlyGross, 
      currentNetFactor: 1 - currentTaxRate, 
      province: formData.province,
      savingsNeeded,
      shortfallBase,
      surplusBase,
      targetMonthlyNet
    });
  };

  const handleCompareAgeChange = (e) => {
    const newAge = parseInt(e.target.value);
    setCompareAge(newAge);
    if (results) {
      const newCompareResults = calculateBenefits(newAge);
      setResults(prev => ({
        ...prev,
        compare: {
          ...newCompareResults,
          age: newAge
        }
      }));
    }
  };

  const handleDownloadPDF = async () => {
    if (!results || !window.jspdf) return;
    setIsDownloading(true);
    
    // [Analytics] Track PDF Download
    trackEvent('download_pdf', 'engagement', 'PDF Report Downloaded', Math.round(results.base.total));
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'download_pdf', {
        event_category: 'engagement',
        event_label: 'Retirement Estimate PDF',
        value: Math.round(results.base.total)
      });
    }
    
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const { base, compare } = results;
      const pensionLabel = formData.province === 'Quebec' ? 'QPP' : 'CPP';
      const factor = showAfterTax ? base.netFactor : 1;
      const compareFactor = showAfterTax ? compare.netFactor : 1;
      const currentFactor = showAfterTax ? results.currentNetFactor : 1;
      const currentMonthly = results.currentMonthlyIncome * currentFactor;
      const taxStatusText = showAfterTax ? '(After-Tax / Net Income)' : '(Before-Tax / Gross Income)';

      const drawChart = (startY, title, barData) => {
        const values = barData.map(d => d.val);
        const maxVal = Math.max(...values) * 1.2;
        const chartH = 30;
        const chartW = 100;
        const startX = 55;
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "bold");
        doc.text(title, 105, startY, { align: "center" });
        const chartTopY = startY + 12;
        doc.setDrawColor(203, 213, 225);
        doc.line(startX, chartTopY + chartH, startX + chartW, chartTopY + chartH); 
        const barW = 15;
        const spacing = barData.length === 3 ? 15 : 25;
        // [PDF Fix] Center bars based on count
        const totalContentW = (barData.length * barW) + ((barData.length - 1) * spacing);
        let currentX = 105 - (totalContentW / 2); // Center on page
        
        barData.forEach((d) => {
            const h = (d.val / maxVal) * chartH;
            let fillColor = [59, 130, 246]; 
            if (d.type === 'Current') fillColor = [34, 211, 238];
            if (d.type === 'Delayed') fillColor = [16, 185, 129]; 
            doc.setFillColor(...fillColor);
            doc.rect(currentX, chartTopY + (chartH - h), barW, h, 'F');
            doc.setFontSize(8);
            doc.text(d.label, currentX + barW/2, chartTopY + chartH + 5, { align: "center" });
            doc.text(`$${Math.round(d.val).toLocaleString()}`, currentX + barW/2, chartTopY + (chartH - h) - 1, { align: "center" });
            currentX += (barW + spacing);
        });
      };

      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("RetireMinute", 20, 18);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Your Professional Retirement Income Estimate ${showAfterTax ? '(Net)' : ''}`, 20, 25);
      
      let currentY = 45;
      if (showComparison) {
        const val1 = base.total * factor; 
        const val2 = compare.total * compareFactor; 
        const chart1Data = [];
        // [PDF Fix] Force "Today's Value" view for consistency
        chart1Data.push({ type: 'Current', label: 'Current', val: currentMonthly });
        chart1Data.push({ type: 'Retired', label: `Age ${base.age}`, val: val1 });
        chart1Data.push({ type: 'Delayed', label: `Age ${compare.age}`, val: val2 });
        
        drawChart(currentY, `Monthly Income (Today's Value) ${taxStatusText}`, chart1Data);
        currentY += 65;
      } else {
        const val1 = base.total * factor;
        const chart1Data = [];
        // [PDF Fix] Force "Today's Value" view for consistency
        chart1Data.push({ type: 'Current', label: 'Current', val: currentMonthly });
        chart1Data.push({ type: 'Retired', label: `Age ${base.age}`, val: val1 });
        
        drawChart(currentY, `Monthly Income (Today's Value) ${taxStatusText}`, chart1Data);
        currentY += 65;
      }

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.text(`Income Breakdown (Today's Value) ${taxStatusText}`, 20, currentY);
      doc.setDrawColor(226, 232, 240);
      doc.line(20, currentY + 3, 190, currentY + 3);
      
      const rows = [
        [pensionLabel, base.cpp, compare.cpp],
        ["Old Age Security (OAS)", base.oas, compare.oas],
        ["Workplace Pension", base.pension, compare.pension],
        ["Other (RRSP/Savings)", base.otherMonthly, compare.otherMonthly],
        ["TOTAL MONTHLY", base.total, compare.total]
      ];
      
      let y = currentY + 12;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("Source", 20, y);
      doc.text(`Age ${base.age}`, 120, y, { align: "right" });
      if (showComparison) {
        doc.text(`Age ${compare.age}`, 155, y, { align: "right" });
        doc.text("Diff", 190, y, { align: "right" });
      }
      y += 4;
      doc.line(20, y, 190, y);
      y += 8;

      rows.forEach((row, i) => {
        const isTotal = i === rows.length - 1;
        doc.setFontSize(10);
        doc.setTextColor(isTotal ? 15 : 71, isTotal ? 23 : 85, isTotal ? 42 : 105);
        doc.setFont("helvetica", isTotal ? "bold" : "normal");
        doc.text(row[0], 20, y);
        const val1 = row[1] * factor;
        const val2 = row[2] * compareFactor;
        doc.text(`$${Math.round(val1).toLocaleString()}`, 120, y, { align: "right" });
        if (showComparison) {
          doc.text(`$${Math.round(val2).toLocaleString()}`, 155, y, { align: "right" });
          const diff = val2 - val1;
          doc.setTextColor(diff >= 0 ? 22 : 220, diff >= 0 ? 163 : 38, diff >= 0 ? 74 : 38);
          doc.text(`${diff >= 0 ? '+' : ''}$${Math.round(diff).toLocaleString()}`, 190, y, { align: "right" });
        }
        y += 8;
        if (isTotal) {
           doc.setDrawColor(15, 23, 42);
           doc.line(20, y - 12, 190, y - 12);
        } else {
           doc.setDrawColor(241, 245, 249);
           doc.line(20, y - 4, 190, y - 4);
        }
      });

      if (showComparison) {
        y += 10;
        const baseFuture = base.total * base.inflationFactor * factor;
        const compareFuture = compare.total * compare.inflationFactor * compareFactor;
        const chart2Data = [
            { type: 'Retired', label: `Age ${base.age}`, val: baseFuture },
            { type: 'Delayed', label: `Age ${compare.age}`, val: compareFuture }
        ];
        // Note: For future value projection chart, we never show current, so it's always just 2 bars usually
        drawChart(y + 10, `Future Value (With Inflation) ${taxStatusText}`, chart2Data);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont("helvetica", "italic");
        doc.text(`* Future values assume annual inflation of ${(CONSTANTS.INFLATION * 100).toFixed(1)}%.`, 105, y + 65, { align: "center" }); 
      }
      doc.setFontSize(9);
      doc.setTextColor(59, 130, 246); 
      doc.setFont("helvetica", "bold");
      const ctaText = "Want to maximize your retirement? Get expert advice now.";
      doc.text(ctaText, 105, 270, { align: "center" });
      const textWidth = doc.getTextWidth(ctaText);
      doc.link(105 - (textWidth / 2), 266, textWidth, 5, { url: CONSTANTS.EXPERT_LINK });
      
      // [PDF Legal Update]
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      const disclaimer = "Disclaimer: This result is an estimate based on 2026 FP Canada assumptions. Not financial advice.";
      doc.text(disclaimer, 105, 280, { align: "center" });
      doc.text(`Generated by ${CONSTANTS.SITE_URL.replace('https://', '')}`, 105, 290, { align: "center" });
      doc.save(`RetireMinute_Estimate.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleStartOver = () => { 
    setStep(1); 
    setResults(null); 
    setShowComparison(false); 
    setShowAfterTax(false); 
  };

  const handleShare = () => {
    if (!results) return;
    const { base } = results;
    const text = `[RetireMinute] Target Age: ${base.age}, Monthly: $${Math.round(base.total).toLocaleString()}. Check at ${CONSTANTS.SITE_URL}`;
    try {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) { console.error('Failed to copy', err); }
  };

  const handleBack = () => setStep(prev => prev - 1);
  const handleNext = () => { if (!isStepValid()) return; if (step === 4) calculateRetirement(); setStep(prev => prev + 1); };

  // --- UI Render Helpers ---
  function renderGapAnalysis() {
    if (!results) return null;
    const { shortfallBase, surplusBase, savingsNeeded, targetMonthlyNet } = results;
    const hasShortfall = shortfallBase > 0;
    
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6 shadow-lg animate-in fade-in slide-in-from-bottom-2">
        <div className="bg-slate-950/50 px-5 py-3 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                {hasShortfall ? <AlertTriangle className="w-5 h-5 text-rose-500" /> : <PartyPopper className="w-5 h-5 text-emerald-500" />}
                <h3 className="font-bold text-white tracking-wide">{t('gap_analysis')}</h3>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden md:block">{t('target_70_label')}</span>
                <button onClick={() => setShowTargetInfo(!showTargetInfo)} className="text-slate-500 hover:text-indigo-400 transition-colors">
                    <HelpCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
        
        {showTargetInfo && (
            <div className="bg-indigo-950/30 border-b border-indigo-900/30 px-5 py-3 text-xs text-indigo-200 leading-relaxed animate-in fade-in">
                {t('target_70_tooltip')}
            </div>
        )}

        <div className="p-5 grid md:grid-cols-2 gap-6 items-start relative">
            <div className="text-center md:text-left flex-1 flex flex-col h-full justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                        {hasShortfall ? t('shortfall_label') : t('surplus_label')}
                    </p>
                    <div className={`text-3xl font-bold ${hasShortfall ? 'text-rose-500' : 'text-emerald-400'}`}>
                        $<CountUp end={Math.round(hasShortfall ? shortfallBase : surplusBase)} duration={1500} />
                    </div>
                </div>
                <p className={`text-[10px] text-slate-400 mt-1 min-h-[1.5em] ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>
                    {hasShortfall 
                        ? `${((shortfallBase / targetMonthlyNet) * 100).toFixed(1)}% below target` 
                        : `${((surplusBase / targetMonthlyNet) * 100).toFixed(1)}% above target`}
                </p>
            </div>

            <div className="text-center md:text-right relative flex-1 flex flex-col h-full justify-between">
                <div className="absolute top-0 left-0 w-full h-px bg-slate-800 md:hidden -mt-3"></div>
                <div className="absolute top-0 left-0 h-full w-px bg-slate-800 hidden md:block -ml-3"></div>

                <div>
                    <div className="flex items-center justify-center md:justify-end gap-1 mb-1">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('savings_label')}</p>
                        <button onClick={() => setShowGapInfo(!showGapInfo)} className="text-slate-600 hover:text-white transition-colors"><Info className="w-3 h-3" /></button>
                    </div>
                    
                    {hasShortfall ? (
                        <div className="text-3xl font-bold text-teal-400">
                            $<CountUp end={Math.round(savingsNeeded)} duration={1500} />
                        </div>
                    ) : (
                         <div className="text-3xl font-bold text-slate-300">
                            $0
                        </div>
                    )}
                </div>
                
                {hasShortfall ? (
                    <p className={`text-[10px] text-slate-400 mt-1 leading-relaxed ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('savings_desc_combined')}</p>
                ) : (
                    <p className={`text-[10px] text-emerald-500/80 mt-1 font-medium leading-relaxed ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('surplus_desc')}</p>
                )}
            </div>
        </div>
        {showGapInfo && (
             <div className="bg-slate-950 px-5 py-3 text-[10px] text-slate-400 border-t border-slate-800 animate-in fade-in">
                 {t('savings_tooltip_detail')}
             </div>
        )}
      </div>
    );
  };

  // --- Step Indicator Renderer ---
  function renderStepIndicator() {
    if (step > 4) return null; // Don't show on results page

    return (
      <div className="w-full max-w-md mx-auto px-6 mt-4 mb-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] font-bold text-indigo-400">
             {t('step_indicator', { current: step, total: 4 })}
          </span>
          <span className="text-[10px] font-medium text-slate-500">
            {step === 1 ? t('step_1_label') : step === 2 ? t('step_2_label') : step === 3 ? t('step_3_label') : t('step_4_label')}
          </span>
        </div>
      </div>
    );
  };
   
  // --- New Render Functions for FAQ and Guides ---
  function renderFAQ() {
      return (
        <div className="mt-12 mb-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t('faq_section')}</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          <div className="space-y-3">
            {(FAQ_DATA[lang] || FAQ_DATA['en']).map((item, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
                <button onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/50 transition-colors">
                  <span className={`text-sm font-medium text-slate-300 pr-4 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{item.q}</span>
                  {openFaqIndex === idx ? <ChevronUp size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>
                {openFaqIndex === idx && <div className={`p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 bg-slate-950/30 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}><div className="pt-4">{item.a}</div></div>}
              </div>
            ))}
          </div>
        </div>
      );
  }

  function renderGuides() {
      return (
        <div className="mt-12 mb-6 space-y-4" id="guides">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t('blog_section')}</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          <div className="grid gap-3">
            {BLOG_POSTS.map((post, idx) => {
              const Icon = post.icon;
              return (
                <Link 
                    key={idx} 
                    href={post.href}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-indigo-900/20 hover:border-indigo-500/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors"><Icon size={18} /></div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{post.title}</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      );
  }

  function renderStep1() {
    return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center space-y-2 mb-4">
        <h1 className={`text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('hero_title')}</h1>
        <div className={`text-slate-400 text-base max-w-xs mx-auto md:max-w-lg ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('hero_subtitle')}</div>
      </div>
      <Card className="p-5 space-y-6">
        <div>
          <Label lang={lang}>{t('current_age')}</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-1"><Slider min={18} max={70} value={formData.currentAge} onChange={(e) => handleChange('currentAge', e.target.value)} /></div>
            <div className="w-20"><Input ref={firstInputRef} type="number" className="text-center" value={formData.currentAge} onChange={(e) => handleChange('currentAge', e.target.value)} /></div>
          </div>
        </div>
        <div>
          <Label lang={lang}>{t('target_retirement_age')}</Label>
          <p className="text-[10px] text-slate-500 mb-3 flex items-center"><Info className="w-3 h-3 mr-1" /> {t('standard_age_note')}</p>
          <div className="flex items-center space-x-4">
            <div className="flex-1"><Slider min={50} max={75} value={formData.retirementAge} onChange={(e) => handleChange('retirementAge', e.target.value)} /></div>
            <div className="w-20"><Input type="number" className="text-center" value={formData.retirementAge} onChange={(e) => handleChange('retirementAge', e.target.value)} /></div>
          </div>
          {inputWarning.field === 'retirementAge' && (
            <div className="mt-2 p-2 bg-amber-900/30 border border-amber-800 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <p className="text-[10px] text-amber-200">{inputWarning.message}</p>
            </div>
          )}
        </div>
        <div>
          <Label lang={lang}>{t('province')}</Label>
          <select className="w-full h-12 rounded-lg border border-slate-700 bg-slate-800 px-4 text-white appearance-none" value={formData.province} onChange={(e) => handleChange('province', e.target.value)}>
            {["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </Card>
    </div>
    );
  };

  function renderStep2() {
    return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">{t('financial_overview')}</h2>
        <p className="text-slate-400 text-sm">{t('financial_subtitle')}</p>
      </div>
      <Card className="p-6 space-y-8 text-left">
        <div>
          <Label lang={lang}>{t('annual_income')}</Label>
          <CurrencyInput ref={firstInputRef} value={formData.currentIncome} onChange={(e) => handleChange('currentIncome', e.target.value)} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label lang={lang} className="mb-0">{t('career_avg')}</Label>
            <button onClick={() => setShowAvgIncomeInfo(!showAvgIncomeInfo)} className="text-indigo-400 hover:text-indigo-300 focus:outline-none"><Info size={14} /></button>
          </div>
          {showAvgIncomeInfo && <div className={`mb-3 p-3 bg-indigo-900/30 border border-indigo-800 rounded-lg text-xs text-indigo-200 animate-in fade-in slide-in-from-top-1 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('info_career_avg')}</div>}
          <CurrencyInput value={formData.careerAvgIncome} onChange={(e) => handleChange('careerAvgIncome', e.target.value)} />
          <p className={`text-xs text-slate-500 mt-1 pl-1 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('note_todays_dollars')}</p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label lang={lang} className="mb-0">{t('other_income')}</Label>
            <button onClick={() => setShowOtherIncomeInfo(!showOtherIncomeInfo)} className="text-indigo-400 hover:text-indigo-300 focus:outline-none"><Info size={14} /></button>
          </div>
          {showOtherIncomeInfo && <div className={`mb-3 p-3 bg-indigo-900/30 border border-indigo-800 rounded-lg text-xs text-indigo-200 animate-in fade-in slide-in-from-top-1 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('info_other_income')}</div>}
          <CurrencyInput value={formData.otherRetirementIncome} onChange={(e) => handleChange('otherRetirementIncome', e.target.value)} />
        </div>
      </Card>
    </div>
    );
  };

  function renderStep3() {
    return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">{t('eligibility')}</h2>
        <p className="text-slate-400 text-sm">Residency and work history.</p>
      </div>
      <Card className="p-6 space-y-8 text-left">
        <div>
          <Label lang={lang}>{t('residency')}</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-1"><Slider min={0} max={50} value={formData.yearsInCanada} onChange={(e) => handleChange('yearsInCanada', e.target.value)} /></div>
            <div className="w-20"><Input ref={firstInputRef} type="number" className="text-center" value={formData.yearsInCanada} onChange={(e) => handleChange('yearsInCanada', e.target.value)} /></div>
          </div>
          <p className={`text-xs text-slate-500 mt-2 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('note_residency')}</p>
          {inputWarning.field === 'yearsInCanada' && <div className="mt-2 p-2 bg-amber-900/30 border border-amber-800 rounded-lg flex items-center gap-2 animate-in fade-in"><AlertTriangle size={14} className="text-amber-500" /><p className="text-[10px] text-amber-200">{inputWarning.message}</p></div>}
        </div>
        <div>
          <Label lang={lang}>{t('work_history')}</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-1"><Slider min={0} max={50} value={formData.yearsWorked} onChange={(e) => handleChange('yearsWorked', e.target.value)} /></div>
            <div className="w-20"><Input type="number" className="text-center" value={formData.yearsWorked} onChange={(e) => handleChange('yearsWorked', e.target.value)} /></div>
          </div>
          <p className={`text-xs text-slate-500 mt-2 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('note_work_history')}</p>
          {inputWarning.field === 'yearsWorked' && <div className="mt-2 p-2 bg-amber-900/30 border border-amber-800 rounded-lg flex items-center gap-2 animate-in fade-in"><AlertTriangle size={14} className="text-amber-500" /><p className="text-[10px] text-amber-200">{inputWarning.message}</p></div>}
        </div>
      </Card>
    </div>
    );
  };

  function renderStep4() {
    return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2 text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">{t('adjustments')}</h2>
        <p className="text-slate-400 text-sm">Life events and pension plans.</p>
      </div>
      <Card className="p-6 space-y-8 text-left">
        <div>
          <Label lang={lang}>{t('child_rearing')}</Label>
          <p className={`text-[11px] text-slate-400 mb-6 leading-relaxed ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('child_rearing_note')}</p>
          <div className="flex items-center space-x-4">
            <div className="flex-1"><Slider min={0} max={40} value={formData.childRearingYears} onChange={(e) => handleChange('childRearingYears', e.target.value)} /></div>
            <div className="w-20"><Input ref={firstInputRef} type="number" className="text-center" value={formData.childRearingYears} onChange={(e) => handleChange('childRearingYears', e.target.value)} /></div>
          </div>
        </div>
        <div>
          <Label lang={lang}>{t('pension_plan')}</Label>
          <div className="relative mb-6">
            <select className="w-full h-12 rounded-lg border border-slate-700 bg-slate-800 px-4 text-white appearance-none" value={formData.hasPension} onChange={(e) => handleChange('hasPension', e.target.value)}>
              {["None", "OMERS", "HOOPP", "OTPP", "Federal", "Other"].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          {formData.hasPension !== 'None' && (
            <div className="mt-4 p-4 bg-slate-800/50 rounded-lg space-y-6 animate-in fade-in duration-300">
              <div>
                <Label lang={lang}>{t('pension_years')}</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1"><Slider min={0} max={40} value={formData.pensionYears} onChange={(e) => handleChange('pensionYears', e.target.value)} /></div>
                  <div className="w-20"><Input type="number" className="text-center" value={formData.pensionYears} onChange={(e) => handleChange('pensionYears', e.target.value)} /></div>
                </div>
                {inputWarning.field === 'pensionYears' && <div className="mt-2 p-2 bg-amber-900/30 border border-amber-800 rounded-lg text-[10px] text-amber-200 animate-in fade-in">{inputWarning.message}</div>}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label lang={lang} className="mb-0">{t('best_5_salary')}</Label>
                  <button onClick={() => setShowPensionSalaryInfo(!showPensionSalaryInfo)} className="text-indigo-400 hover:text-indigo-300 focus:outline-none"><Info size={14} /></button>
                </div>
                {showPensionSalaryInfo && <div className={`mb-3 p-3 bg-indigo-900/30 border border-indigo-800 rounded-lg text-xs text-indigo-200 animate-in fade-in slide-in-from-top-1 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('info_pension_salary')}</div>}
                <CurrencyInput value={formData.pensionSalary} onChange={(e) => handleChange('pensionSalary', e.target.value)} />
                <p className={`text-xs text-slate-500 mt-1 pl-1 ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('note_todays_dollars')}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
    );
  };

  function renderResults() {
    if (!results) return null;
    const { base, compare } = results;
    const isToday = viewMode === 'today';
    const factor = showAfterTax ? base.netFactor : 1;
    const compareFactor = showAfterTax ? compare.netFactor : 1;
    const currentFactor = showAfterTax ? results.currentNetFactor : 1;
    const inf = isToday ? 1 : base.inflationFactor;
    const delayedInf = isToday ? 1 : compare.inflationFactor; 
    
    const totalMonthly = base.total * inf * factor;
    const currentMonthly = (results.currentMonthlyIncome * (isToday ? 1 : inf)) * currentFactor;
    const delayedTotal = compare.total * delayedInf * compareFactor;
    const pensionLabel = formData.province === 'Quebec' ? 'QPP' : 'CPP';

    const chartData = [];
    if (viewMode === 'today') {
        chartData.push({ name: 'Current', Amount: Math.round(currentMonthly), fill: '#22d3ee' });
    }
    chartData.push({ name: `Age ${base.age}`, Amount: Math.round(totalMonthly), fill: '#3b82f6' });
    
    if (showComparison) chartData.push({ name: `Age ${compare.age}`, Amount: Math.round(delayedTotal), fill: '#10b981' });

    const baseMax = base.total * (isToday ? 1 : base.inflationFactor);
    const compareMax = compare.total * (isToday ? 1 : base.inflationFactor * Math.pow(1 + CONSTANTS.INFLATION, compare.age - base.age));
    const currentMax = results.currentMonthlyIncome * (isToday ? 1 : base.inflationFactor);
    const maxY = Math.max(baseMax, compareMax, currentMax) * 1.15;

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 mb-6 text-left relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 mt-2">
            <h3 className="font-bold text-white">{t('results_title')} {results.base.age}</h3>
            <div className="bg-slate-800 p-1 rounded-lg flex">
              <button onClick={() => setViewMode('today')} className={`px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{t('today_val')}</button>
              <button onClick={() => setViewMode('future')} className={`px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${!isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{t('future_val')}</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center divide-x divide-slate-800">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="block md:inline">PROJECTED </span>
                <span>MONTHLY</span>
              </p>
              <p className="text-[10px] text-slate-400 font-bold mb-2">
                {showAfterTax ? '(NET / After-Tax)' : '(GROSS / Pre-Tax)'}
              </p>
              <p className="text-2xl font-bold text-white text-emerald-400">
                $<CountUp key={totalMonthly} end={Math.round(totalMonthly)} duration={2000} />
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="block md:inline">PROJECTED </span>
                <span>YEARLY</span>
              </p>
              <p className="text-[10px] text-slate-400 font-bold mb-2">
                {showAfterTax ? '(NET / After-Tax)' : '(GROSS / Pre-Tax)'}
              </p>
              <p className="text-2xl font-bold text-white text-emerald-400">
                $<CountUp key={totalMonthly * 12} end={Math.round(totalMonthly * 12)} duration={2000} />
              </p>
            </div>
          </div>
        </div>
        
        <Card className="p-6 relative">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center"><h3 className="text-slate-300 font-bold">{t('comparison_title')}</h3></div>
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[140px] flex items-center justify-between cursor-pointer group bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-colors" onClick={() => setShowComparison(!showComparison)}>
                <span className={`text-[10px] font-bold ${showComparison ? 'text-emerald-400' : 'text-slate-500'}`}>{t('compare_scenarios')}</span>
                {showComparison ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-slate-600" />}
              </div>
              <div className="flex-1 min-w-[140px] flex items-center justify-between cursor-pointer group bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-colors" onClick={() => setShowAfterTax(!showAfterTax)}>
                <span className={`text-[10px] font-bold ${showAfterTax ? 'text-blue-400' : 'text-slate-500'}`}>{t('show_after_tax')}</span>
                {showAfterTax ? <ToggleRight className="w-5 h-5 text-blue-500" /> : <ToggleLeft className="w-5 h-5 text-slate-600" />}
              </div>
            </div>
          </div>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart key={`${viewMode}-${showComparison}`} data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }} barGap={0}>
                <XAxis xAxisId={0} dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <XAxis xAxisId={1} dataKey="name" hide />
                <YAxis hide domain={[0, maxY]} />
                <Bar xAxisId={0} dataKey="Amount" radius={[4, 4, 0, 0]} barSize={50} animationDuration={2000}>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
                <Bar xAxisId={1} dataKey="Amount" barSize={50} isAnimationActive={false} fill="transparent" legendType="none" tooltipType="none">
                  <LabelList dataKey="Amount" content={<CustomAnimatedLabel />} />
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {showComparison && (
            <div className="bg-slate-800/30 rounded-lg p-4 mb-2 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                <span>{t('target_retirement_age')}: <span className="text-emerald-400 text-sm">{compareAge}</span></span>
                <span>(Max: 70)</span>
              </div>
              <Slider min={Math.max(60, formData.currentAge)} max={70} value={compareAge} onChange={handleCompareAgeChange} />
              {formData.hasPension !== 'None' && compareAge < 65 && (
                <p className="text-[10px] text-amber-500/80 mt-1 text-center">{t('pension_note')}</p>
              )}
            </div>
          )}
          {showAfterTax && (
            <div className="mt-4 p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg flex items-start gap-2 animate-in fade-in">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className={`text-[10px] text-blue-200/80 leading-relaxed ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('tax_note', { province: results.province })}</p>
            </div>
          )}
        </Card>

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <h4 className="text-sm font-bold text-white flex items-center"><PieChart className="w-4 h-4 mr-2 text-indigo-400" /> {t('breakdown')}</h4>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] text-slate-400 uppercase bg-slate-950/50">
              <tr>
                <th className="px-4 py-3">{t('source')}</th>
                <th className="px-4 py-3 text-right">Age {base.age}</th>
                {showComparison && <th className="px-4 py-3 text-right text-emerald-400">Age {compare.age}</th>}
                {showComparison && <th className="px-4 py-3 text-right">{t('diff')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[
                { l: pensionLabel, k: 'cpp' },
                { l: 'OAS', k: 'oas' },
                { l: t('pension_plan'), k: 'pension' },
                { l: 'Other', k: 'otherMonthly' }
              ].map(row => {
                const val1 = base[row.k] * inf * factor;
                const val2 = compare[row.k] * delayedInf * compareFactor;
                const diff = val2 - val1;
                return (
                  <tr key={row.k} className="hover:bg-slate-800/30">
                    <td className="px-4 py-3 text-slate-300 font-medium whitespace-nowrap">{row.l}</td>
                    <td className="px-4 py-3 text-right text-white">${Math.round(val1).toLocaleString()}</td>
                    {showComparison && (
                      <>
                        <td className="px-4 py-3 text-right text-emerald-400 font-bold">${Math.round(val2).toLocaleString()}</td>
                        <td className={`px-4 py-3 text-right ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {diff >= 0 ? '+' : ''}{Math.round(diff).toLocaleString()}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              <tr className="bg-slate-800/50 font-bold">
                <td className="px-4 py-3 text-white uppercase whitespace-nowrap">{showAfterTax ? t('total_net') : t('total_gross')}</td>
                <td className="px-4 py-3 text-right text-indigo-400">${Math.round(totalMonthly).toLocaleString()}</td>
                {showComparison && (
                  <>
                    <td className="px-4 py-3 text-right text-emerald-400">${Math.round(delayedTotal).toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right ${delayedTotal - totalMonthly >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {delayedTotal - totalMonthly > 0 ? '+' : ''}{Math.round(delayedTotal - totalMonthly).toLocaleString()}
                    </td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {renderGapAnalysis()}

        <Button className="w-full h-auto min-h-[3.5rem] mt-8 py-4" onClick={() => {
          trackEvent('click_expert_link', 'conversion', 'Expert Advice Clicked', Math.round(results.shortfallBase));
          window.open(CONSTANTS.EXPERT_LINK, '_blank');
        }}>
          {results.shortfallBase > 0 ? t('expert_shortfall') : t('expert_surplus')} <ExternalLink className="ml-2 w-4 h-4 flex-shrink-0" />
        </Button>
        
        {/* [Legal & Privacy Box Added] */}
        <div className="mt-6 mb-2 p-4 bg-slate-800/50 border border-slate-700 rounded-xl flex items-start gap-3 text-left">
            <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
                <h4 className="text-[11px] font-bold text-slate-200 mb-1">{t('legal_box_title')}</h4>
                <p className={`text-[10px] text-slate-400 leading-relaxed ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>
                    {t('legal_box_text')}
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4">
          <Button className="h-auto min-h-[3.5rem] py-4 bg-emerald-600 hover:bg-emerald-500" onClick={handleDownloadPDF} disabled={isDownloading}>
            {isDownloading ? <span className="flex items-center animate-pulse"><RefreshCcw className="mr-2 w-4 h-4 animate-spin" /> Generating...</span> : <span className="flex items-center"><Download className="mr-2 w-4 h-4" /> {t('download_pdf')}</span>}
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-auto min-h-[3.5rem] py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700" onClick={handleShare}>
              {copySuccess ? <span className="flex items-center text-green-500"><CheckCircle2 className="mr-2 w-4 h-4" /> {t('copied')}</span> : <span className="flex items-center text-xs md:text-sm"><Share2 className="mr-2 w-4 h-4" /> {t('copy_results')}</span>}
            </Button>
            <Button className="h-auto min-h-[3.5rem] py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700" onClick={handleStartOver}><RefreshCcw className="mr-2 w-4 h-4" /> {t('new_calc')}</Button>
          </div>
        </div>

        <div className="mt-4 text-center space-y-2">
            <p className="text-[10px] text-slate-600 leading-relaxed max-w-xs mx-auto">{t('disclaimer_footer')}</p>
            {formData.currentAge < 40 && (
                <p className={`text-[10px] text-slate-500/80 leading-relaxed max-w-xs mx-auto ${['ko', 'zh'].includes(lang) ? 'break-keep' : ''}`}>{t('cpp_enhancement_note')}</p>
            )}
             <p className="text-[9px] text-slate-700 font-semibold tracking-widest uppercase mt-4 opacity-70">
                {t('trust_marker')}
            </p>
        </div>

        {renderFAQ()}
        {renderGuides()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 relative text-left">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleStartOver}>
          {/* [로고 업데이트] 계산기 아이콘 대신 업로드된 icon.png 사용 */}
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-800">
             {/* NOTE: 프리뷰 환경에서는 실제 이미지 파일(/icon.png)을 불러올 수 없으므로 
                이미지가 로드되지 않을 때(onError) 대체 UI(RM 텍스트)를 보여주도록 처리되어 있습니다.
             */}
            <img 
              src="/icon.png" 
              alt="RetireMinute Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">RM</div>';
              }}
            />
          </div>
          <span className="font-bold text-base md:text-lg tracking-tight whitespace-nowrap"><span className="text-white">Retire</span><span className="text-[#82B78B]">Minute</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="#guides" className="hidden sm:block text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors mr-2">{t('guides_link')}</Link>
          <div className="flex bg-slate-900/80 rounded-lg p-0.5 border border-slate-800 shadow-inner">
            {['en', 'fr', 'ko', 'zh'].map(l => (
              <button key={l} onClick={() => {
                setLang(l);
                trackEvent('language_switch', 'engagement', l);
              }} className={`px-2.5 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${lang === l ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-400'}`}>
                {l === 'en' ? 'EN' : l === 'fr' ? 'FR' : l === 'ko' ? '한국어' : '中文'}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-md mx-auto p-6">
        <div className="flex-1">
          {/* [Step Indicator] Added */}
          {renderStepIndicator()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderResults()}
        </div>
        {step < 5 && (
          <>
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-row-reverse justify-between items-center">
            <Button onClick={handleNext} className="w-32" disabled={!isStepValid()}>{t('next')} <ArrowRight className="ml-2 w-4 h-4" /></Button>
            {step > 1 && <Button variant="ghost" onClick={handleBack}><ArrowLeft className="mr-2 w-4 h-4" /> {t('back')}</Button>}
          </div>
            {/* [Fix] Render FAQ and Guides below the fold for steps 1-4 so the link works */}
            <div className="mt-20 border-t border-slate-800/50 pt-10">
              {renderFAQ()}
              {renderGuides()}
            </div>
          </>
        )}
      </main>
      <footer className="w-full max-w-md mx-auto px-6 py-8 text-center mt-auto">
        <div className="flex items-center justify-center gap-3 text-slate-800 text-[10px] font-medium tracking-tight">
          <button onClick={() => setShowLegal(true)} className="hover:text-indigo-400 transition-colors underline underline-offset-4">{t('legal')}</button>
          <span>•</span>
          <p className="uppercase tracking-widest">© 2026 RetireMinute</p>
        </div>
      </footer>
      {showLegal && <LegalCenter onClose={() => setShowLegal(false)} />}
    </div>
  );
}