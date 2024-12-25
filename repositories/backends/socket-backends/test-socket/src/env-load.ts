import { load } from 'dotenv-mono';
load({
  priorities: {
    [`.env.${process.env.APP_ENV}`]: 100,
  },
  depth: 8,
});
