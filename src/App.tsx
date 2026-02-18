import { useTelegram } from '@/hooks/useTelegram'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { FinancePage, NotesPage, ProfilePage } from '@/pages'

function App() {
  useTelegram()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/finance" replace />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/finance" replace />} />
    </Routes>
  )
}

export default App
