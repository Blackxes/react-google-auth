/**
 * @Author Alexander Bassov Tue Jun 18 2024
 * @Email blackxes.dev@gmail.com
 */

import { JwtPayload } from "jwt-decode";
import { call, put, select } from "typed-redux-saga";
import GoogleSignInService from "../services/google-signin-service";
import {
  ImplicitGrantConfig,
  ImplicitGrantResponse,
  OneTabResponse,
  RevokationResponse,
} from "../services/types";
import { decodeJwt } from "./functions";
import {
  ClearCredentialResponseAction,
  HasWalkedAuthMethodsAction,
  SetAuthErrorAction as SetClientErrorAction,
  SetCredentialResponseAction,
  SetPromptMomentAction,
  SetTokenResponseAction,
} from "./redux";
import { getCredential, getTokenResponse } from "./selectors";

export function* walkAuthMethods(clientId: string, scope: string = "") {
  GoogleSignInService.initialize(clientId, scope);

  // Start out with onetab since its the fastest
  const state = yield* call(startOneTabSignInWorker);

  if (state) {
    yield* put(HasWalkedAuthMethodsAction(state));
    return state;
  }

  // const credential = yield* select(getCredential);
  // const info = yield* call(getTokenInfo, credential?.credential ?? "", "id_token" as const);

  // implicit_grant signin with login_hint and prompt "<EMPTY_STRING>" if onetab suceeds
  // and if that doesn't succeed continue with forced prompt "consent" request
  let success: boolean = true;

  if (!(yield* call(startLoginHintedSignInWorker))) {
    if (!(yield* call(startConsentualSignInWorker))) {
      success = false;
    }
  }

  // @todo check scopes

  yield* put(HasWalkedAuthMethodsAction(success));

  return success;
}

/**
 * Starts the onetab signin process
 */
export function* startOneTabSignInWorker() {
  const response: OneTabResponse = yield* call(
    GoogleSignInService.oneTab.bind(GoogleSignInService),
    {
      use_fedcm_for_prompt: true,
    }
  );

  return yield* call(handleOneTabResponseWorker, response);
}

/**
 * Handles the onetab signin response
 * @returns boolean
 */
export function* handleOneTabResponseWorker(response: OneTabResponse) {
  let state: boolean = false;

  if ("credential" in response) {
    yield* put(SetCredentialResponseAction(response));
    state = true;
  }
  //
  else if (
    response.momentType == "dismissed" ||
    response.momentType == "skipped"
  ) {
    yield* put(ClearCredentialResponseAction());
    yield* put(SetPromptMomentAction(response));
    state = false;
  }

  return state;
}

/**
 * Starts the implicit grant signin process using a login hint
 */
export function* startLoginHintedSignInWorker(loginHint?: string) {
  let _loginHint: string | undefined = loginHint;

  if (!_loginHint) {
    const credential = yield* select(getCredential);
    const jwt = yield* call(decodeJwt, credential?.credential ?? "");

    if ("sub" in jwt) {
      _loginHint = (jwt as JwtPayload).sub;
    }
  }

  const response: ImplicitGrantResponse = yield* call(
    GoogleSignInService.implicitGrant.bind(GoogleSignInService),
    {
      login_hint: _loginHint,
      prompt: "",
    } as ImplicitGrantConfig
  );

  return yield* call(handleLoginHintedResponse, response);
}

/**
 * Handles the hinted signin response
 */
export function* handleLoginHintedResponse(response: ImplicitGrantResponse) {
  let state: boolean;

  if ("access_token" in response) {
    yield* put(SetTokenResponseAction(response));
    state = true;
  } //
  else {
    yield* put(SetClientErrorAction(response));

    if (response.type == "popup_closed") {
      yield* put({ type: "auth/cancel" });
    }

    state = false;
  }

  return state;
}

/**
 * Starts the implicit grant signin process with manual consent requirements
 */
export function* startConsentualSignInWorker() {
  const response: Awaited<
    ReturnType<typeof GoogleSignInService.implicitGrant>
  > = yield GoogleSignInService.implicitGrant({
    prompt: "consent",
  });

  return yield* call(handleLoginHintedResponse, response);
}

/**
 * Handles the consentual signin response
 */
export function* handleConsentualResponse(response: ImplicitGrantResponse) {
  let state: boolean;

  if ("access_token" in response) {
    yield* put(SetTokenResponseAction(response));
    state = true;
  } //
  else {
    if (response.type == "popup_closed") {
      yield* put({ type: "auth/cancel" });
    } //
    else {
      yield* put(SetClientErrorAction(response));
    }
    state = false;
  }

  return state;
}

/**
 * Attempts to revoke grants
 * @returns boolean state
 */
export function* revokeGrantsWorker(loginHint?: string) {
  let _loginHint = loginHint;

  if (!_loginHint) {
    const credential = yield* select(getCredential);

    if (!credential) {
      yield* put({ type: "auth/revoke/cancel" });
      return false;
    }

    const jwt = yield* call(decodeJwt, credential?.credential ?? "");

    if ("sub" in jwt) {
      _loginHint = (jwt as JwtPayload).sub;
    }
  }

  if (!_loginHint) {
    const token = yield* select(getTokenResponse);

    if (!token) {
    }
  }

  // If its still undefined cancel
  if (!_loginHint) {
    yield* put({ type: "auth/revokation/cancel" });
    return false;
  }

  const response: RevokationResponse = yield* call(
    GoogleSignInService.revokeGrants,
    _loginHint
  );

  return yield* call(handleRevokeGrantsResponse, response);
}

export function* handleRevokeGrantsResponse(response: RevokationResponse) {
  let state: boolean = response.successful;

  if (!response.successful) {
    yield* put({
      type: "auth/revokation/error/set",
      payload: { error: response },
    });
  }

  return state;
}

/**
 * Checks if all required scopes are granted
 */
export function* checkAllScopesWorker(
  response: google.accounts.oauth2.TokenResponse,
  scopes: string
) {
  return yield* call(GoogleSignInService.checkAllScopes, response, scopes);
}

/**
 * Checks if any required scopes are granted
 */
export function* checkAnyScopesWorker(
  response: google.accounts.oauth2.TokenResponse,
  scopes: string
) {
  return yield* call(GoogleSignInService.checkAnyScopes, response, scopes);
}
