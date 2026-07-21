import { Navigate, Route, Routes } from 'react-router-dom'
import { WebLayout } from './layouts/WebLayout'
import { MobileLayout } from './layouts/MobileLayout'
import { ProjectFlowLayout } from './layouts/ProjectFlowLayout'
import { ProjectsPage } from '@/pages/projects/ProjectsPage'
import { AuditTaskPage } from '@/pages/audit-task/AuditTaskPage'
import { AuditResultsPage } from '@/pages/audit-results/AuditResultsPage'
import { ComplianceScoresPage } from '@/pages/compliance-scores/ComplianceScoresPage'
import { ReportListPage } from '@/pages/audit-reports/ReportListPage'
import { ReportDetailPage } from '@/pages/audit-reports/ReportDetailPage'
import { MobileTasksPage } from '@/pages/mobile/MobileTasksPage'
import { MobileFieldWorkspacePage } from '@/pages/mobile/MobileFieldWorkspacePage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<WebLayout />}>
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectFlowLayout />}>
          <Route index element={<Navigate to="task" replace />} />
          <Route path="task" element={<AuditTaskPage />} />
          <Route path="results" element={<AuditResultsPage />} />
          <Route path="scores" element={<ComplianceScoresPage />} />
          <Route path="reports" element={<ReportListPage />} />
          <Route path="reports/:reportId" element={<ReportDetailPage />} />
        </Route>
      </Route>

      <Route path="m" element={<MobileLayout />}>
        <Route index element={<Navigate to="tasks" replace />} />
        <Route path="tasks" element={<MobileTasksPage />} />
        <Route path="tasks/:projectId" element={<MobileFieldWorkspacePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  )
}
