export type Props = {
  requestMediaAudioPermissionCallback?: (mediaStream: MediaStream) => void;
  requestMediaAudioPermissionError?: (error: unknown) => void;
};
