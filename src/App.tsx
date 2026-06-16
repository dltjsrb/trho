import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import MonthlyItemsPage from "./pages/MonthlyItemsPage";
import CardsPage from "./pages/CardsPage";
import SpreadPage from "./pages/SpreadPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/spread" element={<Navigate to="/" replace />} />
          <Route path="/spread/:timeframe" element={<SpreadPage />} />
          <Route path="/monthly" element={<MonthlyItemsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
