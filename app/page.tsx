"use client";

import { useEffect, useState } from "react";
import { getAllMotels, getAllThanhToan, deleteMotel } from "./_actions/actions"; // Cập nhật import
import { FullMotel } from "@/types";
import AddMotelModal from "./components/AddMotelModal"; // Import modal thêm phòng trọ
import { ThanhToan } from "@prisma/client";

export default function Page() {
  const [motels, setMotels] = useState<FullMotel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thanhToan, setThanhToan] = useState<ThanhToan[]>([]);
  const [selectedMotels, setSelectedMotels] = useState<Set<string>>(new Set()); // Trạng thái các phòng trọ được chọn
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Trạng thái hộp thoại xác nhận xóa

  useEffect(() => {
    async function fetchMotels() {
      const data = await getAllMotels();
      setMotels(data);
    }
    async function fetchThanhToan() {
      const data = await getAllThanhToan();
      setThanhToan(data);
    }
    fetchThanhToan();
    fetchMotels();
  }, []);

  const filteredMotels = motels.filter((motel) => {
    const query = searchQuery.trim().toLowerCase();
    return (
      motel.name.toLowerCase().includes(query) ||
      motel.phone.toLowerCase().includes(query) ||
      motel.id.toLowerCase().includes(query)
    );
  });

  const toggleSelectMotel = (id: string) => {
    setSelectedMotels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const confirmDelete = async () => {
    if (selectedMotels.size === 0) return;
    for (const id of selectedMotels) {
      await deleteMotel(id);
    }
    setMotels((prevMotels) =>
      prevMotels.filter((motel) => !selectedMotels.has(motel.id))
    );
    setSelectedMotels(new Set());
    setIsDeleteDialogOpen(false); // Đóng hộp thoại sau khi xóa
  };

  const generateMotelId = (existingIds: string[]): string => {
    const maxId = existingIds
      .map((id) => parseInt(id.replace("PT-", ""), 10))
      .filter((num) => !isNaN(num))
      .reduce((max, num) => Math.max(max, num), 0);
    return `PT-${maxId + 1}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh sách thông tin thuê phòng trọ</h1>
      <div className="flex items-center mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition"
        >
          Thêm thông tin thuê trọ
        </button>
        <button
          onClick={() => setIsDeleteDialogOpen(true)} // Mở hộp thoại xác nhận
          className={`ml-2 px-4 py-2 rounded shadow-md transition ${
            selectedMotels.size === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
          disabled={selectedMotels.size === 0}
        >
          Xóa đã chọn
        </button>
        <input
          type="text"
          placeholder="Tìm kiếm phòng trọ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-4 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <table className="table-auto border-collapse border border-gray-300 w-full text-left shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMotels(new Set(motels.map((motel) => motel.id)));
                  } else {
                    setSelectedMotels(new Set());
                  }
                }}
                checked={selectedMotels.size === motels.length && motels.length > 0}
              />
            </th>
            <th className="border border-gray-300 px-4 py-2">Tên người thuê trọ</th>
            <th className="border border-gray-300 px-4 py-2">Số điện thoại</th>
            <th className="border border-gray-300 px-4 py-2">Ngày bắt đầu thuê</th>
            <th className="border border-gray-300 px-4 py-2">Phương thức thanh toán</th>
            <th className="border border-gray-300 px-4 py-2">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {filteredMotels.map((motel) => (
            <tr key={motel.id} className="hover:bg-gray-100 transition">
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedMotels.has(motel.id)}
                  onChange={() => toggleSelectMotel(motel.id)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{motel.name}</td>
              <td className="border border-gray-300 px-4 py-2">{motel.phone}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(motel.startDay).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {motel.ThanhToan?.phuongThuc || "Không có"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{motel.GhiChu || "Không có"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <AddMotelModal
          onClose={() => setIsModalOpen(false)}
          onAdd={(newMotel) => {
            const newId = generateMotelId(motels.map((motel) => motel.id));
            const motelWithId = { ...newMotel, id: newId };
            setMotels((prevMotels) => [motelWithId, ...prevMotels]);
            setIsModalOpen(false);
          }}
          thanhToan={thanhToan}
        />
      )}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">Bạn có chắc chắn muốn xóa các thông tin thuê phòng trọ đã chọn không?</p>
            <ul className="mb-4 list-disc list-inside text-gray-700">
              {[...selectedMotels].map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDeleteDialogOpen(false)} // Đóng hộp thoại
                className="bg-gray-300 text-black px-4 py-2 mr-2 rounded"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete} // Xác nhận xóa
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
