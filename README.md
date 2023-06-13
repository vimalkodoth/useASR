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

## Configuration Options

| Option               | Description                                                                      | Default Value |
| -------------------- | -------------------------------------------------------------------------------- | ------------- |
| `MIN_DECIBELS`       | The minimum decibel level to consider as audio input.                            | -80           |
| `DETECTION_INTERVAL` | The interval (in milliseconds) at which audio is analyzed for silence detection. | 100           |
| `SILENCE_DURATION`   | The duration (in milliseconds) of silence required to end the recording.         | 2000          |
| `LOG_ENABLED`        | Controls whether to log debug information to the console.                        | false         |

## Return Values

| Property         | Description                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `isRecording`    | Indicates whether audio recording is currently in progress.                                                                     |
| `recordedBlob`   | The recorded audio data in Blob format. It will be null if no recording has been made or if the recording has not yet finished. |
| `startRecording` | Starts the audio recording process.                                                                                             |
| `stopRecording`  | Stops the audio recording process.                                                                                              |

License
This project is licensed under the MIT License.
