// Test simple pour vérifier le layout
export default function TestLayout() {
  return (
    <div className="fixed inset-0 flex flex-col bg-red-100">
      {/* Header */}
      <div className="h-14 bg-blue-500 text-white flex items-center px-4 shrink-0">
        <h1>HEADER TEST</h1>
      </div>
      
      {/* Main */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <div className="w-80 bg-green-500 text-white p-4 shrink-0">
          <h2>SIDEBAR TEST</h2>
          <p>Ceci doit être visible!</p>
        </div>
        
        {/* Map area */}
        <div className="flex-1 bg-yellow-300 p-4">
          <h2>MAP AREA</h2>
        </div>
      </div>
    </div>
  )
}
