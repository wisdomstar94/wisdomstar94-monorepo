import { ArcRotateCamera, DirectionalLight, ShadowGenerator } from '@babylonjs/core';

export function useShadow() {
  function generateShadow(params: { directionalLight: DirectionalLight; camera: ArcRotateCamera }) {
    const { directionalLight, camera } = params;
    const shadowGenerator = new ShadowGenerator(4096, directionalLight, undefined, camera);
    shadowGenerator.bias = 0.0003;
    return {
      shadowGenerator,
    };
  }

  return {
    generateShadow,
  };
}
