import { useRef, useState } from "react";

function useVoiceRecorder() {

  const [isRecording, setIsRecording] = useState(false);

  const [audioURL, setAudioURL] = useState("");

  const clearRecording = () => {
  if (audioURL) {
    URL.revokeObjectURL(audioURL);
  }

  setAudioURL("");
};

  const mediaRecorderRef = useRef(null);

  const chunksRef = useRef([]);

  const startRecording = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      chunksRef.current = [];

      recorder.ondataavailable = (event) => {

        chunksRef.current.push(event.data);

      };

      recorder.onstop = () => {

        const blob = new Blob(
          chunksRef.current,
          {
            type: "audio/webm",
          }
        );

        const url =
          URL.createObjectURL(blob);

        setAudioURL(url);

        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

      };

      recorder.start();

      setIsRecording(true);

    } catch (error) {

      console.error(error);

    }

  };

  const stopRecording = () => {

    mediaRecorderRef.current?.stop();

    setIsRecording(false);

  };

  

 return {

  isRecording,

  audioURL,

  startRecording,

  stopRecording,

  clearRecording,

};
  

}



export default useVoiceRecorder;