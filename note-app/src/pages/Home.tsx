import Left from "../components/Left";
import Middle from "../components/Middle";
import Right from "../components/Right";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  // const [seletedFolderId, setSelectedFolderId] = useState<string>("")
  // const [selectedNoteId , setSelectedNoteId]= useState<string>("")

  return (
    <div className="flex bg-black text-white h-screen w-full">
      <Left />
      <Routes>
        <Route path="folder/:folderId" element={<Middle />}></Route>
        <Route
          path="folder/:folderId/note/:noteId"
          element={
            <>
              <Middle />
              <Right />
            </>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default Home;
