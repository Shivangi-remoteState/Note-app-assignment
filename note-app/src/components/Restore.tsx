import { RotateCcw } from "lucide-react";
const Restore = () => {
  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full border border-gray-600 flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-white mb-3">
          Restore “Reflection on the Month of June”
        </h1>

        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Don’t want to lose this note? It’s not too late! Just click the
          “Restore” button and it will be added back to your list. It’s that
          simple.
        </p>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-md transition duration-200">
          Restore
        </button>
      </div>
    </div>
  );
};

export default Restore;
