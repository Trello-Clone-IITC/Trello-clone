import Board from "./features/board/components/Board";
import CardModal from "./features/board/components/card/components/CardModal";
import { Navbar } from "./features/navbar";

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
