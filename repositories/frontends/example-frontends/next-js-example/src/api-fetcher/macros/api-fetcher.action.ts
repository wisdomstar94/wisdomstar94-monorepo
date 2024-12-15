'use server';

import { cookies } from 'next/headers';
import setCookie from 'set-cookie-parser';
import { createFetchInstance } from '../interceptors';
import type { ApiFetcherActionReturnType, ApiPayloadRequired, IndividualApiFn } from '../types';

export async function apiFetcherAction<T extends ApiPayloadRequired, R>(
  apiFn: IndividualApiFn<T, R>,
  payload: T
): Promise<ApiFetcherActionReturnType<R>> {
  try {
    const result = await apiFn({
      createFetchInstance,
      payload,
    });

    // api 로 부터 받은 응답헤더에 있는 set-cookie 들을 클라이언트로 전달해주기
    const cookie = await cookies();
    const resCookies = result.response?.headers.getSetCookie();
    console.log('@@@@ resCookies', resCookies);
    for (const c of resCookies ?? []) {
      const cookieInfo = setCookie.parseString(c);
      cookie.set(cookieInfo.name, cookieInfo.value, {
        expires: cookieInfo.expires,
        httpOnly: cookieInfo.httpOnly,
        maxAge: cookieInfo.maxAge,
        secure: cookieInfo.secure,
        sameSite: cookieInfo.sameSite as true | false | 'lax' | 'strict' | 'none' | undefined,
        domain: cookieInfo.domain,
        path: cookieInfo.path,
      });
    }

    return {
      responsePayload: result.responsePayload,
      error: undefined,
    };
  } catch (e) {
    // 서버 액션에서 throw 가 발생하면 throw 데이터가 클라이언트에 의도한 대로 전달되지 않음. 따라서 서버액션에서는 항상 정상 응답을 반환하게 하고 클라이언트에서 error 유무를 체크하여 처리하는 식으로 처리.
    let errorObject: unknown = {};
    if (e instanceof Error) {
      errorObject = {
        name: e.name,
        message: e.message,
      };
    }
    return {
      responsePayload: undefined,
      error: errorObject,
    };
  }
}
