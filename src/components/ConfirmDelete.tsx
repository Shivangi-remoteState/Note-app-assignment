interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDelete = ({ title, message, onConfirm, onCancel }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 font-name">
      <div className="bg-(--color-confirmDeletebg) w-105 rounded-xl p-6 border border-(--color-border) shadow-xl">
        <h2 className="text-lg font-semibold text-(--color-text) pb-2">
          {title}
        </h2>

        <p className="text-gray-400 text-sm pb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md bg-(--color-cancel) text-gray-300 hover:bg-(--color-cancelHover)"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 text-(--color-text)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
