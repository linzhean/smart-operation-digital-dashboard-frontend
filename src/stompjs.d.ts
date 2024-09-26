declare module 'stompjs' {
    export function over(socket: any): any;
    export class Client {
      constructor(options?: any);
      connect(headers: any, connectCallback: () => void, errorCallback?: () => void): void;
      disconnect(disconnectCallback: () => void): void;
      subscribe(destination: string, callback: (message: any) => void, headers?: any): any;
      send(destination: string, headers?: any, body?: string): void;
    }
  }
  