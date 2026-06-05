import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

import Dashboard from "./pages/dashboard/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import Scripts from "./pages/scripts/Scripts";
import Writers from "./pages/writers/Writers";
import Directors from "./pages/directors/Directors";
import Actors from "./pages/actors/Actors";
import CrewMarket from "./pages/crew/CrewMarket";
import OwnedCrew from "./pages/crew/OwnedCrew";
import ActiveMovies from "./pages/movies/ActiveMovies";
import CreateMovie from "./pages/movies/CreateMovie";
import DirectorProfile from "./pages/directors/DirectorProfile";
import WriterProfile from "./pages/writers/WriterProfile";
import Notifications from "./pages/notifications/Notifications";
import Settings from "./pages/settings/Settings";
import AuthMonitoring from "./pages/auth/AuthMonitoring";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <ActiveMovies />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies/create"
          element={
            <ProtectedRoute>
              <CreateMovie />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scripts"
          element={
            <ProtectedRoute>
              <Scripts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writers"
          element={
            <ProtectedRoute>
              <Writers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/writers/:writerId/profile"
          element={
            <ProtectedRoute>
              <WriterProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/actors"
          element={
            <ProtectedRoute>
              <Actors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/directors"
          element={
            <ProtectedRoute>
              <Directors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/directors/:id"
          element={
            <ProtectedRoute>
              <DirectorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crew"
          element={
            <ProtectedRoute>
              <CrewMarket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crew/owned"
          element={
            <ProtectedRoute>
              <OwnedCrew />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth-monitoring"
          element={
            <ProtectedRoute>
              <AuthMonitoring />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
