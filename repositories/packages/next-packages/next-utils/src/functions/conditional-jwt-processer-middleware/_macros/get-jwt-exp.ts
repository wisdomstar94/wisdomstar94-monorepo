import * as jose from 'jose';
import { isExistValue } from './is-exist-value';

export function getJwtExp(props: { jwtToken: string }) {
  const { jwtToken } = props;
  const payload = jose.decodeJwt(jwtToken);
  const exp = payload.exp;
  if (!isExistValue(exp)) {
    throw new Error(`not exist exp`);
  }
  if (exp.toString().length === 10) {
    return Number(exp) * 1000;
  }
  return Number(exp);
}
