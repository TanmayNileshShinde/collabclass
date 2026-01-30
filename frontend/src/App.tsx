import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import StreamVideoProvider from "./providers/StreamClientProvider";
import { Toaster } from "./components/ui/toaster";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Upcoming from "./pages/Upcoming";
import Previous from "./pages/Previous";
import Recordings from "./pages/Recordings";
import PersonalRoom from "./pages/PersonalRoom";
import Meeting from "./pages/Meeting";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { cn } from "@/lib/utils";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMeetingPage = location.pathname.startsWith("/meeting/");

  return (
    <>
      <SignedIn>
        <StreamVideoProvider>
          {!isMeetingPage && <Navbar />}
          <div className="flex">
            {!isMeetingPage && <Sidebar />}
            <section
              className={cn(
                "flex min-h-screen flex-col transition-colors duration-300",
                isMeetingPage
                  ? "px-0 pb-0 pt-4"
                  : "px-6 pb-6 pt-28 bg-gradient-to-br from-black via-gray-900 to-black"
              )}
            >
              <div className="w-full">{children}</div>
            </section>
          </div>
        </StreamVideoProvider>
      </SignedIn>
      <SignedOut>
        <Navigate to="/sign-in" replace />
      </SignedOut>
    </>
  );
}

function App() {
  return (
    <div className="bg-light-1 dark:bg-dark-2 min-h-screen transition-colors duration-300">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upcoming"
            element={
              <ProtectedRoute>
                <Upcoming />
              </ProtectedRoute>
            }
          />
          <Route
            path="/previous"
            element={
              <ProtectedRoute>
                <Previous />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recordings"
            element={
              <ProtectedRoute>
                <Recordings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/personal-room"
            element={
              <ProtectedRoute>
                <PersonalRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting/:id"
            element={
              <ProtectedRoute>
                <Meeting />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
