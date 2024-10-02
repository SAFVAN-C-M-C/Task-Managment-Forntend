/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/AuthContext.tsx
import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { ILogin, IRegisterUser, IUser } from "../types";
import { config, SERVER_URL } from "../common/api";
import toast from "react-hot-toast";

interface AuthContextType {
  user: IUser | null;
  error: any | null;
  updateError: () => void;
  login: (data: ILogin) => Promise<void>;
  register: (data: IRegisterUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  
  const [user, setUser] = useState<IUser | null>(null);
  const [error, setError] = useState<any | null>(null);
  const login = async (data: ILogin) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/login`,
        data,
        config
      );
      console.log(response.data);

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.data);
        toast.success("Login successfull");
        setError(null);
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(error.response.data.message || "Server error occurred");
        // toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Request was made but no response
        setError("No response from the server. Please try again later.");
        // toast.error("No response from the server.");
      } else {
        // Something else happened while setting up the request
        setError("An unexpected error occurred");
        // toast.error("An unexpected error occurred");
      }
      console.log(error);
    }
  };
  const updateError = () => {
    setError(null);
  };
  const register = async (data: IRegisterUser) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/register`,
        data,
        config
      );
      console.log(response.data);

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.data);
        toast.success("Login successfull");
        setError(null);
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(error.response.data.message || "Server error occurred");
        // toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Request was made but no response
        setError("No response from the server. Please try again later.");
        // toast.error("No response from the server.");
      } else {
        // Something else happened while setting up the request
        setError("An unexpected error occurred");
        // toast.error("An unexpected error occurred");
      }
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.delete(`${SERVER_URL}/api/logout`, config);

      if (response.status === 204) {
        setUser(null);
        toast.success("Successfully Logout");
        setError(null);
      } else {
        setError(response.data);
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(error.response.data.message || "Server error occurred");
        // toast.error(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Request was made but no response
        setError("No response from the server. Please try again later.");
        // toast.error("No response from the server.");
      } else {
        // Something else happened while setting up the request
        setError("An unexpected error occurred");
        // toast.error("An unexpected error occurred");
      }
      console.log(error);
    }
  };
  const getUser = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/user`, config);
      console.log(res);
      setUser(res.data.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, error, updateError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
