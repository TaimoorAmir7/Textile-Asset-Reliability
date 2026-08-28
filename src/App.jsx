import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { TemplatesPage, TemplateDetailPage } from './pages/TemplatesPage';
import { AssetExplorerPage, AssetDetailPage } from './pages/AssetsPage';
import { AlertsPage, AlertDetailPage } from './pages/AlertsPage';
import { CasesPage } from './pages/CasesPage';
import { ShadeQualityPage } from './pages/ShadeQualityPage';
import { OptimizePage } from './pages/OptimizePage';
import { DeployPage, MaintenancePage, ReportsPage, ConfigurationPage, AuditPage } from './pages/PlatformPages';
import { VisionInspectionPage } from './pages/VisionInspectionPage';
import { ApparelOperationsPage } from './pages/ApparelOperationsPage';

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="templates/:templateId" element={<TemplateDetailPage />} />
        <Route path="assets" element={<AssetExplorerPage />} />
        <Route path="assets/:assetId" element={<AssetDetailPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="alerts/:alertId" element={<AlertDetailPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="shade" element={<ShadeQualityPage />} />
        <Route path="vision" element={<VisionInspectionPage />} />
        <Route path="apparel" element={<ApparelOperationsPage />} />
        <Route path="optimize" element={<OptimizePage />} />
        <Route path="deploy" element={<DeployPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="configuration" element={<ConfigurationPage />} />
        <Route path="audit" element={<AuditPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
