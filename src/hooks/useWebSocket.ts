import { useEffect, useRef } from 'react';

interface WebSocketControl {
  ws: WebSocket;
  retryCnt: number;
}

export const useWebSocket = (
  onmessage: (event: MessageEvent) => void,
  setConnected: () => void,
  setDisconnected: () => void,
) => {
  const wscRef = useRef<WebSocketControl | null>(null);
  // const wsUrl = 'ws://192.168.0.5:8000/real-time-state';
  const wsUrl = 'ws://localhost:8000/real-time-state';

  useEffect(() => {
    let isUnmounting = false;

    const wsc: WebSocketControl = {
      ws: new WebSocket(wsUrl),
      retryCnt: 0,
    };

    const setupWebSocket = (wsc, onmessage) => {
      const ws = wsc.ws;

      ws.onopen = () => {
        wsc.retryCnt = 0;
        console.log('웹소켓 연결됨');
        setConnected();
      };

      ws.onmessage = onmessage;

      ws.onclose = () => {
        setDisconnected();
        if (!isUnmounting && wsc.retryCnt < 5) {
          setTimeout(() => {
            console.log('WebSocket 재연결 시도');
            wsc.retryCnt += 1;
            wsc.ws = new WebSocket(wsUrl);
            setupWebSocket(wsc, onmessage);
          }, 3000);
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

  return { sendMsg };
};
