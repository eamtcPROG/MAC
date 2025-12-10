import { RouterProvider } from "react-router/dom";
import { router } from "./components/Root";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
