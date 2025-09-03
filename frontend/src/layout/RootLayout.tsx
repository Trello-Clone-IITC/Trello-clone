import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div>
      {/* <Header /> */}
      <main className="min-h-screen w-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};
