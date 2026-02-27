import Left from "../components/Left"
import Middle from "../components/Middle"
import Right from "../components/Right"

const Home = () => {
  return (
    <div className="flex bg-black text-white h-screen w-full">
      <Left/>
      <Middle/>
      <Right/>
    </div>
  )
}

export default Home
