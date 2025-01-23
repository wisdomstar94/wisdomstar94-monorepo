import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type DisplayFormatProps = {
  isoString: string; // ex) '2025-01-23T13:02:28.038Z'
  formatString: string; // https://date-fns.org/v4.1.0/docs/format 참고
  locale?: 'ko'; // locale 을 넘기지 않으면 브라우저가 인식하는 시간대에 맞춰져 날짜 문자열이 반환됩니다. 즉 국내이던 해외이던 어디서 접근하든 반드시 한국 시간을 기준으로 날짜를 나타내야 한다면 'ko' locale 을 넘기면 됩니다.
};

export function displayFormat(props: DisplayFormatProps) {
  const { isoString, formatString } = props;

  const locale = (function () {
    if (props.locale === 'ko') return ko;
    return undefined;
  })();

  return format(isoString, formatString, {
    locale,
  });
}

export type GetDateAgoPeriodProps = {
  days: number; // 0 이면 오늘, 1이면 1일전....
};

export function getDateAgoPeriod(props: GetDateAgoPeriodProps) {
  const { days } = props;

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - days);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() - days);

  return {
    startDateIsoString: startDate.toISOString(),
    endDateIsoString: endDate.toISOString(),
  };
}

export type GetDayKoProps = {
  isoDateString: string;
};

export function getDayKo(props: GetDayKoProps) {
  const { isoDateString } = props;
  const date = new Date(isoDateString);
  const day = date.getDay();
  if (day === 0) return `일`;
  if (day === 1) return `월`;
  if (day === 2) return `화`;
  if (day === 3) return `수`;
  if (day === 4) return `목`;
  if (day === 5) return `금`;
  if (day === 6) return `토`;
  return ``;
}
