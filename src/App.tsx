import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Import button visibility fixes
import "@/utils/buttonVisibilityFix";

import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import UpcomingTrips from "./pages/UpcomingTrips";
import WeekendGetaways from "./pages/WeekendGetaways";
import HimalayanTreks from "./pages/HimalayanTreks";
import BackpackingTrips from "./pages/BackpackingTrips";
import Camping from "./pages/Camping";
import InternationalGateways from "./pages/InternationalGateways";
import TripDetails from "./pages/TripDetails";
import BookingPage from "./pages/BookingPage";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
                <div className="min-h-screen flex flex-col">
                  <ErrorBoundary>
                    <Navbar />
                  </ErrorBoundary>
                  <main className="flex-1 pt-20 md:pt-24">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/upcoming" element={<UpcomingTrips />} />
                        <Route path="/weekends" element={<WeekendGetaways />} />
                        <Route path="/himalayan" element={<HimalayanTreks />} />
                        <Route path="/backpacking" element={<BackpackingTrips />} />
                        <Route path="/camping" element={<Camping />} />
                        <Route path="/international" element={<InternationalGateways />} />
                        <Route path="/trip/:tripId" element={<TripDetails />} />
                        <Route path="/booking/:tripId" element={<BookingPage />} />
                        <Route path="/wildlife" element={<Navigate to="/upcoming" replace />} />

                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />

                        <Route path="/booking" element={<Booking />} />
                        <Route path="/admin-login" element={<AdminLogin />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </ErrorBoundary>
                  </main>
                  <ErrorBoundary>
                    <Footer />
                  </ErrorBoundary>
                </div>
              </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
