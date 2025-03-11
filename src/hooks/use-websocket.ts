import { useEffect, useRef, useState, useCallback } from "react";

export type WebSocketStatus = "connecting" | "open" | "closed" | "error";

/**
 * Custom hook for WebSocket connections with reconnect logic and typed messages
 */
export function useWebSocket<T>(url: string, onMessage?: (data: T) => void) {
  const [status, setStatus] = useState<WebSocketStatus>("closed");
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  // Function to connect to WebSocket
  const connect = useCallback(() => {
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      setStatus("connecting");
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setStatus("open");
        setError(null);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data) as T;
          setData(parsedData);
          if (onMessage) onMessage(parsedData);
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };

      ws.onclose = (event) => {
        setStatus("closed");
        wsRef.current = null;

        // Try to reconnect unless the close was intentional
        if (
          !event.wasClean &&
          reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS
        ) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectAttempts.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (event) => {
        setStatus("error");
        setError(new Error("WebSocket connection error"));
        ws.close();
      };

      wsRef.current = ws;
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err : new Error("Failed to connect to WebSocket")
      );
    }
  }, [url, onMessage]);

  // Function to disconnect WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setStatus("closed");
  }, []);

  // Function to send data through WebSocket
  const send = useCallback(
    (data: any) => {
      if (wsRef.current && status === "open") {
        wsRef.current.send(JSON.stringify(data));
        return true;
      }
      return false;
    },
    [status]
  );

  // Connect on mount or URL change
  useEffect(() => {
    connect();

    // Clean up on unmount
    return () => {
      disconnect();
    };
  }, [url, connect, disconnect]);

  return { status, error, data, send, disconnect, reconnect: connect };
}
