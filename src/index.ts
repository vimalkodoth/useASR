import { useRef, useState } from 'react'
import audioBufferToWav from 'audiobuffer-to-wav'
import type { ASRHookResult, ConfigType } from './types'

const defaults = {
  MIN_DECIBELS: -45,
  DETECTION_INTERVAL: 50,
  SILENCE_DURATION: 2000,
  LOG_ENABLED: false,
}

function useASR(config?: ConfigType): ASRHookResult {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const mediaRecorder = useRef<MediaRecorder>()

  const finalConfig = Object.assign(defaults, config)
  const { MIN_DECIBELS, DETECTION_INTERVAL, SILENCE_DURATION, LOG_ENABLED } = finalConfig

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current?.stop()
      setIsRecording(false)
    }
  }

  const startRecording = async () => {
    setIsRecording(true)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new AudioContext()
    const sourceNode = audioContext.createMediaStreamSource(stream)
    const analyserNode = audioContext.createAnalyser()
    analyserNode.minDecibels = MIN_DECIBELS
    analyserNode.fftSize = 2048
    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    let silenceStart = Date.now()
    let isSilence = false
    let isSpeechStarted = false

    sourceNode.connect(analyserNode)

    mediaRecorder.current = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
    })

    const chunks: BlobPart[] = []

    const readBlobAsAudioBuffer = (blob: Blob) =>
      new Promise<AudioBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(blob)
        reader.onloadend = () => {
          const audiContextBuffer = new AudioContext()
          audiContextBuffer.decodeAudioData(
            reader.result as ArrayBuffer,
            (buffer) => {
              resolve(buffer)
            },
            reject,
          )
        }
      })

    const onDataAvailable = (event: BlobEvent) => {
      chunks.push(event.data)
    }

    const onStopRecording = async () => {
      if (!isSpeechStarted) return
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const audioBuffer = await readBlobAsAudioBuffer(blob)
      const wavBlob = new Blob([audioBufferToWav(audioBuffer)], {
        type: 'audio/wav',
      })
      setRecordedBlob(wavBlob)
    }

    mediaRecorder.current.addEventListener('dataavailable', onDataAvailable)
    mediaRecorder.current.addEventListener('stop', onStopRecording)

    mediaRecorder.current.start(1000)

    const isHumanVoice = () => {
      analyserNode.getByteFrequencyData(dataArray)
      const voiceRange = [85] // range of frequencies that correspond to human voice
      const detectedRange = dataArray.reduce((acc: number[], nxt: number) => {
        if (nxt > voiceRange[0]) acc.push(nxt)
        return acc
      }, [])
      return detectedRange.length > 0
    }

    const interval = setInterval(() => {
      if (!isSpeechStarted) {
        const isHuman = isHumanVoice()
        if (isHuman) {
          isSpeechStarted = true
        }
      } else {
        const isHuman = isHumanVoice()

        if (!isHuman) {
          if (!isSilence) {
            silenceStart = Date.now()
            isSilence = true
          } else if (Date.now() - silenceStart > SILENCE_DURATION) {
            if (LOG_ENABLED) {
              console.log(`Recording needs to be stopped due to silence for ${SILENCE_DURATION} seconds`)
            }
            clearInterval(interval)
            stopRecording()
          }
        } else {
          isSilence = false
        }
      }
    }, DETECTION_INTERVAL)
  }

  return { isRecording, recordedBlob, startRecording, stopRecording }
}

export default useASR
