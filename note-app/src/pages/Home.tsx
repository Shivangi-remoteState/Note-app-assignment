import Left from "../components/Left";
import Middle from "../components/Middle";
import Right from "../components/Right";
import EmptyNote from "../components/EmptyNote";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex bg-black text-white h-screen w-full">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Left />
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
              <EmptyNote /> {/* EmptyNote will load because no noteId */}
            </>
          }
        />
        <Route
          path="/archived"
          element={
            <>
              <Left />
              <Middle isArchivedPage={true} />
              <EmptyNote />
            </>
          }
        />
        <Route
          path="folder/:folderId/*"
          element={
            <>
              <Left />
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
  );
};

export default Home;
