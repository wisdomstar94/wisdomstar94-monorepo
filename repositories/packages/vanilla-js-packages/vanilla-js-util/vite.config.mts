import { getViteFrontendConfig } from "@wisdomstar94/vite-config-library";

const PACKAGE_ROOT = import.meta.dirname;

const config = getViteFrontendConfig({
  root: PACKAGE_ROOT,
});

export default config;
