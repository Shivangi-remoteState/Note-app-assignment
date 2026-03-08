interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDelete = ({ title, message, onConfirm, onCancel }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 font-name">
      <div className="bg-[#1E1E1E] w-105 rounded-xl p-6 border border-border shadow-xl">
        <h2 className="text-lg font-semibold text-white pb-2">{title}</h2>

        <p className="text-gray-400 text-sm pb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md bg-[#2A2A2A] text-gray-300 hover:bg-[#333]"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
