import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layout/DashboardLayout";
import SignIn from "./pages/SignIn/SignIn";
import EmployRegistration from "./pages/EmployRegistration/EmployRegistration";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<EmployRegistration />} />
        <Route path="/sign-in" element={<SignIn />} />

        {/* Private/Dashboard Routes */}
        <Route path="/*" element={<DashboardLayout />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
