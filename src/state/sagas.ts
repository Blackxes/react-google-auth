/**
 * @Author Alexander Bassov Sun Jun 16 2024
 * @Email blackxes.dev@gmail.com
 */

import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { call, fork, put, take, takeEvery, takeLatest } from "typed-redux-saga";
import {
  ClearAuthErrorsAction,
  FinishAuthAction,
  RevokeGrantsAction,
  StartAuthAction,
} from "./redux";
import { revokeGrantsWorker, walkAuthMethods } from "./workers";

/**
 * Starts the auth process
 */
export function* onAuthStart() {
  yield* takeLatest<ReturnType<typeof StartAuthAction>>(
    "auth/start",
    function* ({ payload }) {
      yield* put(ClearAuthErrorsAction());

      yield* fork(walkAuthMethods, payload.clientId, payload.scope);

      const reason = yield* take(["auth/cancel", "auth/walked"]);

      if (reason.type == "auth/walked") {
        yield* put(ClearAuthErrorsAction());
      }

      yield* put(FinishAuthAction());
    }
  );
}

/**
 * Starts the revokation of grants process
 */
export function* onRevokeGrants() {
  yield* takeLatest<ReturnType<typeof RevokeGrantsAction>>(
    "auth/grants/revoke",
    function* () {
      yield* call(revokeGrantsWorker);
    }
  );
}

/**
 * Logger
 */
export function* onLogging() {
  yield* takeEvery<ReturnType<ActionCreatorWithPayload<any>>>(
    "*",
    function* (action) {
      console.log(action.type, action.payload);
    }
  );
}
