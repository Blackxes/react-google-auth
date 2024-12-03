/**
 * @Author Alexander Bassov Sun Jun 16 2024
 * @Email blackxes.dev@gmail.com
 */

import { createAction, createSlice } from "@reduxjs/toolkit";
import { PromptMomentResponse } from "../services/types";
import { AuthReduxState } from "./types";

export const _SetAuthState = createAction(
  "auth/state/set",
  (state: AuthReduxState) => ({
    payload: { state },
  })
);
export const StartAuthAction = createAction(
  "auth/start",
  (clientId: string, scope?: string) => ({
    payload: {
      clientId,
      scope,
    },
  })
);
export const FinishAuthAction = createAction("auth/finish");
export const HasWalkedAuthMethodsAction = createAction(
  "auth/walked",
  (state: boolean) => ({
    payload: {
      state,
    },
  })
);

export const SetTokenResponseAction = createAction(
  "auth/response/token/set",
  (response: google.accounts.oauth2.TokenResponse) => ({
    payload: {
      response,
    },
  })
);
export const SetCredentialResponseAction = createAction(
  "auth/response/credential/set",
  (response: google.accounts.id.CredentialResponse) => ({
    payload: {
      response,
    },
  })
);
export const ClearCredentialResponseAction = createAction(
  "auth/response/credential/clear"
);
export const SetAuthErrorAction = createAction(
  "auth/error/set",
  (error: google.accounts.oauth2.ClientConfigError) => ({
    payload: {
      error,
    },
  })
);
export const SetPromptMomentAction = createAction(
  "auth/error/prompt_moment/set",
  (moment: PromptMomentResponse) => ({
    payload: {
      moment,
    },
  })
);
export const ClearAuthErrorsAction = createAction("auth/errors/clear");
export const RevokeGrantsAction = createAction("auth/grants/revoke");

const initialState: AuthReduxState = {
  isSigningIn: false,
  accessTokenResponse: null,
  clientError: null,
  credentialResponse: null,
  promptMoment: null,
};

const authState = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(_SetAuthState, (_, { payload }) => {
      return payload.state;
    });
    builder.addCase(StartAuthAction, (state) => {
      state.isSigningIn = true;
    });
    builder.addCase(FinishAuthAction, (state) => {
      state.isSigningIn = false;
    });
    builder.addCase(SetTokenResponseAction, (state, { payload }) => {
      state.accessTokenResponse = payload.response;
    });
    builder.addCase(SetCredentialResponseAction, (state, { payload }) => {
      state.credentialResponse = payload.response;
    });
    builder.addCase(ClearCredentialResponseAction, (state) => {
      state.credentialResponse = null;
    });
    builder.addCase(SetAuthErrorAction, (state, { payload }) => {
      state.clientError = payload.error;
    });
    builder.addCase(SetPromptMomentAction, (state, { payload }) => {
      state.promptMoment = payload.moment;
    });
    builder.addCase(ClearAuthErrorsAction, (state) => {
      state.clientError = null;
      state.promptMoment = null;
    });
  },
});

export const authReducer = authState.reducer as () => AuthReduxState;
export const authActions = authState.actions;
