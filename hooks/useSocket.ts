'use client'
import { useEffect, useState } from 'react';
export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    useEffect(() => {
        const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
        const ws = new WebSocket("ws://localhost:8080");
        ws.onopen = () => {
            setSocket(ws);
        }
        ws.onclose = () => {
            setSocket(null);
        }
        return () => {
            ws.close();
        }
    }, []);
    return socket;
}