const webcamVideo = document.querySelector("#webcam");

async function startWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    webcamVideo.srcObject = stream;
  } catch (error) {
    console.error("Webcam error:", error);
    webcamVideo.insertAdjacentHTML(
      "afterend",
      "<p>Could not access the camera. Allow permission when prompted, or use Live Server at <code>http://127.0.0.1</code> (not a <code>file://</code> URL).</p>"
    );
  }
}

startWebcam();
