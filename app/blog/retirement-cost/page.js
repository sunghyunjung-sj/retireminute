import Link from "next/link";

export const metadata = {
  title: "Real Cost of Retirement in Canada 2026 | RetireMinute Canada",
  description:
    "Is $1 million enough? Breakdown of actual retirement costs in Canada and how inflation impacts your purchasing power.",
};

export default function RetirementCostGuide() {
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
            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Lifestyle Planning
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              The Real Cost of Retirement in Canada: Is $5,000/Month Enough?
            </h1>
            <p className="mt-4 text-gray-500">
              Published on January 12, 2026 • By RetireMinute Team
            </p>
          </header>

          <div className="prose prose-blue max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p className="text-lg">
              A common rule of thumb is that you need 70% of your pre-retirement
              income to maintain your standard of living. But rules of thumb don't
              pay the bills. Let's look at the real numbers for 2026.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              The Three Stages of Retirement Spending
            </h2>
            <p>
              Retirement spending isn't a flat line; it's often described as a
              "smile" curve:
            </p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>The Go-Go Years (65-75):</strong> Spending is high. You are
                traveling, renovating, and enjoying hobbies. Costs here often match
                or exceed working-life spending.
              </li>
              <li>
                <strong>The Slow-Go Years (75-85):</strong> Spending drops. You
                travel less and stay home more. This is the bottom of the "smile"
                curve.
              </li>
              <li>
                <strong>The No-Go Years (85+):</strong> Spending rises again,
                driven primarily by health care and assisted living costs.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              The Inflation Factor
            </h2>
            <p>
              If you retire at 65, your money needs to last potentially 30 years.
              Even modest inflation of 2-3% will cut your purchasing power in half
              over that time.
            </p>
            <p>
              This is why <strong>indexing</strong> is crucial. CPP and OAS are
              indexed to inflation, which provides a safety net. However, most
              private investments and some workplace pensions are not fully
              indexed.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Running Your Numbers
            </h2>
            <p>
              Don't guess. Use a calculator to project your fixed income sources
              first (CPP, OAS, DB Pensions). Then, determine the gap that your
              savings need to fill.
            </p>

            <div className="mt-10 bg-indigo-600 text-white p-8 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-2">
                See Your Inflation-Adjusted Income
              </h3>
              <p className="mb-6 text-indigo-100">
                Our tool automatically calculates future values to show you what
                your pension is worth in real dollars.
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