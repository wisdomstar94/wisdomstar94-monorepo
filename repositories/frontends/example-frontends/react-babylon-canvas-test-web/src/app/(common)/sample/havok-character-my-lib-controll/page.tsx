'use client';

import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import { IUseBabylonCharacterController, useBabylonCharacterController } from '@wisdomstar94/react-babylon-utils';
import { useKeyboardManager } from '@wisdomstar94/react-keyboard-manager';
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import { useStairs } from './_hooks/stairs.hook';
import { useRotatePlane } from './_hooks/rotate-plane';
import { useLight } from './_hooks/light';
import { useGravity } from './_hooks/gravity';
import { useCamera } from './_hooks/camera';
import { useShadow } from './_hooks/shadow';
import { useGround } from './_hooks/ground';
import { useCenterBox } from './_hooks/center-box';
import { useCharacter } from './_hooks/character';
registerBuiltInLoaders();

export default function TestHavokCharacterMyLibControllPage() {
  const characterId = '1';
  const { addStairs } = useStairs();
  const { addRotatePlane } = useRotatePlane();
  const { addLight } = useLight();
  const { setGravity } = useGravity();
  const { addCamera } = useCamera();
  const { generateShadow } = useShadow();
  const { addGround } = useGround();
  const { addCenterBox } = useCenterBox();
  const babylonCharacterController = useBabylonCharacterController({
    thisClientCharacterOptions: {
      characterId,
      nearDistance: 3,
    },
    debugOptions: {
      isShowCharacterParentBoxMesh: false,
    },
  });
  const { addCharacter } = useCharacter({ babylonCharacterController });

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

  return (
    <>
      <div className="w-full relative">
        <BabylonCanvas
          className="w-full h-full fixed top-0 left-0 bg-slate-200"
          enableAxesViewer={true}
          onLoaded={async (params) => {
            const { engineInfo, scene } = params;
            await setGravity({ scene });
            const { directionalLight } = addLight({ scene });
            const { camera } = addCamera({ scene });
            const { shadowGenerator } = generateShadow({ directionalLight, camera });
            addGround({ scene, shadowGenerator }); // 바닥 셋팅
            addCenterBox({ scene, shadowGenerator }); // 가운데 고정 박스 셋팅
            addStairs({ scene, shadowGenerator }); // 계단 셋팅
            addRotatePlane({ scene, shadowGenerator }); // 기울어진 바닥 셋팅
            addCharacter({ scene, shadowGenerator, camera, characterId }); // 캐릭터 셋팅
            engineInfo.engine.runRenderLoop(() => scene.render()); // render
          }}
        />
      </div>
    </>
  );
}
