# useASR

`useASR` is a custom React hook for Automatic Speech Recognition (ASR) that provides functionality to record audio using the Web Audio API.

## Installation

```bash
npm install react-asr

or

yarn add react-asr
```

## Usage

```
import React from 'react';
import useASR, { ConfigType } from 'react-asr';

const config: ConfigType = {
  MIN_DECIBELS: -80,
  DETECTION_INTERVAL: 100,
  SILENCE_DURATION: 2000,
  LOG_ENABLED: false,
};

const ExampleComponent = () => {
  const {
    isRecording,
    recordedBlob,
    startRecording,
    stopRecording,
  } = useASR(config)

  // ...rest of the component code
};

export default ExampleComponent;
```

Configuration (Optional)
The useASR hook accepts an optional configuration object of type ConfigType. If no configuration object is provided, default values will be used. The configuration options are as follows:

MIN_DECIBELS (number, default: -80): The minimum decibel level to consider as audio input.
DETECTION_INTERVAL (number, default: 100): The interval (in milliseconds) at which audio is analyzed for silence detection.
SILENCE_DURATION (number, default: 2000): The duration (in milliseconds) of silence required to end the recording.
LOG_ENABLED (boolean, default: false): Controls whether to log debug information to the console.

Return Values
The useASR hook returns an object with the following properties:

isRecording (boolean): Indicates whether audio recording is currently in progress.
recordedBlob (Blob | null): The recorded audio data in Blob format. It will be null if no recording has been made or if the recording has not yet finished.
startRecording (function): Starts the audio recording process.
stopRecording (function): Stops the audio recording process.

License
This project is licensed under the MIT License.
