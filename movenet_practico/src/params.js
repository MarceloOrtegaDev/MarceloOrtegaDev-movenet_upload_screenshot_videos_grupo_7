import * as posedetection from '@tensorflow-models/pose-detection';

export const STATE = {
  backend: 'tfjs-webgl',
  model: posedetection.SupportedModels.MoveNet,
  modelConfig: {
    type: 'lightning',
    scoreThreshold: 0.3,
    maxPoses: 1
  }
};

export const DEFAULT_LINE_WIDTH = 2;
export const DEFAULT_RADIUS = 3;
