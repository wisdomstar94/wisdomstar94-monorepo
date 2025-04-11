'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import type { IUseSocketioManager } from './use-socketio-manager.interface';

export function useSocketioManager<T extends string = string>(props: IUseSocketioManager.Props<T>) {
  const [initializeAutoConnects] = useState(props.initializeAutoConnects);
  const socketItemsRef = useRef<Map<string, IUseSocketioManager.SocketItem<T>>>(new Map());
  const socketCallbackItemsRef = useRef<
    Map<
      `${IUseSocketioManager.SocketNamespace<T>}.${IUseSocketioManager.SocketEventName}`,
      IUseSocketioManager.SocketOnListener
    >
  >(new Map());

  function getSocketItemsMap() {
    return socketItemsRef.current;
  }

  function getSocketCallbackItemsMap() {
    return socketCallbackItemsRef.current;
  }

  function connect(connectOptions: IUseSocketioManager.ConnectOptions<T>) {
    if (getSocketItemsMap().has(connectOptions.namespace)) {
      const targetSocket = getSocketItemsMap().get(connectOptions.namespace)?.socket;
      if (targetSocket?.disconnected === true) {
        targetSocket?.connect();
      }
      return;
    }

    const socket = io(`${props.baseUrl}${connectOptions.namespace}`, {
      ...connectOptions.options,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      if (typeof props.onConnected === 'function') {
        props.onConnected(connectOptions.namespace, socket);
      }
    });

    socket.on('disconnect', (reason) => {
      if (typeof props.onDisconnected === 'function') {
        props.onDisconnected(connectOptions.namespace, socket, reason);
      }
      // if (reason === 'io server disconnect') {
      //   disconnect({
      //     namespace: connectOptions.namespace,
      //     removeInConnectItems: true,
      //   });
      // }
    });

    const keys = Array.from(getSocketCallbackItemsMap().keys());
    for (const key of keys) {
      const [namespace, eventName] = key.split('.');
      if (namespace === connectOptions.namespace) {
        const callback = getSocketCallbackItemsMap().get(key);
        if (callback !== undefined) {
          socket.on(eventName, callback);
        }
      }
    }

    if (socket.disconnected) {
      socket.connect();
    }

    getSocketItemsMap().set(connectOptions.namespace, {
      namespace: connectOptions.namespace,
      socket,
      options: connectOptions.options,
    });
  }

  function disconnect(disconnectOptions: IUseSocketioManager.DisconnectOptions<T>) {
    const socketItem = getSocketItemsMap().get(disconnectOptions.namespace);
    if (socketItem === undefined) {
      console.warn(`${disconnectOptions.namespace} 에 해당하는 연결된 소켓이 없는데 disconnect 를 호출하였습니다.`);
      return;
    }
    socketItem.socket.disconnect();
    if (disconnectOptions.removeInConnectItems === true) {
      socketItem.socket.removeAllListeners('connect');
      socketItem.socket.removeAllListeners('disconnect');
      getSocketItemsMap().delete(disconnectOptions.namespace);
    }
  }

  /**
   * @description 컴포넌트가 리렌더링 될 때마다 호출 될 수 있도록 해주세요.
   */
  function setListener(options: IUseSocketioManager.SetListenerOptions<T>) {
    if (['connect', 'disconnect'].includes(options.eventName)) {
      console.error(
        `[useSocketioManager] setListener 에서 connect, disconnect 에 대한 이벤트를 지정하지 마세요. 해당 이벤트는 본 훅 props 의 onConnected, onDisconnected 을 대신 사용하세요.`
      );
      return;
    }

    const socketItem = getSocketItemsMap().get(options.namespace);
    // if (socketItem === undefined) return;

    // const prevCallback = getSocketCallbackItemsMap().get(`${options.namespace}.${options.eventName}`);
    // if (prevCallback !== undefined && socketItem !== undefined) {
    //   socketItem.socket.off(options.eventName, prevCallback);
    //   socketItem.socket.removeListener(options.eventName, prevCallback);
    // }
    socketItem?.socket.removeAllListeners(options.eventName);

    getSocketCallbackItemsMap().set(`${options.namespace}.${options.eventName}`, options.callback);
    socketItem?.socket.on(options.eventName, options.callback);
  }

  function emit(options: IUseSocketioManager.EmitOptions<T>) {
    const socketItem = getSocketItemsMap().get(options.namespace);
    if (socketItem === undefined) {
      console.warn(`${options.namespace} 네임스페이스 정보를 가진 소켓 정보가 없습니다.`);
      return;
    }
    socketItem.socket.emit(options.eventName, options.data);
    return socketItem.socket;
  }

  function allConnectConnectItems() {
    getSocketItemsMap().forEach((socketItem) => {
      if (socketItem.socket.disconnected) {
        socketItem.socket.connect();
      }
    });
  }

  function allDisconnectConnectItems(removeInConnectItems?: boolean) {
    const arr = Array.from(getSocketItemsMap().entries());

    for (const [namespace, socketItem] of arr) {
      if (socketItem.socket.connected) {
        socketItem.socket.disconnect();
      }
      if (removeInConnectItems === true) {
        socketItem.socket.removeAllListeners('connect');
        socketItem.socket.removeAllListeners('disconnect');
        getSocketItemsMap().delete(namespace);
      }
    }
  }

  function isConnected(namespace: T) {
    const target = getSocketItemsMap().get(namespace);
    if (target === undefined) return false;
    return target.socket.connected;
  }

  useEffect(() => {
    getSocketItemsMap().forEach((socketItem) => {
      socketItem.socket.removeAllListeners('connect');
      socketItem.socket.removeAllListeners('disconnect');
      socketItem.socket.on('connect', () => {
        if (typeof props.onConnected === 'function') {
          props.onConnected(socketItem.namespace, socketItem.socket);
        }
      });
      socketItem.socket.on('disconnect', (reason) => {
        if (typeof props.onDisconnected === 'function') {
          props.onDisconnected(socketItem.namespace, socketItem.socket, reason);
        }
      });
    });
  }, [props.onConnected, props.onDisconnected]);

  useEffect(() => {
    initializeAutoConnects?.items.forEach((item) => {
      connect(item);
    });

    return () => {
      getSocketItemsMap().forEach((item) => {
        item.socket.disconnect();
      });
    };
  }, [initializeAutoConnects]);

  return {
    connect,
    disconnect,
    setListener,
    emit,
    isConnected,
    allConnectConnectItems,
    allDisconnectConnectItems,
  };
}
