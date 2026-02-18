import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { useTelegram } from '@/hooks/useTelegram'

const pageVariants = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
}

const pageTransition = { type: 'tween', duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }

export function Layout() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const { haptic } = useTelegram()

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-tg-bg">
      <main ref={mainRef} className="flex-1 overflow-auto pb-20 overscroll-contain">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav onNavigate={() => haptic.selection()} />
    </div>
  )
}
