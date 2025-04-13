'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { IBabylonCanvas } from './babylon-canvas.interface';
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { AxesViewer, Engine, Scene, WebGPUEngine } from '@babylonjs/core';

export function BabylonCanvas(props: IBabylonCanvas.Props) {
  const { className, style, enableAxesViewer = false, onLoaded } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGpuSupported, setIsWebGpuSupported] = useState<boolean | undefined>(undefined);
  const [engineInfo, setEngineInfo] = useState<IBabylonCanvas.BabylonEngines | undefined>(undefined);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'resize',
      eventListener() {
        engineInfo?.engine.resize();
      },
    },
  });

  useEffect(() => {
    WebGPUEngine.IsSupportedAsync.then((isSupported) => {
      setIsWebGpuSupported(isSupported);
    });
  }, []);

  useEffect(() => {
    if (isWebGpuSupported === undefined) return;
    const canvas = canvasRef.current;
    if (canvas === null) throw new Error(`canvas 가 없습니다.`);

    const obj: IBabylonCanvas.BabylonEngines = (function () {
      if (isWebGpuSupported) {
        const engine = new WebGPUEngine(canvas);
        return {
          engine,
          webgpuEngine: engine,
        };
      } else {
        const engine = new Engine(canvas);
        return {
          engine,
          webglEngine: engine,
        };
      }
    })();

    if (obj.webgpuEngine !== undefined) {
      obj.webgpuEngine.initAsync().then(() => {
        setEngineInfo(obj);
      });
    } else {
      setEngineInfo(obj);
    }
  }, [isWebGpuSupported]);

  useEffect(() => {
    if (engineInfo === undefined) return;
    const canvas = canvasRef.current;
    if (canvas === null) throw new Error(`canvas 가 없습니다.`);

    const scene = new Scene(engineInfo.engine);

    if (enableAxesViewer) {
      new AxesViewer(scene, 10, undefined, undefined, undefined, undefined, 0.1);
    }

    onLoaded({ engineInfo, canvas, scene });

    return () => {
      scene.meshes.forEach((item) => item.dispose());
      scene.materials.forEach((item) => item.dispose());
      scene.cameras.forEach((item) => item.dispose());
      scene.lights.forEach((item) => item.dispose());
      scene.dispose();
      engineInfo.engine.dispose();
    };
  }, [engineInfo]);

  return <canvas ref={canvasRef} className={className} style={style}></canvas>;
}
