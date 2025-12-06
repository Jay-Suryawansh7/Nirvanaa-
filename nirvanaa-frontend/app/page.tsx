export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Nyaya Readiness Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-Powered Case Readiness & Mediation System
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Pending Confirmations</h2>
          <div className="text-3xl font-bold text-blue-600">12</div>
          <p className="text-sm text-gray-500 mt-1">Lawyers yet to respond</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Ready for Hearing</h2>
          <div className="text-3xl font-bold text-green-600">5</div>
          <p className="text-sm text-gray-500 mt-1">Score &ge; 85</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Mediation Candidates</h2>
          <div className="text-3xl font-bold text-purple-600">3</div>
          <p className="text-sm text-gray-500 mt-1">Both parties willing</p>
        </div>

        <div className="col-span-1 md:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Today's Cases</h2>
          <div className="sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Case ID</th>
                  <th scope="col" className="px-6 py-3">Lawyer Confirmed</th>
                  <th scope="col" className="px-6 py-3">Witness Confirmed</th>
                  <th scope="col" className="px-6 py-3">Readiness Score</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">C-2023-001</td>
                  <td className="px-6 py-4 text-green-600">Yes</td>
                  <td className="px-6 py-4 text-green-600">Yes</td>
                  <td className="px-6 py-4">95</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">READY</span></td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">C-2023-002</td>
                  <td className="px-6 py-4 text-red-600">No</td>
                  <td className="px-6 py-4 text-gray-400">Pending</td>
                  <td className="px-6 py-4">30</td>
                  <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">PARTIALLY_READY</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
