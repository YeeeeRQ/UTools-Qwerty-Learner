import { useState, useEffect } from 'react'

export default function LoadingIndicator({ text = '载入中...' }) {
  const [status, setStatus] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStatus((prevStatus) => {
        const dots = prevStatus.match(/\./g) ?? []
        const dotCount = dots.length
        const newStatus = dotCount < 6 ? prevStatus + '.' : ''
        return newStatus
      })
    }, 300)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return <div>{text + status}</div>
}
