import type { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';

export type SocketNamespace<T extends string = string> = T;
export type SocketEventName = string;

export type SocketOnListener = Parameters<Socket['on']>[1];

export type InitializeAutoConnects<T extends string = string> = {
  items: ConnectOptions<T>[];
};

export type Props<T extends string = string> = {
  baseUrl: string;
  initializeAutoConnects?: InitializeAutoConnects<T>;
  onConnected?: (namespace: SocketNamespace<T>, socket: Socket) => void;
  onDisconnected?: (namespace: SocketNamespace<T>, socket: Socket, reason: Socket.DisconnectReason) => void;
};

export type ConnectOptions<T extends string = string> = {
  namespace: T;
  options?: Partial<ManagerOptions & SocketOptions>;
};

export type DisconnectOptions<T extends string = string> = {
  namespace: T;
  removeInConnectItems?: boolean;
};

export type SocketItem<T extends string = string> = {
  namespace: T;
  socket: Socket;
  options?: Partial<ManagerOptions & SocketOptions>;
};

export type SetListenerOptions<T extends string = string> = {
  namespace: T;
  eventName: SocketEventName;
  callback: SocketOnListener;
};

export type EmitOptions<T extends string = string> = {
  namespace: T;
  eventName: string;
  data: unknown;
};
