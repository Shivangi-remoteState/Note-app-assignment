interface Props {
  title: string;
  date: string;
  preview: string;
}

export default function NoteItem({ title, date, preview }: Props) {
  return (
    <div
      className={`
        p-4 cursor-pointer
        flex flex-col justify-center
        bg-card
      `}
    >
      <h3 className="text-title text-white font-medium truncate">{title}</h3>
      <div className="flex">
        <p className="text-title text-light">{date}</p>
        <p className="text-preview text-light truncate">{preview}</p>
      </div>
    </div>
  );
}
