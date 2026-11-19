/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "motion/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { TenantProvider } from "@/src/context/TenantContext";
import { AppLayout } from "@/src/layouts/AppLayout";
import { CheckoutScreen } from "@/src/pages/CheckoutScreen";
import { DocumentsScreen } from "@/src/pages/DocumentsScreen";
import { ExploreScreen } from "@/src/pages/ExploreScreen";
import { FoodMessScreen } from "@/src/pages/FoodMessScreen";
import { ForgotPasswordScreen } from "@/src/pages/ForgotPasswordScreen";
import { HomeDashboard } from "@/src/pages/HomeDashboard";
import { JoinPGScreen } from "@/src/pages/JoinPGScreen";
import { LoginScreen } from "@/src/pages/LoginScreen";
import { MyPGDashboard } from "@/src/pages/MyPGDashboard";
import {
  MyRoomScreen,
  NoticesScreen,
  PGRulesScreen,
  StayDetailsScreen,
} from "@/src/pages/MyPGSubPages";
import { OnboardingScreen } from "@/src/pages/OnboardingScreen";
import { PaymentsScreen } from "@/src/pages/PaymentsScreen";
import { PGDetailsScreen } from "@/src/pages/PGDetailsScreen";
import { ProfileScreen } from "@/src/pages/ProfileScreen";
import { RatePGScreen } from "@/src/pages/RatePGScreen";
import { RegisterScreen } from "@/src/pages/RegisterScreen";
import { RequestsScreen } from "@/src/pages/RequestsScreen";
import { RoomDetailsScreen } from "@/src/pages/RoomDetailsScreen";
import { SplashScreen } from "@/src/pages/SplashScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <TenantProvider>
          <BrowserRouter>
            <Toaster position="top-center" richColors closeButton />
            <Routes>
              {/* Standalone Intro & Auth Flows */}
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

              {/* Main Consumer App Shell */}
              <Route
                path="/"
                element={
                  <AppLayout>
                    <HomeDashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/explore"
                element={
                  <AppLayout>
                    <ExploreScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/pg/:pgId"
                element={
                  <AppLayout>
                    <PGDetailsScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/pg/:pgId/room/:roomId"
                element={
                  <AppLayout hideBottomNav>
                    <RoomDetailsScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/join/:pgId"
                element={
                  <AppLayout hideBottomNav>
                    <JoinPGScreen />
                  </AppLayout>
                }
              />

              {/* My PG & Tenant Services */}
              <Route
                path="/my-pg"
                element={
                  <AppLayout>
                    <MyPGDashboard />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/room"
                element={
                  <AppLayout hideBottomNav>
                    <MyRoomScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/payments"
                element={
                  <AppLayout hideBottomNav>
                    <PaymentsScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/food"
                element={
                  <AppLayout hideBottomNav>
                    <FoodMessScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/documents"
                element={
                  <AppLayout hideBottomNav>
                    <DocumentsScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/notices"
                element={
                  <AppLayout hideBottomNav>
                    <NoticesScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/rules"
                element={
                  <AppLayout hideBottomNav>
                    <PGRulesScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/stay"
                element={
                  <AppLayout hideBottomNav>
                    <StayDetailsScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/rate"
                element={
                  <AppLayout hideBottomNav>
                    <RatePGScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/rate/:pgId"
                element={
                  <AppLayout hideBottomNav>
                    <RatePGScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/my-pg/checkout"
                element={
                  <AppLayout hideBottomNav>
                    <CheckoutScreen />
                  </AppLayout>
                }
              />

              {/* Requests & Profile */}
              <Route
                path="/requests"
                element={
                  <AppLayout>
                    <RequestsScreen />
                  </AppLayout>
                }
              />
              <Route
                path="/profile"
                element={
                  <AppLayout>
                    <ProfileScreen />
                  </AppLayout>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TenantProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
