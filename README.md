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

export default function MicWithAlertBox() {
  const { isRecording, recordedBlob, startRecording, stopRecording } = useASR<ConfigType>(config);

  const { postASRMutation } = useContext(SearchContext);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onStartRecording = () => {
    handleClickOpen();
    startRecording();
  };

  useEffect(() => {
    if (!isRecording) {
      handleClose();
    }
  }, [isRecording]);

  useEffect(() => {
    if (!open) {
      stopRecording();
    }
  }, [open]);

  useEffect(() => {
    if (recordedBlob) {
      const formData = new FormData();
      formData.append('file', recordedBlob, 'audio.wav');
      postASRMutation?.mutate(formData);
    }
  }, [recordedBlob]);

  return (
    <>
      <ImageIcon
        src="/mic.svg"
        className="ltr:mr-10 rtl:ml-10 cursor-pointer"
        onClick={onStartRecording}
      />
      <AlertDialogSlide open={open} onClose={handleClose} />
    </>
  );
}


export default MicWithAlertBox;
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
