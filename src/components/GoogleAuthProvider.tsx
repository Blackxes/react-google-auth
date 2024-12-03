/**
 * @Author Alexander Bassov Tue Jun 11 2024
 * @Email blackxes.dev@gmail.com
 */

import { FunctionComponent, ReactNode, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useLoadGoogleSignInLibrary } from "../hooks/useLoadGoogleClientLibraryScript";
import GoogleSignInService from "../services/google-signin-service";

interface GoogleAuthProviderProps {
  clientId: string;
  scope?: string;
  children: ReactNode;
}

const GoogleAuthProvider: FunctionComponent<GoogleAuthProviderProps> = (
  props
) => {
  const { children, clientId, scope } = props;
  const [initialized, setInitialized] = useState(false);

  useLoadGoogleSignInLibrary({
    onSuccess: () => {
      GoogleSignInService.initialize(clientId, scope);
      setInitialized(true);
    },
  });

  return !initialized ? null : <Fragment children={children} />;
};

export default GoogleAuthProvider;
