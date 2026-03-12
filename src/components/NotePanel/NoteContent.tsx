interface Props {
  content: string;
  setContent: (val: string) => void;
}
const NoteContent = ({ content, setContent }: Props) => {
  return (
    <div className="text-sm py-8 ">
      <textarea
        className="w-full h-[60vh] bg-(--color-transparent) text-(--color-text) border border-(--color-border) p-3 outline-none shadow-md
        transition-all
        duration-200
        focus:shadow-xl
        focus:border-blue-500
        resize-none"
        placeholder="Write something here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};

export default NoteContent;
