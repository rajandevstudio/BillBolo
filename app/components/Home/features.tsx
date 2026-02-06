export default function Features() {
  return (
    <section className="py-28 bg-gray-50">
      <h3 className="text-4xl font-bold text-center mb-16 text-gray-800">
        Built for Real Shops
      </h3>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Feature 1 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">🧾</div>
          <h4 className="text-xl font-semibold mb-2 text-gray-700">GST Ready Invoices</h4>
          <p className="text-gray-600">
            Professional A4 invoices with tax calculation and shop details.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">⚡</div>
          <h4 className="text-xl font-semibold mb-2 text-gray-700">5 Second Billing</h4>
          <p className="text-gray-600">
            No typing, no searching items. Speak and billing is done instantly.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">📊</div>
          <h4 className="text-xl font-semibold mb-2 text-gray-700">Live Sales Dashboard</h4>
          <p className="text-gray-600">
            Track revenue, orders, and items from a simple dashboard.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">📱</div>
          <h4 className="text-xl font-semibold mb-2 text-gray-700">Works on WhatsApp</h4>
          <p className="text-gray-600">
            No new app. Use the WhatsApp you already use every day.
          </p>
        </div>

        {/* Feature 5 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4 font-semibold text-gray-400">🗂</div>
          <h4 className="text-xl font-semibold mb-2 text-gray-700">Product Catalog</h4>
          <p className="text-gray-600">
            Define your items once. BillBolo remembers forever.
          </p>
        </div>

        {/* Feature 6 */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <div className="text-4xl mb-4">🔒</div>
          <h4 className="text-xl font-semibold mb-2 text-gray-700">Secure & Reliable</h4>
          <p className="text-gray-600">
            Your data is safe. Your invoices never duplicate or fail.
          </p>
        </div>
      </div>
    </section>
  );
}
