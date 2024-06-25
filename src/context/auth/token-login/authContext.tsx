import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { KeyContextType } from "./types";
import { useGetValidacaoToken } from "../../../pages/public/token-login/hooks/getValidacaoToken";

const KeyContext = createContext<KeyContextType | undefined>(undefined);

export const useKey = (): KeyContextType => {
  const context = useContext(KeyContext);
  if (!context) {
    throw new Error("useKey must be used within a KeyProvider");
  }
  return context;
};

export const KeyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [keyStatus, setKeyStatus] = useState<boolean | null>(() => {
    const cookieKeyStatus = Cookies.get("keyStatus");
    return cookieKeyStatus !== undefined ? cookieKeyStatus === "true" : null;
  });

  const [token, setToken] = useState<string | null>(
    () => Cookies.get("token") || null,
  );

  const updateKeyStatus = (status: boolean | null, newToken: string | null) => {
    setKeyStatus(status);
    setToken(newToken);
    if (
      status !== null &&
      status !== undefined &&
      newToken !== null &&
      newToken !== undefined
    ) {
      Cookies.set("keyStatus", status.toString(), { expires: 7 });
      Cookies.set("token", newToken, { expires: 7 });
    } else {
      Cookies.remove("keyStatus");
      Cookies.remove("token");
    }
  };

  const { data, error } = useGetValidacaoToken(token);

  useEffect(() => {
    setTimeout(() => {
      if (!data.token) {
        updateKeyStatus(null, null);
      }
    }, 5000);
  }, [data, error, token]);

  return (
    <KeyContext.Provider value={{ keyStatus, token, updateKeyStatus }}>
      {children}
    </KeyContext.Provider>
  );
};
