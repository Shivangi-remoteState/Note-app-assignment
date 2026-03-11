import { Routes, Route } from "react-router-dom";

import Middle from "../components/NoteList/Middle";
import Right from "../components/NotePanel/Right";
import EmptyNote from "../components/EmptyNote";
import MainLayout from "@/components/layouts/MainLayout";

const Home = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <>
              <Middle />
              <EmptyNote />
            </>
          }
        />

        {/* Favorites */}
        <Route
          path="/favorites"
          element={
            <>
              <Middle isFavoritesPage />
              <EmptyNote />
            </>
          }
        />

        <Route
          path="/favorites/note/:noteId"
          element={
            <>
              <Middle isFavoritesPage />
              <Right />
            </>
          }
        />

        {/* Archived */}
        <Route
          path="/archived"
          element={
            <>
              <Middle isArchivedPage />
              <EmptyNote />
            </>
          }
        />

        <Route
          path="/archived/note/:noteId"
          element={
            <>
              <Middle isArchivedPage />
              <Right />
            </>
          }
        />

        {/* Trash */}
        <Route
          path="/trash"
          element={
            <>
              <Middle isTrashPage />
              <EmptyNote />
            </>
          }
        />

        <Route
          path="/trash/note/:noteId"
          element={
            <>
              <Middle isTrashPage />
              <Right isTrashMode />
            </>
          }
        />

        {/* Folder */}
        <Route
          path="/folder/:folderId"
          element={
            <>
              <Middle />
              <EmptyNote />
            </>
          }
        />

        <Route
          path="/folder/:folderId/note/:noteId"
          element={
            <>
              <Middle />
              <Right />
            </>
          }
        />

        <Route
          path="/folder/:folderId/new"
          element={
            <>
              <Middle />
              <Right isNewNote />
            </>
          }
        />
      </Route>
    </Routes>
  );
};

export default Home;
