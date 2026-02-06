export default function HowItWorks() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-4xl font-extrabold text-center mb-20 text-gray-900">
          How BillBolo Works
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Step 1 */}
          <div className="bg-gray-50 p-10 rounded-2xl shadow-sm border text-center hover:shadow-md transition">
            <div className="text-5xl mb-6 font-bold text-gray-400">🎙</div>
            <h4 className="text-2xl font-semibold mb-3 text-gray-700">
              Send Voice Note
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Speak items on WhatsApp exactly like you normally do with customers.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 p-10 rounded-2xl shadow-sm border text-center hover:shadow-md transition">
            <div className="text-5xl mb-6">🤖</div>
            <h4 className="text-2xl font-semibold mb-3 text-gray-700">
              BillBolo Understands
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Your products are recognized and a proper GST invoice is prepared instantly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 p-10 rounded-2xl shadow-sm border text-center hover:shadow-md transition">
            <div className="text-5xl mb-6">📄</div>
            <h4 className="text-2xl font-semibold mb-3 text-gray-700">
              Invoice Sent to Customer
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Professional PDF invoice goes directly to the customer on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
