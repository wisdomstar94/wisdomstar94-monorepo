import { ArcRotateCamera, Scene, Vector3 } from '@babylonjs/core';

export function useCamera() {
  function addCamera(params: { scene: Scene }) {
    const { scene } = params;
    const camera = new ArcRotateCamera('camera1', Math.PI / 2, -Math.PI / 2.5, 10, Vector3.Zero(), scene);
    return {
      camera,
    };
  }

  return {
    addCamera,
  };
}
