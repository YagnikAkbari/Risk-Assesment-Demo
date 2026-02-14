import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ReportPage } from "./pages/ReportPage";
import { RiskManagementPage } from "./pages/RiskManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/assessment",
    Component: AssessmentPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/report/:id",
    Component: ReportPage,
  },
  {
    path: "/risk-management",
    Component: RiskManagementPage,
  },
]);
