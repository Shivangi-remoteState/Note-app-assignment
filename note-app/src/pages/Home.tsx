import Left from "../components/Left";
import Middle from "../components/Middle";
import Right from "../components/Right";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/axios";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [foldersLoaded, setFoldersLoaded] = useState(false);

  useEffect(() => {
    async function redirectToFirstFolder() {
      try {
        const res = await api.get("/folders");
        const allFolders = res.data.folders;

        if (allFolders.length > 0 && location.pathname === "/") {
          navigate(`/folder/${allFolders[0].id}`);
        }
      } catch (error) {
        console.log("Error fetching folders:", error);
      } finally {
        setFoldersLoaded(true);
      }
    }

    redirectToFirstFolder();
  }, []);

  return (
    <div className="flex bg-black text-white h-screen w-full">
      <Left />

      {foldersLoaded && (
        <Routes>
          <Route path="folder/:folderId" element={<Middle />} />

          <Route
            path="folder/:folderId/note/:noteId"
            element={
              <div className="flex">
                <Middle />
                <Right />
              </div>
            }
          />

          <Route
            path="folder/:folderId/new"
            element={
              <div className="flex">
                <Middle />
                <Right isNewNote />
              </div>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default Home;