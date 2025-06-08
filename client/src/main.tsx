import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import 'reactflow/dist/style.css';

createRoot(document.getElementById("root")!).render(<App />);
