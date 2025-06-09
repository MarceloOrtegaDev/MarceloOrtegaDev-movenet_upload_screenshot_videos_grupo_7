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


async function runDetection() {
  status.innerText = 'Cargando modelo...';
  console.log('Cargando tf...');
  await tf.ready();
  console.log('tf listo');
  detector = await createDetector();
  console.log('Detector creado:', detector);
  status.innerText = 'Modelo cargado. Procesando video...';

  camera.video.play();
  camera.updateCanvasSize();
  detectFrame();
}


function handleVideoUpload(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  camera.video.src = url;
  camera.video.load();
  camera.video.onloadeddata = () => {
    camera.updateCanvasSize();
    status.innerText = 'Video cargado. Presioná "Detectar Poses"';
  };
}

async function main() {
  camera = new Context();
  document.getElementById('videofile').addEventListener('change', handleVideoUpload);
  document.getElementById('submit').addEventListener('click', runDetection);
}

main();
document.getElementById('download').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'deteccion_pose.png';
  link.href = camera.canvas.toDataURL('image/png');
  link.click();
});

