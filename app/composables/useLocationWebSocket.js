export const useLocationWebSocket = () => {
  const config = useRuntimeConfig()
  const wsUrl = config.public.wsUrl || 'ws://localhost:8080/ws/locations'
  
  let ws = null
  const isConnected = ref(false)
  const lastLocation = ref(null)
  const error = ref(null)
  
  /**
   * Connect to WebSocket
   * @param {Function} onLocationUpdate - Callback when location updates
   */
  const connect = (onLocationUpdate) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected')
      return
    }
    
    try {
      ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        isConnected.value = true
        error.value = null
      }
      
      ws.onmessage = (event) => {
        try {
          const location = JSON.parse(event.data)
          console.log('📍 Location update received:', location)
          lastLocation.value = location
          
          if (onLocationUpdate) {
            onLocationUpdate(location)
          }
        } catch (err) {
          console.error('Failed to parse location data:', err)
        }
      }
      
      ws.onerror = (err) => {
        console.error('❌ WebSocket error:', err)
        error.value = 'WebSocket connection error'
        isConnected.value = false
      }
      
      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        isConnected.value = false
        
        // Auto-reconnect after 3 seconds
        setTimeout(() => {
          if (!isConnected.value) {
            console.log('Attempting to reconnect...')
            connect(onLocationUpdate)
          }
        }, 3000)
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      error.value = err.message
    }
  }
  
  /**
   * Disconnect WebSocket
   */
  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
      isConnected.value = false
    }
  }
  
  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    connect,
    disconnect,
    isConnected: readonly(isConnected),
    lastLocation: readonly(lastLocation),
    error: readonly(error)
  }
}
