import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/")
      .then((res) => setMsg(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold">💰 MoneyMinder</h1>
      <p className="mt-4">{msg}</p>
    </div>
  );
}

export default App;
