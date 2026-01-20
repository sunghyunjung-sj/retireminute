import Link from "next/link";

export const metadata = {
  title: "RRSP vs TFSA Withdrawal Strategy | RetireMinute Canada",
  description:
    "Deciding between RRSP and TFSA withdrawals in retirement? Discover the tax-efficient order to make your savings last longer.",
};

export default function RrspTfsaGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Back to Calculator
          </Link>
        </div>

        <article className="bg-white shadow-lg rounded-2xl overflow-hidden p-8 sm:p-12">
          <header className="mb-10 border-b pb-8">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Investment Guide
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              RRSP vs. TFSA: Which Should You Withdraw First in Retirement?
            </h1>
            <p className="mt-4 text-gray-500">
              Published on January 15, 2026 • By RetireMinute Team
            </p>
          </header>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p className="text-lg">
              You've spent decades saving into both your RRSP and TFSA. Now that
              retirement is here, the question shifts from "Where do I save?" to
              <strong>"Where do I withdraw?"</strong> The order matters more than
              you think.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              The Case for Withdrawing RRSPs First
            </h2>
            <p>
              Conventional wisdom often suggests withdrawing from RRSPs (or RRIFs)
              before touching your TFSA.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Tax Deferral Ends Eventually:</strong> By age 71, you must
                convert your RRSP to a RRIF and start mandatory minimum withdrawals.
                Melting down your RRSP earlier can smooth out your tax bill over time.
              </li>
              <li>
                <strong>Estate Planning:</strong> The full value of your RRSP/RRIF
                is taxable upon death (unless rolled over to a spouse). TFSAs can
                be passed to heirs tax-free.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              The Case for TFSA Withdrawals
            </h2>
            <p>
              However, there are strategic times to prioritize TFSA withdrawals:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Avoiding OAS Clawback:</strong> If your income is near the
                $90k threshold, taking extra cash from a TFSA avoids increasing
                your taxable income.
              </li>
              <li>
                <strong>Big Ticket Purchases:</strong> Need $50,000 for a renovation?
                Taking that from an RRSP could push you into a much higher tax
                bracket. Taking it from a TFSA has zero tax impact.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              The "Top-Up" Strategy
            </h2>
            <p>
              A balanced approach often works best. Withdraw enough taxable income
              (CPP, OAS, RRSP) to reach the top of a low tax bracket, and then
              top up any additional spending needs from your TFSA. This keeps
              your average tax rate low while preserving tax-free growth.
            </p>

            <div className="mt-10 bg-indigo-600 text-white p-8 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-2">
                Simulate Your Retirement Income
              </h3>
              <p className="mb-6 text-indigo-100">
                See how different income sources stack up against your goals using
                our 60-second tool.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors"
              >
                Calculate My Retirement Income Now    
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}