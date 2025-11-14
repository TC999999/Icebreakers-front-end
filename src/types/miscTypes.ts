import type { ToastContentProps } from "react-toastify";

export type DynamicObject = {
  [key: string]: any;
};

export type FormData = {
  [key: string]: string | number[];
};

export type titleAndDesc = {
  title: string;
  description: string;
};

export type ToastProps = Partial<ToastContentProps> & {
  from: string;
  message: string;
};
