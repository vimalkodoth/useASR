"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = require("react");
var audiobuffer_to_wav_1 = tslib_1.__importDefault(require("audiobuffer-to-wav"));
var defaults = {
    MIN_DECIBELS: -45,
    DETECTION_INTERVAL: 50,
    SILENCE_DURATION: 2000,
    LOG_ENABLED: false,
};
function useASR(config) {
    var _this = this;
    var _a = (0, react_1.useState)(false), isRecording = _a[0], setIsRecording = _a[1];
    var _b = (0, react_1.useState)(null), recordedBlob = _b[0], setRecordedBlob = _b[1];
    var mediaRecorder = (0, react_1.useRef)();
    var finalConfig = Object.assign(defaults, config);
    var MIN_DECIBELS = finalConfig.MIN_DECIBELS, DETECTION_INTERVAL = finalConfig.DETECTION_INTERVAL, SILENCE_DURATION = finalConfig.SILENCE_DURATION, LOG_ENABLED = finalConfig.LOG_ENABLED;
    var stopRecording = function () {
        var _a;
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            (_a = mediaRecorder.current) === null || _a === void 0 ? void 0 : _a.stop();
            setIsRecording(false);
        }
    };
    var startRecording = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var stream, audioContext, sourceNode, analyserNode, bufferLength, dataArray, silenceStart, isSilence, isSpeechStarted, chunks, readBlobAsAudioBuffer, onDataAvailable, onStopRecording, isHumanVoice, interval;
        var _this = this;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsRecording(true);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({ audio: true })];
                case 1:
                    stream = _a.sent();
                    audioContext = new AudioContext();
                    sourceNode = audioContext.createMediaStreamSource(stream);
                    analyserNode = audioContext.createAnalyser();
                    analyserNode.minDecibels = MIN_DECIBELS;
                    analyserNode.fftSize = 2048;
                    bufferLength = analyserNode.frequencyBinCount;
                    dataArray = new Uint8Array(bufferLength);
                    silenceStart = Date.now();
                    isSilence = false;
                    isSpeechStarted = false;
                    sourceNode.connect(analyserNode);
                    mediaRecorder.current = new MediaRecorder(stream, {
                        mimeType: 'audio/webm',
                    });
                    chunks = [];
                    readBlobAsAudioBuffer = function (blob) {
                        return new Promise(function (resolve, reject) {
                            var reader = new FileReader();
                            reader.readAsArrayBuffer(blob);
                            reader.onloadend = function () {
                                var audiContextBuffer = new AudioContext();
                                audiContextBuffer.decodeAudioData(reader.result, function (buffer) {
                                    resolve(buffer);
                                }, reject);
                            };
                        });
                    };
                    onDataAvailable = function (event) {
                        chunks.push(event.data);
                    };
                    onStopRecording = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var blob, audioBuffer, wavBlob;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!isSpeechStarted)
                                        return [2 /*return*/];
                                    blob = new Blob(chunks, { type: 'audio/webm' });
                                    return [4 /*yield*/, readBlobAsAudioBuffer(blob)];
                                case 1:
                                    audioBuffer = _a.sent();
                                    wavBlob = new Blob([(0, audiobuffer_to_wav_1.default)(audioBuffer)], {
                                        type: 'audio/wav',
                                    });
                                    setRecordedBlob(wavBlob);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    mediaRecorder.current.addEventListener('dataavailable', onDataAvailable);
                    mediaRecorder.current.addEventListener('stop', onStopRecording);
                    mediaRecorder.current.start(1000);
                    isHumanVoice = function () {
                        analyserNode.getByteFrequencyData(dataArray);
                        var voiceRange = [85]; // range of frequencies that correspond to human voice
                        var detectedRange = dataArray.reduce(function (acc, nxt) {
                            if (nxt > voiceRange[0])
                                acc.push(nxt);
                            return acc;
                        }, []);
                        return detectedRange.length > 0;
                    };
                    interval = setInterval(function () {
                        if (!isSpeechStarted) {
                            var isHuman = isHumanVoice();
                            if (isHuman) {
                                isSpeechStarted = true;
                            }
                        }
                        else {
                            var isHuman = isHumanVoice();
                            if (!isHuman) {
                                if (!isSilence) {
                                    silenceStart = Date.now();
                                    isSilence = true;
                                }
                                else if (Date.now() - silenceStart > SILENCE_DURATION) {
                                    if (LOG_ENABLED) {
                                        console.log("Recording needs to be stopped due to silence for ".concat(SILENCE_DURATION, " seconds"));
                                    }
                                    clearInterval(interval);
                                    stopRecording();
                                }
                            }
                            else {
                                isSilence = false;
                            }
                        }
                    }, DETECTION_INTERVAL);
                    return [2 /*return*/];
            }
        });
    }); };
    return { isRecording: isRecording, recordedBlob: recordedBlob, startRecording: startRecording, stopRecording: stopRecording };
}
exports.default = useASR;
//# sourceMappingURL=index.js.map