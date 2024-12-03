/**
 * @Author Alexander Bassov Mon Jun 10 2024
 * @Email blackxes.dev@gmail.com
 */

import { useEffect, useState } from "react";

const _scriptSource = "https://accounts.google.com/gsi/client";

interface GoogleSignInLoadingOptions {
  onSuccess?: () => void;
  onError?: (evt: string | Event) => void;
}

export const useLoadGoogleSignInLibrary = (
  options?: GoogleSignInLoadingOptions
) => {
  const [injected, setInjected] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = _scriptSource;
    script.async = true;
    script.defer = true;
    script.onload = async () => {
      setInjected(true);
      options?.onSuccess?.call(this);
    };
    script.onerror = (evt: string | Event) => options?.onError?.call(this, evt);

    const body = document.querySelector("body");
    body?.appendChild(script);

    return () => script.remove();
  }, []);

  return injected;
};
