'use client'

import { useState, useEffect } from 'react'

export function useSpeedDetection() {
  const [speed, setSpeed] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isWatching, setIsWatching] = useState<boolean>(false)

  useEffect(() => {
    let watchId: number

    const startWatching = () => {
      if ('geolocation' in navigator && typeof navigator.geolocation.watchPosition === 'function') {
        setIsWatching(true)
        try {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              if (position.coords.speed !== null) {
                const speedInKmh = position.coords.speed * 3.6
                setSpeed(speedInKmh)
              } else {
                console.log('Speed data not available in this position update')
              }
              setError(null)
            },
            (err: GeolocationPositionError) => {
              console.error('Geolocation error:', JSON.stringify(err, null, 2))
              setError(`Geolocation error: ${err.message}`)
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          )
        } catch (e) {
          console.error('Error setting up geolocation watch:', e)
          setError('Failed to set up location tracking. Please refresh the page and try again.')
        }
      } else {
        setError('Geolocation is not fully supported by your browser')
      }
    }

    startWatching()

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
      setIsWatching(false)
    }
  }, [])

  return { speed, error, isWatching }
}

