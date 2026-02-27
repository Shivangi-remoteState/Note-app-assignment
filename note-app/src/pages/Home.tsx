import { useState } from "react"
import Left from "../components/Left"
import Middle from "../components/Middle"
import Right from "../components/Right"
import { Routes , Route} from "react-router-dom"

const Home = () => {
  const [seletedFolderId, setSelectedFolderId] = useState<string>("")
  const [selectedNoteId , setSelectedNoteId]= useState<string>("")

  return (
    <div className="flex bg-black text-white h-screen w-full">
      <Left onClickFolder={setSelectedFolderId}/>
      <Middle folderId ={seletedFolderId} onSelectNote={setSelectedNoteId}/>
      <Right noteId ={selectedNoteId}/>
    </div>
  )
}

export default Home
