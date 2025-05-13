import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import WordDocEditor from './pages/WordDocEditor'

const MyDocumentsPage = () => <div>My Documents Page</div>
const AiWorkspacePage = () => <div>AI Workspace Page</div>
const ProfilePage = () => <div>Profile Page</div>

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/generator" element={<Home />} />
          <Route path="/my-documents" element={<WordDocEditor />} />
          <Route path="/ai-workspace" element={<AiWorkspacePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App