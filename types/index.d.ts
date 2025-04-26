import { Motel, ThanhToan } from "@prisma/client";

type FullMotel= Motel & {
  ThanhToan: ThanhToan | null;
};
export type { FullMotel };