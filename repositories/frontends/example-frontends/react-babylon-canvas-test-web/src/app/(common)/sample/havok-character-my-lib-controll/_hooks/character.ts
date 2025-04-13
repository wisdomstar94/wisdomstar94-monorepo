import { AbstractMesh, ArcRotateCamera, Scene, ShadowGenerator } from '@babylonjs/core';
import { IUseBabylonCharacterController, useBabylonCharacterController } from '@wisdomstar94/react-babylon-utils';
import { useKeyboardManager } from '@wisdomstar94/react-keyboard-manager';

export function useCharacter(props: {
  babylonCharacterController: ReturnType<typeof useBabylonCharacterController>;
  characterId: string;
}) {
  const { babylonCharacterController, characterId } = props;

  useKeyboardManager({
    onUp: (keyMap) => disposeMoving({ direction: 'Up', isRunning: keyMap.get('Shift') ?? false }),
    onDown: (keyMap) => disposeMoving({ direction: 'Down', isRunning: keyMap.get('Shift') ?? false }),
    onLeft: (keyMap) => disposeMoving({ direction: 'Left', isRunning: keyMap.get('Shift') ?? false }),
    onRight: (keyMap) => disposeMoving({ direction: 'Right', isRunning: keyMap.get('Shift') ?? false }),
    onUpLeft: (keyMap) => disposeMoving({ direction: 'Up+Left', isRunning: keyMap.get('Shift') ?? false }),
    onUpRight: (keyMap) => disposeMoving({ direction: 'Up+Right', isRunning: keyMap.get('Shift') ?? false }),
    onDownLeft: (keyMap) => disposeMoving({ direction: 'Down+Left', isRunning: keyMap.get('Shift') ?? false }),
    onDownRight: (keyMap) => disposeMoving({ direction: 'Down+Right', isRunning: keyMap.get('Shift') ?? false }),
    onRelease: (keyMap) => disposeMoving({ direction: undefined, isRunning: keyMap.get('Shift') ?? false }),
    onJump: () => disposeJumping(),
  });

  function disposeMoving(params: {
    direction: IUseBabylonCharacterController.CharacterGoDirection | undefined;
    isRunning: boolean;
  }) {
    const { direction, isRunning } = params;
    const c = babylonCharacterController.getCharacter(characterId);
    if (c === undefined) return;
    babylonCharacterController.setCharacterMoving({ characterId, direction, isRunning });
  }

  function disposeJumping() {
    const c = babylonCharacterController.getCharacter(characterId);
    if (c === undefined) return;
    if (c !== undefined && c.isJumpPossible !== false) babylonCharacterController.setCharacterJumping(characterId);
  }

  function settingShadow(params: { mesh: AbstractMesh; shadowGenerator: ShadowGenerator }) {
    const { mesh, shadowGenerator } = params;
    mesh.receiveShadows = true;
    const shadowMap = shadowGenerator.getShadowMap();
    shadowMap?.renderList?.push(mesh);
  }

  async function addCharacter(params: { scene: Scene; shadowGenerator: ShadowGenerator; camera: ArcRotateCamera }) {
    const { scene, shadowGenerator, camera } = params;
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
