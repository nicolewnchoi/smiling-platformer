import { FaceLandmarker, FaceLandmarkerResult, FilesetResolver } from '@mediapipe/tasks-vision'
import React, { useEffect, useRef } from 'react'

type Props = {
    setSmileResults: (result: any) => void
}

let detectionInterval: any;

const SmileRecognizer = ({setSmileResults}: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    useEffect(() => {
        initVideoAndModel();

        return () => {
            clearInterval(detectionInterval)
        }
    },[])

    const initVideoAndModel = async () => {
        setSmileResults({ isLoading: true }) //may need to change the location of this code

        const videoElement = videoRef.current;
        if (!videoElement) {
            return;
        }
        await initVideo(videoElement);
        const smileLandMarker = await initModel();
        detectionInterval = setInterval(()=>{
            const detections = smileLandMarker.detectForVideo(videoElement, Date.now());
            processDetections(detections, setSmileResults)
        }, 1000) //or 1000/30

        setSmileResults({ isLoading: false }) 
    }
    return (
        // <div>
        //     <video className='scale-x-1' width = "1000" height="800" ref={videoRef}></video>
        //     {/* <video className='scale-x-1' width="10" ref={videoRef}></video> */}
        // </div>
        <div style={{
            width: '600px', // Desired crop width
            height: '800px', // Desired crop height
            overflow: 'hidden', // Hide the overflow (cropping the video)
            position: 'relative'
        }}>
            <video 
                ref={videoRef} 
                className="scale-x-1"
                style={{
                    width: '1000px',  // Original video width (bigger than crop)
                    height: '800px',  // Original video height (bigger than crop)
                    objectFit: 'cover', // Ensure the video covers the whole area
                    position: 'absolute', // Position to control the crop
                    top: '-100px',  // Adjust the position of the video
                    left: '-200px'  // Adjust the position of the video
                }} 
                autoPlay 
                loop 
                muted
            />
        </div>
    );
}

export default SmileRecognizer

async function initVideo(videoElement: HTMLVideoElement) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true
    });
    videoElement.srcObject = stream;
    videoElement.addEventListener("loadeddata", () => {
        videoElement.play();
    })
}
async function initModel() {
        const wasm = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
        // const smileLandMarker = FaceLandmarker.createFromOptions(wasm, {
        const smileLandMarker = FaceLandmarker.createFromOptions(wasm, {
        baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: 'GPU'
        },
        numFaces: 1,
        runningMode: 'VIDEO',
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: true
    });
    return smileLandMarker
} 

function processDetections(detections: FaceLandmarkerResult, setSmileResults: (result: any) => void) {
    const leftSmile = detections.faceBlendshapes[0].categories[44].score;
    const rightSmile = detections.faceBlendshapes[0].categories[45].score;

    // console.log(leftSmile > 0.4, rightSmile > 0.4)

    if (detections && (leftSmile > 0.4 || rightSmile > 0.4) ) {
        setSmileResults({
            isDetected: true,
            dogYPos: 100, // You can pass any value here; we'll handle the logic on the other side
        });
    }
}
