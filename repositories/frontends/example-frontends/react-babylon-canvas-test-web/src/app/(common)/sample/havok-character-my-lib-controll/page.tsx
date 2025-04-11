'use client';

import {
  AbstractMesh,
  ActionManager,
  ArcRotateCamera,
  Color3,
  DirectionalLight,
  HavokPlugin,
  HemisphericLight,
  MeshBuilder,
  PhysicsBody,
  PhysicsMotionType,
  PhysicsShapeBox,
  PhysicsShapeCapsule,
  Quaternion,
  ShadowGenerator,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import {
  IUseBabylonCharacterController,
  useBabylonCharacterController,
  useBabylonMeshPhysicsManager,
} from '@wisdomstar94/react-babylon-utils';
import { useKeyboardManager } from '@wisdomstar94/react-keyboard-manager';
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
registerBuiltInLoaders();

export default function TestHavokCharacterMyLibControllPage() {
  const characterId = '1';

  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  const babylonCharacterController = useBabylonCharacterController({
    thisClientCharacterOptions: {
      characterId,
      nearDistance: 3,
    },
    debugOptions: {
      isShowCharacterParentBoxMesh: false,
    },
  });

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

            scene.actionManager = new ActionManager(scene);

            const gravityVector = new Vector3(0, -19.81, 0);
            const havokInstance = await HavokPhysics();
            const physicsPlugin = new HavokPlugin(undefined, havokInstance);
            scene.enablePhysics(gravityVector, physicsPlugin);
            scene.shadowsEnabled = true;

            const light2 = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
            light2.intensity = 0.2;

            const light = new DirectionalLight('dirLight', new Vector3(0, -1, 1), scene);
            light.position.z = -22;
            light.position.x = 22;
            light.position.y = 20;
            light.intensity = 0.7;
            light.shadowMinZ = 10;
            light.shadowMaxZ = 450;
            light.setDirectionToTarget(new Vector3(-1, 0, 1));

            const camera = new ArcRotateCamera('camera1', Math.PI / 2, -Math.PI / 2.5, 10, Vector3.Zero(), scene);

            const shadowGenerator = new ShadowGenerator(4096, light, undefined, camera);
            shadowGenerator.bias = 0.0003;

            const settingShadow = (mesh: AbstractMesh) => {
              mesh.receiveShadows = true;
              const shadowMap = shadowGenerator.getShadowMap();
              shadowMap?.renderList?.push(mesh);
            };

            // 바닥 셋팅
            babylonMeshPhysicsManager.injectObject({
              manageName: 'ground',
              mesh: (params) => {
                const { manageName } = params;
                const mesh = MeshBuilder.CreateBox(manageName, { width: 40, height: 2, depth: 40 }, scene);
                mesh.position.y = -1;

                const groundMaterial = new StandardMaterial('ground', scene);
                // groundMaterial.ambientColor = new Color3(1, 1, 1);
                groundMaterial.specularColor = new Color3(0, 0, 0);
                groundMaterial.emissiveColor = new Color3(0.2, 0.2, 0.2);
                groundMaterial.useLightmapAsShadowmap = true;
                mesh.material = groundMaterial;

                settingShadow(mesh);
                return mesh;
              },
              physicsBody: (params) => {
                const { mesh } = params;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
                body.shape = new PhysicsShapeBox(
                  new Vector3(0, 0, 0),
                  Quaternion.Identity(),
                  new Vector3(40, 2, 40),
                  scene
                );
                body.setMassProperties({ mass: 0.1 });
                return body;
              },
            });

            // 가운데 고정 박스 셋팅
            babylonMeshPhysicsManager.injectObject({
              manageName: 'center-box',
              mesh: (params) => {
                const { manageName } = params;
                const mesh = MeshBuilder.CreateBox(manageName, { width: 2, height: 2, depth: 2 }, scene); // width == x, height == y, depth == z
                mesh.position.y = 1.2;
                mesh.position.x = 0;
                mesh.position.z = 0;
                settingShadow(mesh);
                return mesh;
              },
              physicsBody: (params) => {
                const { mesh } = params;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
                body.shape = new PhysicsShapeBox(
                  new Vector3(0, 0, 0),
                  Quaternion.Identity(),
                  new Vector3(2, 2, 2),
                  scene
                );
                body.setMassProperties({ mass: 0.1 });
                return body;
              },
            });

            babylonMeshPhysicsManager.injectObject({
              manageName: 'center-box2',
              mesh: (params) => {
                const { manageName } = params;
                const mesh = MeshBuilder.CreateBox(manageName, { width: 2, height: 2, depth: 2 }, scene); // width == x, height == y, depth == z
                mesh.position.y = 1.2;
                mesh.position.x = 0;
                mesh.position.z = 4;
                settingShadow(mesh);
                return mesh;
              },
              physicsBody: (params) => {
                const { mesh } = params;
                const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
                body.shape = new PhysicsShapeCapsule(new Vector3(0, -0.5, 0), new Vector3(0, 0.5, 0), 1, scene);
                body.setMassProperties({ mass: 0.1 });
                return body;
              },
            });

            // 캐릭터 셋팅
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
                jumpingAnimationDuration: 400,
                jumpingTotalDuration: 1600,
              },
              glbFileUrl: {
                baseUrl: '/',
                filename: 'casual-lowpoly-male.glb',
              },
              // characterPhysicsBodyOptions: {
              //   angularDamping: 100,
              //   linearDamping: 10,
              // },
            });

            addedInfo?.characterMeshes.forEach((mesh) => {
              mesh.scaling.scaleInPlace(0.01);
              settingShadow(mesh);
            });

            // render
            engineInfo.engine.runRenderLoop(() => {
              scene.render();
            });
          }}
        />
      </div>
    </>
  );
}
