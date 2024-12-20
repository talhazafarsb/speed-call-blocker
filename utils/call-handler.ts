type CallStatus = 'incoming' | 'blocked' | 'none'

export class CallHandler {
  private static instance: CallHandler
  private currentSpeed: number = 0
  private threshold: number = 20
  private enabled: boolean = true
  private callbacks: ((status: CallStatus) => void)[] = []

  private constructor() {
    setInterval(() => {
      if (Math.random() > 0.7) {
        this.handleIncomingCall()
      }
    }, 10000 + Math.random() * 20000)
  }

  static getInstance(): CallHandler {
    if (!CallHandler.instance) {
      CallHandler.instance = new CallHandler()
    }
    return CallHandler.instance
  }

  setSpeed(speed: number) {
    this.currentSpeed = speed
  }

  setThreshold(threshold: number) {
    this.threshold = threshold
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  subscribe(callback: (status: CallStatus) => void) {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback)
    }
  }

  private handleIncomingCall() {
    const status: CallStatus = this.shouldBlockCall() ? 'blocked' : 'incoming'
    this.callbacks.forEach(callback => callback(status))
    
    setTimeout(() => {
      this.callbacks.forEach(callback => callback('none'))
    }, 3000)
  }

  private shouldBlockCall(): boolean {
    return this.enabled && this.currentSpeed > this.threshold
  }
}

