import type { dapilEnums, dapilParamsToEnum } from "./constants";

export type DapilType = (typeof dapilEnums)[number];
export type DapilParamsType = keyof typeof dapilParamsToEnum;
