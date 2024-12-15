import { getTailwindConfig } from "@wisdomstar94/example-frontend-library";
import ContainerQueriesPlugin from "@tailwindcss/container-queries";

const config = getTailwindConfig({
  theme: {
    extend: {
      containers: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [ContainerQueriesPlugin],
});
export default config;
