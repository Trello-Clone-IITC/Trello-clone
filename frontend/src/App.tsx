import TestCard from "./features/Board/components/card/components/TestCard";

function App() {
  return (
    <div className="bg-[#161a1d] min-h-screen w-full">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Trello Card Modal Test
        </h1>
        <div className="max-w-sm">
          <TestCard />
        </div>
      </div>
    </div>
  );
}

export default App;
