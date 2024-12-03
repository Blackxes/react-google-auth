/**
 * @Author Alexander Bassov Sun Jun 23 2024
 * @Email blackxes.dev@gmail.com
 */

import SagasRegistry from "../../redux/setup/sagas_registry.ts";
import { StartAuthAction } from "./state/redux.ts";
import { onAuthStart, onLogging, onRevokeGrants } from "./state/sagas.ts";

// Saga registrations
SagasRegistry.registerSaga(onAuthStart);
SagasRegistry.registerSaga(onRevokeGrants);
SagasRegistry.registerSaga(onLogging);

// Initial actions
SagasRegistry.registerInitialAction(StartAuthAction);
