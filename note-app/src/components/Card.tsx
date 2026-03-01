interface Props {
  title: string;
  date: string;
  preview: string;
}

export default function NoteItem({ title, date, preview }: Props) {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <div
      className={`
        w-full p-4 border border-white/5 cursor-pointer 
        bg-card font-name rounded-lg
      `}
    >
    <h1 className="text-title text-xl text-white font-semibold truncate">{title}</h1>
      <div className="text-white/60 flex items-center gap-8 pt-1">
        <span className="text-title text-light">{formatDate(date)}</span>
        <p className="text-sm text-white/60 font-semibold truncate">{preview}</p>
      </div>
    </div>
  );
}
