import DashboardShell from "./DashboardShell";

export const metadata = {
  title: "Investigation Dashboard | OSPREY Maritime Intelligence",
  description:
    "Unified command-center investigation workspace for satellite SAR slick detection, AIS spatiotemporal correlation, backward drift modeling, and explainable environmental intelligence.",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
