import Card from "./Card";

export default function Middle() {
  return (
    <div
      className="
        h-screen 
        w-1/4
      
        p-4
        border-r border-border
        flex flex-col gap-5
        font-name
  
      "
    >
  
      <h1 className="text-2xl font-semibold">Personal</h1>

      <div className="flex flex-col gap-3">
        <Card
          title="June Reflections"
          date="5 July 2024"
          preview="A reflective look at what happened during June..."
        />
        <Card
          title="Shopping List"
          date="1 July 2024"
          preview="Eggs, Bread, Milk, Coffee and some extra snacks..."
        />
       
      </div>
    </div>
  );
}