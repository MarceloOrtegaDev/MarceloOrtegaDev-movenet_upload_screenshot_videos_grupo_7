import * as posedetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import { STATE } from './params.js';
import { Context } from './camera.js';

let detector, camera;
const status = document.createElement('div');
document.body.appendChild(status);

async function createDetector() {
  const modelType = STATE.modelConfig.type === 'thunder'
    ? posedetection.movenet.modelType.SINGLEPOSE_THUNDER
    : posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
  return await posedetection.createDetector(STATE.model, { modelType });
}

function renderResult(poses) {
  camera.drawCtx();
  camera.drawResults(poses);
}

async function detectFrame() {
  const poses = await detector.estimatePoses(camera.video, {
    maxPoses: STATE.modelConfig.maxPoses,
    flipHorizontal: false
  });
  console.log('Poses detectadas:', poses);
  renderResult(poses);
  if (!camera.video.paused && !camera.video.ended) {
    requestAnimationFrame(detectFrame);
  } else {
    status.innerText = 'Video finalizado, detección completada.';
    console.log('Detección finalizada.');
  }
}

async function detectImage() {
  const poses = await detector.estimatePoses(camera.image, {
    maxPoses: STATE.modelConfig.maxPoses,
    flipHorizontal: false
  });
  console.log('Poses detectadas en imagen:', poses);
  renderResult(poses);
  status.innerText = 'Detección de imagen completada.';
}

async function runDetection() {
  status.innerText = 'Cargando modelo...';
  await tf.ready();
  const modelSelect = document.getElementById('modelTypeSelect');
  STATE.modelConfig.type = modelSelect.value;
  detector = await createDetector();
  status.innerText = 'Modelo cargado.';
  const useCamera = document.getElementById('useCamera').checked;
  if (useCamera) {
    await camera.startCamera();
    detectFrame();
  } else if (camera.image) {
    camera.updateCanvasSize();
    detectImage();
  } else {
    camera.video.play();
    camera.updateCanvasSize();
    detectFrame();
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  if (file.type.startsWith('image/')) {
    camera.image = new Image();
    camera.image.src = url;
    camera.image.onload = () => {
      camera.updateCanvasSize();
      status.innerText = 'Imagen cargada. Presioná "Detectar Poses"';
    };
  } else if (file.type.startsWith('video/')) {
    camera.video.src = url;
    camera.video.load();
    camera.video.onloadeddata = () => {
      camera.updateCanvasSize();
      status.innerText = 'Video cargado. Presioná "Detectar Poses"';
    };
  } else {
    status.innerText = 'Formato no soportado. Subí una imagen o video.';
  }
}

async function main() {
  camera = new Context();
  const fileInput = document.getElementById('videofile');
  fileInput.accept = 'video/*,image/*';
  fileInput.addEventListener('change', handleFileUpload);
  document.getElementById('submit').addEventListener('click', runDetection);
}

main();
document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'deteccion_pose.png';
  link.href = camera.canvas.toDataURL('image/png');
  link.click();
});