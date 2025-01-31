type FetchV2Init = RequestInit & {
  eConnRefusedRetryOptions?: {
    enable: boolean;
    interval: number;
    maxRetryCount: number;
    called?: (retriedCount: number) => void;
  };
};

export async function fetchV2(url: string, init?: FetchV2Init) {
  return new Promise(function (resolve, reject) {
    const { eConnRefusedRetryOptions } = init ?? {};
    const retryEnable = eConnRefusedRetryOptions?.enable;
    const retryIntervalTime = eConnRefusedRetryOptions?.interval ?? 1500;
    const retryMaxCount = eConnRefusedRetryOptions?.maxRetryCount ?? 5;
    const calledFn = eConnRefusedRetryOptions?.called;
    let retryCount = 0;

    let convertedUrl = url;

    const call = function () {
      if (typeof calledFn === 'function') {
        calledFn(retryCount);
      }

      const instance = createFetch(convertedUrl, init);
      instance
        .call()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err instanceof Error && isCauseObject(err.cause) && err.cause.code === 'ECONNREFUSED') {
            if (retryEnable !== true) {
              reject(err);
              return;
            }
            if (retryCount < retryMaxCount) {
              setTimeout(() => {
                retryCount++;
                convertedUrl = url + `#t=${Date.now()}`; // url 이 첫 요청과 동일하면 react 의 요청 메모이제이션에 의해 계속 error 응답을 받게 됨.
                call();
              }, retryIntervalTime);
              return;
            }
            reject(err);
            return;
          }
          reject(err);
        });
    };

    call();
  });
}

function createFetch(url: string, init?: FetchV2Init) {
  return {
    call: () => {
      return fetch(url, init);
    },
  };
}

function isCauseObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object') return false;
  return true;
}
