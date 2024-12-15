import { CommonPageLayout } from "@wisdomstar94/example-next-library";
import { Viewport } from "next";
import { ReactNode } from "react";

export const viewport: Viewport = {
  userScalable: false,
};

export default function Layout(props: { children: ReactNode }) {
  return <CommonPageLayout>{props.children}</CommonPageLayout>;
}
