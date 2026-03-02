import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { RoadmapPage } from './pages/RoadmapPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="roadmap/:id" element={<RoadmapPage />} />
            </Route>
        </Routes>
    )
}

export default App
