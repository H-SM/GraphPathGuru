import Home from "./components/Home"
import Details from "./components/Details"

function App() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", fontWeight: "bold", fontSize: "22px", marginTop: "22px" }}>
        GraphPathGuru
      </div>
      <div className="flex">
        <div className="w-[80%]">
          <Home />
        </div>

        <div className="w-[20%]">
          <Details />
        </div>
        

      </div>

    </>
  );
}

export default App;
