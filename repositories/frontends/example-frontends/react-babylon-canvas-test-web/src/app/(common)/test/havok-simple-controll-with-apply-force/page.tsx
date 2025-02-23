'use client';

import {
  AnimationPropertiesOverride,
  HavokPlugin,
  HemisphericLight,
  LoadAssetContainerAsync,
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsAggregateParameters,
  PhysicsShapeType,
  UniversalCamera,
  Vector3,
} from '@babylonjs/core';
import HavokPhysics from '@babylonjs/havok';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { useRef } from 'react';
import { useRequestAnimationFrameManager } from '@wisdomstar94/react-request-animation-frame-manager';
registerBuiltInLoaders();

// applyForce 방식으로 mesh 를 움직이는건 빙판(얼음)위에서 움직이는 상황과 같은 비슷한 상황에서 미끄러지는 물리법칙이 필요할 때 사용하면 좋을 듯 함.
export default function Page() {
  const cubeRef = useRef<Mesh | undefined>(undefined);
  const cubeAggregateRef = useRef<PhysicsAggregate | undefined>(undefined);
  const keyDownStates = useRef({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keydown',
      eventListener(event) {
        const key = event.key;
        switch (key) {
          case 'ArrowUp':
            keyDownStates.current.ArrowUp = true;
            break;
          case 'ArrowDown':
            keyDownStates.current.ArrowDown = true;
            break;
          case 'ArrowLeft':
            keyDownStates.current.ArrowLeft = true;
            break;
          case 'ArrowRight':
            keyDownStates.current.ArrowRight = true;
            break;
        }
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keyup',
      eventListener(event) {
        const key = event.key;
        switch (key) {
          case 'ArrowUp':
            keyDownStates.current.ArrowUp = false;
            break;
          case 'ArrowDown':
            keyDownStates.current.ArrowDown = false;
            break;
          case 'ArrowLeft':
            keyDownStates.current.ArrowLeft = false;
            break;
          case 'ArrowRight':
            keyDownStates.current.ArrowRight = false;
            break;
        }
      },
    },
  });

  useRequestAnimationFrameManager({
    isAutoStart: true,
    callback: () => {
      const cube = cubeRef.current;
      if (cube === undefined) {
        return;
      }

      const cubeAggregate = cubeAggregateRef.current;
      if (cubeAggregate === undefined) {
        return;
      }

      if (keyDownStates.current.ArrowUp) {
        cubeAggregate.body.applyForce(new Vector3(-10, 0, 0), cube.absolutePosition);
      }

      if (keyDownStates.current.ArrowDown) {
        cubeAggregate.body.applyForce(new Vector3(10, 0, 0), cube.absolutePosition);
      }

      if (keyDownStates.current.ArrowLeft) {
        cubeAggregate.body.applyForce(new Vector3(0, 0, -10), cube.absolutePosition);
      }

      if (keyDownStates.current.ArrowRight) {
        cubeAggregate.body.applyForce(new Vector3(0, 0, 10), cube.absolutePosition);
      }
    },
  });

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
          const loadedAssetContainer = await LoadAssetContainerAsync('test-box4.glb', scene, { rootUrl: '/' });
          loadedAssetContainer.addAllToScene();

          // cube mesh 의 부모 mesh 지정하기
          const importedMeshParent = MeshBuilder.CreateBox('box', { width: 2, height: 2, depth: 2 }, scene);
          cubeRef.current = importedMeshParent;
          importedMeshParent.visibility = 0;
          importedMeshParent.position.y = 2;

          // glb 로 가져온 mesh 찾고 property 일부 조정하기
          loadedAssetContainer.meshes.forEach((item) => {
            item.parent = importedMeshParent;
            item.receiveShadows = true;
            item.visibility = 1;
          });

          // cube mesh 의 부모 mesh 에 havok 물리 세계의 mesh 연결하기
          const cubeAggregate = new PhysicsAggregate(
            importedMeshParent,
            PhysicsShapeType.MESH,
            { mass: 1, restitution: 0.75 } satisfies PhysicsAggregateParameters,
            scene
          );
          cubeAggregateRef.current = cubeAggregate;
          console.log('#cubeAggregate', { cubeAggregate });

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
          const camera = new UniversalCamera('camera2', new Vector3(7, 7, 7), scene);
          camera.setTarget(new Vector3(0, 0, 0));
          // camera.attachControl();

          // render
          engineInfo.engine.runRenderLoop(() => {
            scene.render();
          });
        }}
      />
    </div>
  );
}
