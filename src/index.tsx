import Loading from './components/Loading'
import './index.css'
import TypingPage from './pages/Typing'
import { isOpenDarkModeAtom } from '@/store'
import { processPayment, setConcealFeature } from '@/utils/utools'
import { useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import process from 'process'
import React, { Suspense, lazy, useEffect } from 'react'
import 'react-app-polyfill/stable'
import { createRoot } from 'react-dom/client'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AnalysisPage = lazy(() => import('./pages/Analysis'))
const GalleryPage = lazy(() => import('./pages/Gallery-N'))

if (process.env.NODE_ENV !== 'production' || (window.utools && window.utools.isDev())) {
  // for dev
  mixpanel.init(import.meta.env.VITE_MIXPANEL_KEY_DEV, { debug: true })
} else {
  // for prod
  mixpanel.init(import.meta.env.VITE_MIXPANEL_KEY)
}

const container = document.getElementById('root')

function Root() {
  const darkMode = useAtomValue(isOpenDarkModeAtom)
  useEffect(() => {
    darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
  }, [darkMode])

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const ret = await utools.fetchUserPayments()
        // 获取用户订单， 设定VIP状态
        processPayment(ret)

        // 设定摸鱼模式
        setConcealFeature()
      } catch (error) {
        alert(error)
        console.error(error)
      }
    }
    if (window.utools) {
      fetchPayment()

      mixpanel.track('Open', { mode: window.getMode() })
    }
  }, [])
  return (
    <React.StrictMode>
      <HashRouter basename={REACT_APP_DEPLOY_ENV === 'pages' ? '/qwerty-learner' : ''}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route index element={<TypingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </HashRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
      />
    </React.StrictMode>
  )
}

container && createRoot(container).render(<Root />)
