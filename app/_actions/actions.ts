"use server";

import { prisma } from "@/lib/prisma";
import { FullMotel } from "@/types";
import { Motel, ThanhToan } from "@prisma/client";

export async function getAllMotels(): Promise<FullMotel[]> {
  const motelFilter = await prisma.motel.findMany({
    include: {
      ThanhToan: true,
    },
  });
  return motelFilter;
}

async function updateMotel(
  id: string,
  data: { name?: string; address?: string; phone?: string; thanhToanId?: string }
): Promise<Motel | null> {
  return await prisma.motel.update({
    where: { id },
    data: {
      ...data,
      ThanhToan: data.thanhToanId ? { connect: { id: data.thanhToanId } } : undefined,
    },
  });
}
async function deleteMotel(id: string): Promise<void> {
  await prisma.motel.delete({ where: { id } });
}

export async function addMotel(data: {
  name: string;
  phone: string;
  startDay: Date;
  ghiChu: string;
  thanhToanId: string; // Keep this in the function signature for input
}): Promise<Motel> {
  return await prisma.motel.create({
    data: {
      name: data.name,
      phone: data.phone,
      startDay: data.startDay,
      GhiChu: data.ghiChu,
      ThanhToan: { connect: { id: data.thanhToanId } }, // Use ThanhToan for connection
    },
  });
}
async function getAllThanhToan(): Promise<ThanhToan[]> {
  return await prisma.thanhToan.findMany();
}

export { updateMotel, deleteMotel, getAllThanhToan };