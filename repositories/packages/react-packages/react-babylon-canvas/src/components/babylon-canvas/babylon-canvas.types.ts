import { AbstractEngine, Engine, Scene, WebGPUEngine } from '@babylonjs/core';
import { CSSProperties, ReactNode } from 'react';

export type Props = {
  className?: string;
  style?: CSSProperties;
  onLoaded: (params: ReadyParams) => void;
};

export type ReadyParams = {
  engineInfo: BabylonEngines;
  canvas: HTMLCanvasElement;
  scene: Scene;
};

export type CanvasState = 'checking' | 'not-supported' | 'supported';

export type BabylonEngines = {
  engine: AbstractEngine;
  webglEngine?: Engine;
  webgpuEngine?: WebGPUEngine;
};
