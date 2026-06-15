import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import MonthlyItemsPage from "./pages/MonthlyItemsPage";
import CardsPage from "./pages/CardsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/monthly" element={<MonthlyItemsPage />} />
          <Route path="/cards" element={<CardsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
