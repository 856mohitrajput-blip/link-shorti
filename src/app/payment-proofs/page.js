
const paymentData = [
  { date: "9/25/25, 3:15 PM", username: "ank******", amount: "$15.50", method: "PayPal" },
  { date: "9/25/25, 1:20 PM", username: "sub******", amount: "$25.10", method: "Bank Transfer" },
  { date: "9/25/25, 11:05 AM", username: "rah******", amount: "$8.75", method: "UPI (India)" },
  { date: "9/24/25, 9:40 PM", username: "pri******", amount: "$50.00", method: "PayPal" },
  { date: "9/24/25, 5:15 PM", username: "vik******", amount: "$12.30", method: "UPI (India)" },
  { date: "9/24/25, 2:00 PM", username: "san******", amount: "$30.00", method: "Bank Transfer" },
  { date: "9/23/25, 8:10 PM", username: "dee******", amount: "$22.80", method: "PayPal" },
  { date: "9/23/25, 4:55 PM", username: "ajo******", amount: "$7.90", method: "UPI (India)" },
  { date: "9/23/25, 1:30 PM", username: "man******", amount: "$45.00", method: "Bank Transfer" },
  { date: "9/22/25, 10:20 PM", username: "sun******", amount: "$18.60", method: "PayPal" },
  { date: "9/22/25, 6:45 PM", username: "kav******", amount: "$9.25", method: "UPI (India)" },
  { date: "9/22/25, 3:10 PM", username: "puj******", amount: "$60.00", method: "Bank Transfer" },
  { date: "9/21/25, 9:00 PM", username: "aru******", amount: "$33.40", method: "PayPal" },
  { date: "9/21/25, 5:25 PM", username: "sha******", amount: "$11.80", method: "UPI (India)" },
  { date: "9/21/25, 2:00 PM", username: "raj******", amount: "$70.00", method: "Bank Transfer" },
];

export default function PaymentProofsPage() {
  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
            Payment Proofs
          </h1>
          <p className="mt-6 mx-auto max-w-4xl text-base sm:text-lg text-gray-600 leading-relaxed">
            LinkShorti is your trusted partner for link shortening, providing reliable and fast payments since our inception in 2025. We are committed to transparency and ensuring our users get their earnings on time. Doubting our legitimacy? Check out our payment proofs below. We process payments through PayPal, Bank Transfer, and UPI within 4 days of a request.
          </p>
        </div>

        <div className="mt-12 max-w-6xl mx-auto shadow-md rounded-lg overflow-hidden bg-white border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Method</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paymentData.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.date}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{payment.username}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{payment.amount}</td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">{payment.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
