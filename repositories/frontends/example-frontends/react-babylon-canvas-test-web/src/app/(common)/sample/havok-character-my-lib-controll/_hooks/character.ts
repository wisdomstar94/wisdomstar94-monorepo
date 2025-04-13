import { AbstractMesh, ArcRotateCamera, Scene, ShadowGenerator } from '@babylonjs/core';
import { useBabylonCharacterController } from '@wisdomstar94/react-babylon-utils';

export function useCharacter(props: { babylonCharacterController: ReturnType<typeof useBabylonCharacterController> }) {
  const { babylonCharacterController } = props;

  function settingShadow(params: { mesh: AbstractMesh; shadowGenerator: ShadowGenerator }) {
    const { mesh, shadowGenerator } = params;
    mesh.receiveShadows = true;
    const shadowMap = shadowGenerator.getShadowMap();
    shadowMap?.renderList?.push(mesh);
  }

  async function addCharacter(params: {
    scene: Scene;
    shadowGenerator: ShadowGenerator;
    camera: ArcRotateCamera;
    characterId: string;
  }) {
    const { scene, shadowGenerator, camera, characterId } = params;
    const addedInfo = await babylonCharacterController.add({
      camera,
      scene,
      characterInitPosition: { x: 5, y: 1, z: 0 },
      characterSize: { x: 1, y: 2, z: 1 },
      characterId,
      characterNickName: '..',
      characterAnimationGroupNames: {
        idleAnimationGroupName: 'idle',
        walkingAnimationGroupName: 'walking',
        jumpingAnimationGroupName: 'jumping',
        runningAnimationGroupName: 'running',
      },
      characterJumpingOptions: {
        jumpingAnimationStartDelay: 450,
        jumpingAnimationDuration: 200,
        jumpingTotalDuration: 1000,
      },
      glbFileUrl: {
        baseUrl: '/',
        filename: 'casual-lowpoly-male.glb',
      },
      // characterPhysicsBodyOptions: {
      //   // angularDamping: 100,
      //   // linearDamping: 10,
      // },
    });

    addedInfo?.characterMeshes.forEach((mesh) => {
      mesh.scaling.scaleInPlace(0.01);
      settingShadow({ mesh, shadowGenerator });
    });
  }

  return {
    addCharacter,
  };
}
