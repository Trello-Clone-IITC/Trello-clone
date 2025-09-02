import Board from "./features/Board/components/Board";
import CardModal from "./features/Board/components/card/components/CardModal";
import { Navbar } from "./features/Navbar";

function App() {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Board />

      {/* Global CardModal - only one instance needed */}
      <CardModal />
    </div>
  );
}

export default App;
