/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import io, { Socket } from "socket.io-client";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { SERVER_URL } from "../common/api";


interface SocketContextProps {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
});
interface SocketProviderProps {
  children: ReactNode;
}
export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const {user}=useAuth()
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    
    
    if (user?._id ) {
      const socket = io(SERVER_URL, {
        query: {
          userId: user._id,
        },
        withCredentials: true,
      });
      socket.on("connect", () => {
        console.log("Connected to server🌐🌐🌐");
        setSocket(socket);
      });
      setSocket(socket);

      return () => {
        socket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [ user?._id]);

  const value = {
    socket,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
