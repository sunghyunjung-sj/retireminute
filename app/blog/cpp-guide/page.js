import Link from "next/link";

export const metadata = {
  title: "How to Maximize Your CPP Benefits in 2026 | RetireMinute Canada",
  description:
    "Should you take CPP at 60 or wait until 70? Learn how to maximize your Canada Pension Plan benefits with our comprehensive guide.",
};

export default function CppGuide() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Back to Calculator
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white shadow-lg rounded-2xl overflow-hidden p-8 sm:p-12">
          {/* Header */}
          <header className="mb-10 border-b pb-8">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
              Retirement Guide
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              How to Maximize Your CPP Benefits in 2026: The Age Factor
            </h1>
            <p className="mt-4 text-gray-500">
              Published on January 2,2026 • By RetireMinute Team
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-blue max-w-none text-gray-700 space-y-6 leading-relaxed">
            <p className="text-lg">
              One of the most common questions Canadians face as they approach
              retirement is: <strong>"When should I start taking my CPP?"</strong>
            </p>
            <p>
              The Canada Pension Plan (CPP) is designed to replace a portion of
              your income in retirement. However, the age you choose to start
              receiving benefits can dramatically affect your monthly income for
              the rest of your life.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              The Standard Age: 65
            </h2>
            <p>
              The standard age to begin receiving CPP is 65. If you start at
              this age, you receive the full benefit amount you have earned based
              on your contributions. But you don't have to start at 65.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Taking it Early (Age 60-64)
            </h2>
            <p>
              You can start receiving CPP as early as age 60. However, there is
              a cost. For every month you start before age 65, your payment is
              reduced by <strong>0.6%</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <li>
                If you start at <strong>60</strong>, your pension is reduced by{" "}
                <strong>36%</strong> permanently.
              </li>
              <li>
                This means if you were eligible for $1,000 at 65, you would only
                receive $640 at age 60.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Waiting Longer (Age 65-70)
            </h2>
            <p>
              On the flip side, if you can afford to wait, the government offers
              a significant incentive. For every month you delay past age 65,
              your payment increases by <strong>0.7%</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <li>
                If you wait until <strong>70</strong>, your pension increases by{" "}
                <strong>42%</strong> permanently.
              </li>
              <li>
                That same $1,000 benefit would turn into $1,420 per month,
                indexed to inflation for life.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Which Option is Right for You?
            </h2>
            <p>
              There is no single "right" answer. Taking CPP early might make
              sense if you have health concerns or need the cash flow immediately.
              Delaying it acts as longevity insurance, guaranteeing a higher
              income if you live well into your 80s or 90s.
            </p>

            {/* Call to Action Box */}
            <div className="mt-10 bg-indigo-600 text-white p-8 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-2">
                Not sure what your numbers look like?
              </h3>
              <p className="mb-6 text-indigo-100">
                Use our free calculator to estimate your CPP and OAS benefits
                instantly.
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

        {/* Footer Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>
            The information provided in this article is for educational purposes
            only and does not constitute financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}