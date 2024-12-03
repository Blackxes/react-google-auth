/**
 * @Author Alexander Bassov Thu Jun 20 2024
 * @Email blackxes.dev@gmail.com
 */

import { AuthReduxState } from "./types";

type StateWithAuth = {
  auth: AuthReduxState;
};

export const getCredential = (state: StateWithAuth) =>
  state.auth.credentialResponse;
export const getTokenResponse = (state: StateWithAuth) =>
  state.auth.accessTokenResponse;
export const hasAuthErrors = (state: StateWithAuth) =>
  state.auth.clientError != undefined || state.auth.promptMoment != undefined;
export const getClientError = (state: StateWithAuth) => state.auth.clientError;
export const getPromptMoment = (state: StateWithAuth) =>
  state.auth.promptMoment;
