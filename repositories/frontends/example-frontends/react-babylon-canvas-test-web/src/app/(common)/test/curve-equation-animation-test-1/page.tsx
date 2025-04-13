'use client';

import { AnimationPropertiesOverride, HemisphericLight, MeshBuilder, UniversalCamera, Vector3 } from '@babylonjs/core';
import { BabylonCanvas } from '@wisdomstar94/react-babylon-canvas';
import { animate } from 'animejs';

export default function Page() {
  return (
    <div className="w-full relative">
      <BabylonCanvas
        className="w-[50%] aspect-square bg-slate-200"
        enableAxesViewer={true}
        onLoaded={async (params) => {
          const { engineInfo, canvas, scene } = params;
          console.log('#BabylonCanvas.onLoaded', { engineInfo, canvas, scene });

          // scene 설정
          scene.shadowsEnabled = true;

          // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
          if (scene.animationPropertiesOverride === null) {
            scene.animationPropertiesOverride = new AnimationPropertiesOverride();
            scene.animationPropertiesOverride.enableBlending = true;
            scene.animationPropertiesOverride.blendingSpeed = 0.05;
          }

          // 전반적인 빛
          const light2 = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
          light2.intensity = 1;

          // create mesh
          const mesh = MeshBuilder.CreateBox('box', { width: 0.1, height: 0.1, depth: 0.1 }, scene);
          mesh.position.x = 0;

          // camera 설정
          const camera = new UniversalCamera('camera2', new Vector3(2, 2, 2), scene);
          camera.setTarget(new Vector3(0, 0, 0));

          // mesh 선형 보간으로 애니메이션 이동
          animate(mesh.position, {
            x: mesh.position.x + 1,
            z: mesh.position.z + 1,
            ease: 'linear',
            duration: 1000,
            onUpdate: (anim) => {
              const { currentTime } = anim;
              const x = currentTime / 1000;
              mesh.position.x = x;
              mesh.position.z = Math.sin(x * 3);
            },
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
