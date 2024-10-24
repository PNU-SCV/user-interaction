import asyncio
from fastapi import WebSocket

CHANEL_ROBOT = "robot"

class WebSocketManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = {CHANEL_ROBOT: []}
        self.message_queue = asyncio.Queue()
        self.lock = asyncio.Lock()

    def get_active_connections_cnt(self, group:str):
        if group in self.active_connections:
            return len(self.active_connections[group])
        return 0

    async def connect(self, websocket: WebSocket, group: str):
        if group not in self.active_connections:
            self.active_connections[group] = []
        await websocket.accept()
        async with self.lock:
            self.active_connections[group].append(websocket)

    async def disconnect(self, websocket: WebSocket, group: str):
        async with self.lock:
            self.active_connections[group].remove(websocket)

    async def broadcast(self, message: str, group: str):
        async with self.lock:
            for connection in self.active_connections[group]:
                await connection.send_text(message)