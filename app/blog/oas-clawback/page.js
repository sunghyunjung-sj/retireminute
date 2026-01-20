import Link from "next/link";

export const metadata = {
  title: "Understanding OAS Clawback in 2026 | RetireMinute Canada",
  description:
    "Worried about losing your Old Age Security benefits? Learn the 2026 income thresholds and strategies to minimize the OAS recovery tax.",
};

export default function OasClawbackGuide() {
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
            <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Tax Strategy
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Understanding the OAS Clawback: Will You Lose Benefits in 2026?
            </h1>
            <p className="mt-4 text-gray-500">
              Published on January 7, 2026 • By RetireMinute Team
            </p>
          </header>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p className="text-lg">
              For many Canadian retirees, Old Age Security (OAS) is a key pillar
              of income. However, high-income earners often face a nasty surprise
              at tax time: the <strong>OAS Recovery Tax</strong>, commonly known as
              the "clawback."
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              What is the Threshold for 2026?
            </h2>
            <p>
              The government sets an income threshold every year. If your net
              world income exceeds this amount, you must pay back 15 cents for
              every dollar over the limit.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-900 mb-2">For the 2026 tax year (estimate):</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Minimum Threshold:</strong> ~$90,997</li>
                <li><strong>Maximum Threshold:</strong> ~$148,065 (Age 65-74)</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                *If your income is above the maximum threshold, your OAS benefit
                will be reduced to zero.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              How to Reduce the Clawback
            </h2>
            <p>
              Minimizing your net income is the key to preserving your OAS. Here
              are a few strategies:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>TFSA Withdrawals:</strong> Unlike RRSPs, withdrawals from
                a Tax-Free Savings Account (TFSA) are not considered taxable income
                and do not trigger the clawback.
              </li>
              <li>
                <strong>Pension Splitting:</strong> If you have a spouse with a
                lower income, you can split up to 50% of eligible pension income
                to lower your individual net income.
              </li>
              <li>
                <strong>Defer OAS:</strong> You can choose to delay receiving OAS
                until age 70. If you expect your income to drop in later years,
                this can help you avoid the clawback while increasing your monthly
                benefit.
              </li>
            </ul>

            <div className="mt-10 bg-indigo-600 text-white p-8 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-2">
                Check Your Clawback Status
              </h3>
              <p className="mb-6 text-indigo-100">
                Our calculator automatically estimates if your income will trigger
                the OAS recovery tax.
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