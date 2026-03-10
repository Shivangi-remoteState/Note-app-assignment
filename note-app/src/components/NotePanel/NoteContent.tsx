interface Props {
  content: string;
  setContent: (val: string) => void;
}
const NoteContent = ({ content, setContent }: Props) => {
  return (
    <div className="text-sm py-8 ">
      <textarea
        className="w-full h-[60vh] bg-[var(--color-transparent)] text-[var(--color-text)] border border-[var(--color-border)] p-3 outline-none"
        placeholder="Write something here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
};

export default NoteContent;
