import { BrowserRouter, Routes, Route } from "react-router-dom";
import Root from "./app/components/Root";
import Dashboard from "./app/components/pages/Dashboard";
import HealthAssessment from "./app/components/pages/HealthAssessment";
import History from "./app/components/pages/History";
//this one is da real one !!

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Dashboard />} />
          <Route path="assessment" element={<HealthAssessment />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}