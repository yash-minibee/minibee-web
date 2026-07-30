import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useEffect } from 'react'

export default function CountUp({ value, suffix = '', prefix = '', duration = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    if (inView) motionVal.set(value)
  }, [inView, value, motionVal])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${Math.round(v)}${suffix}`
      }
    })
  }, [spring, prefix, suffix])

  return <span ref={ref}>{prefix}0{suffix}</span>
}
