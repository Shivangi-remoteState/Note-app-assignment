import Left from "../sidebar/Left";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-black text-white">
      <Left />
      <Outlet />
    </div>
  );
}
