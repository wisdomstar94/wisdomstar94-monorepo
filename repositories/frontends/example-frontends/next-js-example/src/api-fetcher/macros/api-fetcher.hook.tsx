"use client";

import { useEffect, useState } from "react";
import { useApi } from "@wisdomstar94/react-api";
import { useFetcher } from "../interceptors/fetcher.hook";
import { ApiFetcherHookProps, ApiFetcherReturnValue, ApiPayloadRequired, IndividualApiFn } from "../types";

export function useApiFetcher<T extends ApiPayloadRequired, R>(props: ApiFetcherHookProps<T, R>) {
  const [payload, setPayload] = useState<T | undefined>();
  const fetcher = useFetcher();
  // const router = useRouter();

  const api = useApi({
    api: () => {
      const controller = new AbortController();
      return {
        fn: async (): Promise<ApiFetcherReturnValue<R>> => {
          if (props.apiFn !== undefined) {
            const result = await props.apiFn({
              createFetchInstance: fetcher.createFetchInstance,
              payload: payload!,
              controller,
            });
            return result;
          }
          if (props.apiActionFn !== undefined) {
            const result = await props.apiActionFn(payload!);
            if (result.error !== undefined) {
              throw result.error;
            }
            return {
              responsePayload: result.responsePayload ?? null,
            };
          }
          throw `apiFn, apiActionFc 둘다 제공되지 않았습니다.`;
        },
        cancel: () => {
          controller.abort();
        },
      };
    },
    enabledAutoFetch: true,
    autoFetchDependencies: [payload],
    enabled: payload !== undefined,
  });

  useEffect(() => {
    if (api.error === undefined) return;

    console.log("@useApiWrapper.api.error", { error: api.error });
    if (sampleIsErrorResponseBody(api.error)) {
      if (["ER-01", "ER-02"].includes(api.error.errorCode)) {
        return;
      }
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else if (api.error instanceof Error) {
      const name = api.error.name;
      const message = api.error.message;
      alert(`예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요. ${name} : ${message}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api.error]);

  return {
    api,
    payload,
    setPayload,
  };
}

// SAMPLE START
type SampleErrorBody = { errorCode: string; timestamp: number; message: string };
function sampleIsErrorResponseBody(value: unknown): value is SampleErrorBody {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  const keys = Object.keys(value);
  if (!keys.includes("errorCode")) return false;
  if (!keys.includes("timestamp")) return false;
  if (!keys.includes("message")) return false;
  return true;
}
// SAMPLE END
