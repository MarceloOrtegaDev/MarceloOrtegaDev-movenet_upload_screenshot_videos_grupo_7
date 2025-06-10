import { DEFAULT_LINE_WIDTH, DEFAULT_RADIUS, STATE } from './params.js';
import * as posedetection from '@tensorflow-models/pose-detection';

export class Context {
  constructor() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('output');
    this.ctx = this.canvas.getContext('2d');
  }

 updateCanvasSize() {
  this.canvas.width = this.video.videoWidth;
  this.canvas.height = this.video.videoHeight;

  const wrapper = document.getElementById('canvas-wrapper');
  wrapper.style.width = `${this.video.videoWidth}px`;
  wrapper.style.height = `${this.video.videoHeight}px`;

  console.log('Canvas size actualizado:', this.canvas.width, this.canvas.height);
}



  drawCtx() {
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
  }

  drawResults(poses) {
  console.log('Poses recibidas:', poses);
  for (const pose of poses) {
    if (pose.keypoints) {
      console.log('Keypoints:', pose.keypoints);
      this.drawKeypoints(pose.keypoints);
      this.drawSkeleton(pose.keypoints);
    }
  }
}


  drawKeypoints(keypoints) {
    const keypointInd = posedetection.util.getKeypointIndexBySide(STATE.model);

    this.ctx.fillStyle = 'White';
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

    for (const i of keypointInd.middle) this.drawCircle(keypoints[i]);
    this.ctx.fillStyle = 'Green';
    for (const i of keypointInd.left) this.drawCircle(keypoints[i]);
    this.ctx.fillStyle = 'Orange';
    for (const i of keypointInd.right) this.drawCircle(keypoints[i]);
  }

  drawCircle(keypoint) {
    const score = keypoint.score ?? 1;
    if (score < STATE.modelConfig.scoreThreshold) return;
    const circle = new Path2D();
    circle.arc(keypoint.x, keypoint.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
    this.ctx.fill(circle);
    this.ctx.stroke(circle);
  }

  async startCamera() {
  const constraints = {
    video: { facingMode: 'user', width: 640, height: 480 },
    audio: false
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  this.video.srcObject = stream;

  await new Promise(resolve => {
    this.video.onloadedmetadata = () => {
      this.video.play();
      this.updateCanvasSize();
      resolve();
    };
  });
}


  drawSkeleton(keypoints) {
    const adjacentPairs = posedetection.util.getAdjacentPairs(STATE.model);
    this.ctx.strokeStyle = 'White';
    this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

    for (const [i, j] of adjacentPairs) {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];
      if ((kp1.score ?? 1) >= STATE.modelConfig.scoreThreshold &&
          (kp2.score ?? 1) >= STATE.modelConfig.scoreThreshold) {
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x, kp1.y);
        this.ctx.lineTo(kp2.x, kp2.y);
        this.ctx.stroke();
      }
    }
  }
}


