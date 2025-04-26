"use client";

import { useState } from "react";
import { addMotel } from "../_actions/actions";
import { ThanhToan } from "@prisma/client";

export default function AddMotelModal({
  thanhToan,
  onClose,
  onAdd,
}: {
  thanhToan: ThanhToan[];
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd: (newMotel: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    thanhToanId: "",
    startDay: "",
    ghiChu: "", 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMotel({
      ...formData,
      startDay: new Date(formData.startDay),
    }).then((newMotel) => {
      onAdd({
        ...newMotel,
        ThanhToan: thanhToan.find((method) => method.id === formData.thanhToanId),
      });
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Thêm thông tin thuê trọ mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên người thuê"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            value={formData.thanhToanId}
            onChange={(e) =>
              setFormData({ ...formData, thanhToanId: e.target.value })
            }
            className="border p-2 mb-2 w-full"
            required
          >
            <option value="" disabled>
              Chọn phương thức thanh toán
            </option>
            {thanhToan.map((method) => (
              <option key={method.id} value={method.id}>
                {method.phuongThuc}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.startDay}
            onChange={(e) =>
              setFormData({ ...formData, startDay: e.target.value })
            }
            className="border p-2 mb-2 w-full"
            required
          />
          <textarea
            placeholder="Ghi chú"
            value={formData.ghiChu}
            onChange={(e) =>
              setFormData({ ...formData, ghiChu: e.target.value })
            }
            className="border p-2 mb-2 w-full"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 mr-2 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
