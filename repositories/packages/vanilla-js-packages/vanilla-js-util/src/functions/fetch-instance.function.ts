export type RequestBeforeReturnParams = {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

export type ResponseAfterReturnParamsRetry = {
  type: 'retry';
  requestParams: FetchInstanceParams;
};
export type ResponseAfterReturnParamsPass = {
  type: 'pass';
};
// export type ResponseAfterReturnParamsTransform = {
//   type: 'transform';
//   data: unknown;
// };

export type ResponseAfterReturnParams = ResponseAfterReturnParamsRetry | ResponseAfterReturnParamsPass | null | undefined;
// ResponseAfterReturnParamsTransform;

export type FetchInstanceParams = {
  url: string;
  requestInit: RequestInit;
  onRequestBefore?: () => Promise<RequestBeforeReturnParams>; // 서버 사이드 또는 클라이언트 사이드에서 요청 전 특정 조작이 필요할 경우 사용
  onResponseAfter?: (url: string, requestInit: RequestInit, res: Response) => Promise<ResponseAfterReturnParams>;
};

export function fetchInstance(params: FetchInstanceParams) {
  const { url, requestInit, onRequestBefore, onResponseAfter } = params;

  const call = async <T = Response>() => {
    const requestInitClone = { ...requestInit };

    if (typeof onRequestBefore === 'function') {
      const onRequestBeforeParams = await onRequestBefore();
      // 요청 전 헤더 조작
      if (onRequestBeforeParams.headers !== undefined) {
        const headersClone = new Headers(requestInitClone.headers);
        for (const [key, value] of Object.entries(onRequestBeforeParams.headers)) {
          headersClone.append(key, value);
        }
        requestInitClone.headers = headersClone;
      }
      // 요청 전 credentials 조작
      if (onRequestBeforeParams.credentials !== undefined) {
        requestInitClone.credentials = onRequestBeforeParams.credentials;
      }
    }

    const result = await fetch(url, requestInitClone).then(async (res) => {
      if (typeof onResponseAfter !== 'function') {
        return res;
      }
      const result = await onResponseAfter(url, requestInitClone, res);
      if (result === null || result === undefined) return res;

      if (result.type === 'pass') {
        return res;
      }

      // if (result.type === 'transform') {
      //   return result.data;
      // }

      const { requestParams } = result;
      const requestInitClone2 = { ...requestParams.requestInit };

      if (typeof requestParams.onRequestBefore === 'function') {
        const onRequestBeforeParams2 = await requestParams.onRequestBefore();
        // 요청 전 헤더 조작
        if (onRequestBeforeParams2.headers !== undefined) {
          const headersClone = new Headers(requestInitClone2.headers);
          for (const [key, value] of Object.entries(onRequestBeforeParams2.headers)) {
            headersClone.append(key, value);
          }
          requestInitClone2.headers = headersClone;
        }
        // 요청 전 credentials 조작
        if (onRequestBeforeParams2.credentials !== undefined) {
          requestInitClone2.credentials = onRequestBeforeParams2.credentials;
        }
      }

      return await fetch(requestParams.url, requestInitClone2).then(async (retryRes) => {
        if (typeof requestParams.onResponseAfter !== 'function') {
          return retryRes;
        }

        await onResponseAfter(url, requestInitClone, retryRes);
        return retryRes;
      });
    });

    return result as T;
  };

  return {
    call,
  };
}

// plugin
export type OnResponseAfterAuthProps = {
  url: string;
  requestInit: RequestInit;
  refreshApiUrl: string;
  res: Response;
  onRefreshFailed: () => void;
  onRefreshTokenExipred: () => void;
  isAccessTokenExpired: (res: Response) => Promise<boolean>;
  isRefreshTokenExpired: (res: Response) => Promise<boolean>;
};

export async function onResponseAfterAuth(props: OnResponseAfterAuthProps): Promise<ResponseAfterReturnParams> {
  const { url, refreshApiUrl, requestInit, res, onRefreshFailed, onRefreshTokenExipred, isAccessTokenExpired, isRefreshTokenExpired } =
    props;

  // 에러 응답이 아니면
  if (!(res.status >= 400 && res.status <= 500)) {
    return {
      type: 'pass',
    };
  }

  if (await isRefreshTokenExpired(res)) {
    onRefreshTokenExipred();
    const body = await res.clone().json();
    throw body;
  }

  // access token 이 만료되었다는 응답이 아니면
  if (!(await isAccessTokenExpired(res))) {
    const body = await res.clone().json();
    throw body;
  }

  // 즉시 갱신 시도
  const refreshRes = await fetch(refreshApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  // 갱신 실패
  if (refreshRes.status >= 400 && refreshRes.status <= 500) {
    onRefreshFailed();
    const refreshBody = await refreshRes.json();
    throw refreshBody;
  }

  // 갱신 성공
  // 원래 호출하려던 요청 재시도
  return {
    type: 'retry' as const,
    requestParams: {
      // url: url + '&timestamp=' + new Date().getTime(),
      url,
      requestInit,
      onResponseAfter: async (url, requestInit, res) => {
        const retryBody = await res.clone().json();

        // 에러 응답인가?
        if (res.status >= 400 && res.status <= 500) {
          throw retryBody;
        }

        return {
          type: 'pass' as const,
        };
      },
    },
  };
}

export type FetchInstance = ReturnType<typeof fetchInstance>;
export type CreateFetchInstanceFn = (url: string, requestInit: RequestInit) => Promise<FetchInstance>;
