export function AimanPlayground() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Aiman Playground</h1>
      <p className="mb-6 text-gray-700">
        Welcome to the playground! Start experimenting with your ideas here.
      </p>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => alert("Button clicked!")}
      >
        Click Me
      </button>
    </div>
  );
}
