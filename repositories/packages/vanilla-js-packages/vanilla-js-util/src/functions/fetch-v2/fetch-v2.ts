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

    const call = function () {
      if (typeof calledFn === 'function') {
        calledFn(retryCount);
      }
      fetch(url, init)
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

function isCauseObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object') return false;
  return true;
}
