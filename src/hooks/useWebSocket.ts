import { useEffect, useRef } from 'react';

interface WebSocketControl {
  ws: WebSocket;
  retryCnt: number;
  isConnected: boolean;
}

export const useWebSocket = (onmessage) => {
  const wscRef = useRef<WebSocketControl | null>(null);

  useEffect(() => {
    let isUnmounting = false;

    const wsc: WebSocketControl = {
      ws: new WebSocket('ws://localhost:8000/real-time-state'),
      retryCnt: 0,
      isConnected: false,
    };

    const setupWebSocket = (wsc, onmessage) => {
      const ws = wsc.ws;

      ws.onopen = () => {
        wsc.retryCnt = 0;
        console.log('웹소켓 연결됨');
        wsc.isConnected = true;
      };

      ws.onmessage = onmessage;

      ws.onclose = () => {
        wsc.isConnected = false;
        if (!isUnmounting && wsc.retryCnt < 5) {
          setTimeout(() => {
            console.log('WebSocket 재연결 시도');
            wsc.retryCnt += 1;
            wsc.ws = new WebSocket('ws://localhost:8000/real-time-state');
            setupWebSocket(wsc, onmessage);
          }, 1000);
        }
      };

      ws.onerror = (error) => {
        console.error('??', error);
      };
    };

    setupWebSocket(wsc, onmessage);
    wscRef.current = wsc;

    return () => {
      isUnmounting = true;
      if (wscRef.current?.ws) {
        wscRef.current?.ws.close();
      }
    };
  }, []);

  const sendMsg = (msg: string) => {
    const wsc = wscRef.current?.ws;
    if (wsc && wsc.readyState === WebSocket.OPEN) {
      wsc.send(msg);
    }
  };

  return { isConnected: wscRef.current?.isConnected, sendMsg };
};
