'use client';

import {
  AnimationPropertiesOverride,
  ArcRotateCamera,
  CharacterSupportedState,
  CharacterSurfaceInfo,
  HavokPlugin,
  HemisphericLight,
  KeyboardEventTypes,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsAggregateParameters,
  PhysicsCharacterController,
  PhysicsShapeType,
  PointerEventTypes,
  Quaternion,
  Vector3,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
registerBuiltInLoaders();

// applyForce 방식으로 mesh 를 움직이는건 빙판(얼음)위에서 움직이는 상황과 같은 비슷한 상황에서 미끄러지는 물리법칙이 필요할 때 사용하면 좋을 듯 함.
export default function Page() {
  return (
    <div className="w-full relative">
      <BabylonCanvas
        className="w-[50%] aspect-square bg-slate-200"
        enableAxesViewer={true}
        onLoaded={async (params) => {
          const { engineInfo, canvas, scene } = params;
          console.log('#BabylonCanvas.onLoaded', { engineInfo, canvas, scene });

          // havok 물리 엔진 활성화
          const havokInstance = await HavokPhysics();
          const havokPlugin = new HavokPlugin(true, havokInstance);
          console.log('#havokPlugin', { havokPlugin });

          // scene 설정
          scene.shadowsEnabled = true;
          scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin); // 중력 설정

          // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
          if (scene.animationPropertiesOverride === null) {
            scene.animationPropertiesOverride = new AnimationPropertiesOverride();
            scene.animationPropertiesOverride.enableBlending = true;
            scene.animationPropertiesOverride.blendingSpeed = 0.05;
          }

          // 전반적인 빛
          const light2 = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
          light2.intensity = 0.7;

          // glb 파일 로드 후 scene 에 추가하기
          // const loadedAssetContainer = await LoadAssetContainerAsync('test-box4.glb', scene, { rootUrl: '/' });
          // loadedAssetContainer.addAllToScene();

          // cube mesh 의 부모 mesh 지정하기
          const importedMeshParent = MeshBuilder.CreateBox('box', { width: 2, height: 2, depth: 2 }, scene);
          importedMeshParent.visibility = 0;
          importedMeshParent.position.y = 2;

          // glb 로 가져온 mesh 찾고 property 일부 조정하기
          // loadedAssetContainer.meshes.forEach((item) => {
          //   item.parent = importedMeshParent;
          //   item.receiveShadows = true;
          //   item.visibility = 1;
          // });

          // // cube mesh 의 부모 mesh 에 havok 물리 세계의 mesh 연결하기
          // const cubeAggregate = new PhysicsAggregate(
          //   importedMeshParent,
          //   PhysicsShapeType.MESH,
          //   { mass: 1, restitution: 0.75 } satisfies PhysicsAggregateParameters,
          //   scene
          // );
          // cubeAggregateRef.current = cubeAggregate;
          // console.log('#cubeAggregate', { cubeAggregate });

          // 바닥 셋팅
          const floor = MeshBuilder.CreateBox('Floor', { width: 6, height: 0.1, depth: 6 }, scene);
          floor.position.y = -0.1;

          // 바닥에 havok 물리 세계의 mesh 연결하기
          const floorAggregate = new PhysicsAggregate(
            floor,
            PhysicsShapeType.MESH,
            { mass: 0 } satisfies PhysicsAggregateParameters,
            scene
          );
          console.log('#floorAggregate', { floorAggregate });

          // camera 설정
          const camera = new ArcRotateCamera('camera2', Math.PI / 2, -Math.PI, 30, new Vector3(0, 0, 0), scene);
          // camera.setTarget(new Vector3(0, 0, 0));
          camera.attachControl();

          // Player/Character state
          let state: 'IN_AIR' | 'ON_GROUND' | 'START_JUMP' | undefined = 'IN_AIR';
          const inAirSpeed = 8.0;
          const onGroundSpeed = 10.0;
          const jumpHeight = 1.5;
          let wantJump = false;
          const inputDirection = new Vector3(0, 0, 0);
          const forwardLocalSpace = new Vector3(0, 0, 1);
          const characterOrientation = Quaternion.Identity();
          const characterGravity = new Vector3(0, -18, 0);

          // Physics shape for the character
          const h = 1.8;
          const r = 0.6;
          const displayCapsule = MeshBuilder.CreateCapsule('CharacterDisplay', { height: h, radius: r }, scene); // 사람들 눈에 보여지는 캐릭터 mesh 부분
          console.log('#displayCapsule', displayCapsule);
          const characterPosition = new Vector3(0, 0, 0);
          const characterController = new PhysicsCharacterController(
            characterPosition,
            { capsuleHeight: h, capsuleRadius: r },
            scene
          );
          // camera.setTarget(characterPosition);

          // State handling
          // depending on character state and support, set the new state
          const getNextState = function (supportInfo: CharacterSurfaceInfo) {
            if (state == 'IN_AIR') {
              if (supportInfo.supportedState == CharacterSupportedState.SUPPORTED) {
                return 'ON_GROUND';
              }
              return 'IN_AIR';
            } else if (state == 'ON_GROUND') {
              if (supportInfo.supportedState != CharacterSupportedState.SUPPORTED) {
                return 'IN_AIR';
              }

              if (wantJump) {
                return 'START_JUMP';
              }
              return 'ON_GROUND';
            } else if (state == 'START_JUMP') {
              return 'IN_AIR';
            }
          };

          // From aiming direction and state, compute a desired velocity
          // That velocity depends on current state (in air, on ground, jumping, ...) and surface properties
          const getDesiredVelocity = function (
            deltaTime: number,
            supportInfo: CharacterSurfaceInfo,
            characterOrientation: Quaternion,
            currentVelocity: Vector3
          ) {
            const nextState = getNextState(supportInfo);
            if (nextState !== state) {
              state = nextState;
            }

            const upWorld = characterGravity.normalizeToNew();
            upWorld.scaleInPlace(-1.0);
            const forwardWorld = forwardLocalSpace.applyRotationQuaternion(characterOrientation);
            if (state == 'IN_AIR') {
              const desiredVelocity = inputDirection.scale(inAirSpeed).applyRotationQuaternion(characterOrientation);
              const outputVelocity = characterController.calculateMovement(
                deltaTime,
                forwardWorld,
                upWorld,
                currentVelocity,
                Vector3.ZeroReadOnly,
                desiredVelocity,
                upWorld
              );
              // Restore to original vertical component
              outputVelocity.addInPlace(upWorld.scale(-outputVelocity.dot(upWorld)));
              outputVelocity.addInPlace(upWorld.scale(currentVelocity.dot(upWorld)));
              // Add gravity
              outputVelocity.addInPlace(characterGravity.scale(deltaTime));
              return outputVelocity;
            } else if (state == 'ON_GROUND') {
              // Move character relative to the surface we're standing on
              // Correct input velocity to apply instantly any changes in the velocity of the standing surface and this way
              // avoid artifacts caused by filtering of the output velocity when standing on moving objects.
              const desiredVelocity = inputDirection.scale(onGroundSpeed).applyRotationQuaternion(characterOrientation);

              let outputVelocity = characterController.calculateMovement(
                deltaTime,
                forwardWorld,
                supportInfo.averageSurfaceNormal,
                currentVelocity,
                supportInfo.averageSurfaceVelocity,
                desiredVelocity,
                upWorld
              );
              // Horizontal projection
              {
                outputVelocity.subtractInPlace(supportInfo.averageSurfaceVelocity);
                const inv1k = 1e-3;
                if (outputVelocity.dot(upWorld) > inv1k) {
                  const velLen = outputVelocity.length();
                  outputVelocity.normalizeFromLength(velLen);

                  // Get the desired length in the horizontal direction
                  const horizLen = velLen / supportInfo.averageSurfaceNormal.dot(upWorld);

                  // Re project the velocity onto the horizontal plane
                  const c = supportInfo.averageSurfaceNormal.cross(outputVelocity);
                  outputVelocity = c.cross(upWorld);
                  outputVelocity.scaleInPlace(horizLen);
                }
                outputVelocity.addInPlace(supportInfo.averageSurfaceVelocity);
                return outputVelocity;
              }
            } else if (state == 'START_JUMP') {
              const u = Math.sqrt(2 * characterGravity.length() * jumpHeight);
              const curRelVel = currentVelocity.dot(upWorld);
              return currentVelocity.add(upWorld.scale(u - curRelVel));
            }
            return Vector3.Zero();
          };

          // Display tick update: compute new camera position/target, update the capsule for the character display

          scene.onBeforeRenderObservable.add(() => {
            camera.alpha = Math.PI;
            camera.beta = Math.PI / 1.5;
            camera.radius = -15;
            camera.position.x = displayCapsule.position.x - 5;
            camera.position.y = displayCapsule.position.y + 5;
            camera.position.z = displayCapsule.position.z;
            camera.setTarget(displayCapsule.position);

            // camera.setTarget(characterController.getPosition());
            // camera.position.y += (displayCapsule.position.y + 2 - camera.position.y) * 0.04;
            displayCapsule.position.copyFrom(characterController.getPosition());
            // // camera following
            // const cameraDirection = camera.getDirection(new Vector3(0, 0, 0));
            // // cameraDirection.y = 0;
            // cameraDirection.normalize();
            // camera.setTarget(Vector3.Lerp(camera.getTarget(), displayCapsule.position, 0.1));
            // const dist = Vector3.Distance(camera.position, displayCapsule.position);
            // const amount = (Math.min(dist - 6, 0) + Math.max(dist - 9, 0)) * 0.04;
            // cameraDirection.scaleAndAddToRef(amount, camera.position);
            // camera.position.y += (displayCapsule.position.y + 2 - camera.position.y) * 0.04;
          });

          // After physics update, compute and set new velocity, update the character controller state
          scene.onAfterPhysicsObservable.add(() => {
            if (scene.deltaTime == undefined) return;
            const dt = scene.deltaTime / 1000.0;
            if (dt == 0) return;

            const down = new Vector3(0, -1, 0);
            const support = characterController.checkSupport(dt, down);

            Quaternion.FromEulerAnglesToRef(0, camera.rotation.y, 0, characterOrientation);
            const desiredLinearVelocity = getDesiredVelocity(
              dt,
              support,
              characterOrientation,
              characterController.getVelocity()
            );
            characterController.setVelocity(desiredLinearVelocity);

            characterController.integrate(dt, support, characterGravity);
          });

          // Rotate camera
          // Add a slide vector to rotate arount the character
          let isMouseDown = false;
          scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
              case PointerEventTypes.POINTERDOWN:
                isMouseDown = true;
                break;

              case PointerEventTypes.POINTERUP:
                isMouseDown = false;
                break;

              case PointerEventTypes.POINTERMOVE:
                if (isMouseDown) {
                  const tgt = camera.getTarget().clone();
                  camera.position.addInPlace(
                    camera.getDirection(Vector3.Right()).scale(pointerInfo.event.movementX * -0.02)
                  );
                  camera.setTarget(tgt);
                }
                break;
            }
          });

          // Input to direction
          // from keys down/up, update the Vector3 inputDirection to match the intended direction. Jump with space
          scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
              case KeyboardEventTypes.KEYDOWN:
                if (kbInfo.event.key == 'w' || kbInfo.event.key == 'ArrowUp') {
                  inputDirection.x = -1;
                } else if (kbInfo.event.key == 's' || kbInfo.event.key == 'ArrowDown') {
                  inputDirection.x = 1;
                } else if (kbInfo.event.key == 'a' || kbInfo.event.key == 'ArrowLeft') {
                  inputDirection.z = -1;
                } else if (kbInfo.event.key == 'd' || kbInfo.event.key == 'ArrowRight') {
                  inputDirection.z = 1;
                } else if (kbInfo.event.key == ' ') {
                  wantJump = true;
                }
                break;
              case KeyboardEventTypes.KEYUP:
                if (
                  kbInfo.event.key == 'w' ||
                  kbInfo.event.key == 's' ||
                  kbInfo.event.key == 'ArrowUp' ||
                  kbInfo.event.key == 'ArrowDown'
                ) {
                  inputDirection.x = 0;
                }
                if (
                  kbInfo.event.key == 'a' ||
                  kbInfo.event.key == 'd' ||
                  kbInfo.event.key == 'ArrowLeft' ||
                  kbInfo.event.key == 'ArrowRight'
                ) {
                  inputDirection.z = 0;
                } else if (kbInfo.event.key == ' ') {
                  wantJump = false;
                }
                break;
            }
          });

          // render
          engineInfo.engine.runRenderLoop(() => {
            scene.render();
          });
        }}
      />
    </div>
  );
}
