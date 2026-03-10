import Left from "../components/sidebar/Left";
import Middle from "../components/NoteList/Middle";
import Right from "../components/NotePanel/Right";
import EmptyNote from "../components/EmptyNote";
import { Routes, Route } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="flex h-screen w-full bg-black text-white"
      // className={`flex h-screen w-full ${
      //   theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      // }`}
    >
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
              <EmptyNote />
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
          path="/trash/note/:noteId"
          element={
            <>
              <Left />
              <Middle isTrashPage={true} />
              <Right isTrashMode={true} />
            </>
          }
        />

        <Route
          path="/trash"
          element={
            <>
              <Left />
              <Middle isTrashPage={true} />
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
