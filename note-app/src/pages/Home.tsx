import Left from "../components/Left";
import Middle from "../components/Middle";
import Right from "../components/Right";
import EmptyNote from "../components/EmptyNote";
import { Routes, Route } from "react-router-dom";
import { SearchProvider } from "../components/SearchContext";
import { useState } from "react";

const Home = () => {
  const [theme, setTheme] = useState("dark");
  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }
  return (
    <SearchProvider>
      <div
        className={`flex h-screen w-full ${
          theme === "dark" ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Left theme={theme} toggleTheme={toggleTheme} />
                <Middle />
                <EmptyNote />
              </>
            }
          />
          <Route
            path="/favorites"
            element={
              <>
                <Left />
                <Middle isFavoritesPage={true} />
                <EmptyNote />
              </>
            }
          />
          <Route
            path="/archived"
            element={
              <>
                <Left theme={theme} toggleTheme={toggleTheme} />
                <Middle isArchivedPage={true} />
                <EmptyNote />
              </>
            }
          />
          <Route
            path="/trash/note/:noteId"
            element={
              <>
                <Left theme={theme} toggleTheme={toggleTheme} />
                <Middle isTrashPage={true} />
                <Right isTrashMode={true} />
              </>
            }
          />

          <Route
            path="/trash"
            element={
              <>
                <Left theme={theme} toggleTheme={toggleTheme} />
                <Middle isTrashPage={true} />
                <EmptyNote />
              </>
            }
          />

          <Route
            path="folder/:folderId/*"
            element={
              <>
                <Left theme={theme} toggleTheme={toggleTheme} />
                <Routes>
                  {/* folder open then middle + right*/}
                  <Route
                    path=""
                    element={
                      <>
                        <Middle />
                        <EmptyNote />
                      </>
                    }
                  />

                  {/* note open then middle+ right*/}
                  <Route
                    path="note/:noteId"
                    element={
                      <>
                        <Middle />
                        <Right />
                      </>
                    }
                  />

                  {/* newnote then middle + right */}
                  <Route
                    path="new"
                    element={
                      <>
                        <Middle />
                        <Right isNewNote={true} />
                      </>
                    }
                  />
                </Routes>
              </>
            }
          />
        </Routes>
      </div>
    </SearchProvider>
  );
};

export default Home;
