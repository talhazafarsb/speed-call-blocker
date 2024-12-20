'use client'

import React from 'react'
import { Phone, PhoneOff, Settings, MapPin } from 'lucide-react'
import { useSpeedDetection } from '@/hooks/use-speed-detection'
import { useSettingsStore } from '@/stores/settings-store'
import { CallHandler } from '@/utils/call-handler'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { PWARegister } from '@/components/pwa-register'

export default function SpeedCallBlocker() {
  const { speed, error, isWatching } = useSpeedDetection()
  const [callStatus, setCallStatus] = React.useState<'incoming' | 'blocked' | 'none'>('none')
  const { speedThreshold, setSpeedThreshold, isCallBlockingEnabled, toggleCallBlocking } = useSettingsStore()
  
  React.useEffect(() => {
    const callHandler = CallHandler.getInstance()
    const unsubscribe = callHandler.subscribe(setCallStatus)
    
    return () => unsubscribe()
  }, [])

  React.useEffect(() => {
    const callHandler = CallHandler.getInstance()
    callHandler.setSpeed(speed)
    callHandler.setThreshold(speedThreshold)
    callHandler.setEnabled(isCallBlockingEnabled)
  }, [speed, speedThreshold, isCallBlockingEnabled])

  return (
    <>
      <PWARegister />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Speed Call Blocker
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Settings</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Speed Threshold (km/h)</label>
                        <Slider
                          value={[speedThreshold]}
                          onValueChange={([value]) => setSpeedThreshold(value)}
                          max={120}
                          step={5}
                        />
                        <span className="text-sm text-muted-foreground">{speedThreshold} km/h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Enable Call Blocking</label>
                        <Switch
                          checked={isCallBlockingEnabled}
                          onCheckedChange={toggleCallBlocking}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? (
                <div className="text-red-500 text-sm space-y-2">
                  <p>{error}</p>
                  <p className="text-xs text-gray-500">
                    If the issue persists, please try using a different browser or device.
                  </p>
                </div>
              ) : isWatching ? (
                <>
                  <div className="text-center">
                    <div className="text-6xl font-bold tabular-nums">
                      {Math.round(speed)}
                    </div>
                    <div className="text-sm text-muted-foreground">km/h</div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="text-center space-y-2">
                    <div className="text-sm font-medium">Call Blocking Status</div>
                    {speed > speedThreshold && isCallBlockingEnabled ? (
                      <div className="text-red-500 flex items-center justify-center gap-2">
                        <PhoneOff className="h-4 w-4" />
                        Calls will be blocked
                      </div>
                    ) : (
                      <div className="text-green-500 flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        Calls allowed
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Waiting for location data...</div>
                </div>
              )}
            </CardContent>
          </Card>

          {callStatus !== 'none' && (
            <Card className={callStatus === 'blocked' ? 'bg-red-50' : 'bg-green-50'}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {callStatus === 'blocked' ? (
                      <PhoneOff className="h-4 w-4 text-red-500" />
                    ) : (
                      <Phone className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">
                      {callStatus === 'blocked' ? 'Call Blocked' : 'Incoming Call'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {callStatus === 'blocked' ? 'Speed limit exceeded' : 'Safe to answer'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

