import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ClassView from "./pages/ClassView";
import SubjectView from "./pages/SubjectView";
import ChapterView from "./pages/ChapterView";
import Admin from "./pages/Admin";
import StudentDetail from "./pages/StudentDetail";
import Attendance from "./pages/Attendance";
import MarksTracker from "./pages/MarksTracker";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/class/:classId" element={<ClassView />} />
            <Route path="/subject/:subjectId" element={<SubjectView />} />
            <Route path="/chapter/:chapterId" element={<ChapterView />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/student/:studentId" element={<StudentDetail />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/quiz" element={<MarksTracker />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatbot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
