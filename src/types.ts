export interface ASRHookResult {
  isRecording: boolean
  recordedBlob: Blob | null
  startRecording: () => void
  stopRecording: () => void
}

export type ConfigType = {
  MIN_DECIBELS: number
  DETECTION_INTERVAL: number
  SILENCE_DURATION: number
  LOG_ENABLED: boolean
}
