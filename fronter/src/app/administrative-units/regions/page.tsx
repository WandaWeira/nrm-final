"use client";

import React, { useState } from "react";
import {
  useGetRegionsQuery,
  useAddRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
} from "@/state/api";
import { Edit, Trash, Plus, AlertCircle, CheckCircle, X } from "lucide-react";

interface UnitModel {
  id: number;
  name: string;
}

const RegionsPage: React.FC = () => {
  const { data: regions, isLoading, isError, refetch } = useGetRegionsQuery();
  const [addRegion] = useAddRegionMutation();
  const [updateRegion] = useUpdateRegionMutation();
  const [deleteRegion] = useDeleteRegionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<UnitModel | null>(null);
  const [newRegion, setNewRegion] = useState<Partial<UnitModel>>({});

  const [operationResult, setOperationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleAddRegion = async () => {
    try {
      await addRegion(newRegion as UnitModel).unwrap();
      setIsModalOpen(false);
      setNewRegion({});
      refetch();
      setOperationResult({
        success: true,
        message: "Region added successfully",
      });
    } catch (error: any) {
      setOperationResult({
        success: false,
        message: error.data.error,
      });
    }
  };

  const handleUpdateRegion = async () => {
    if (editingRegion) {
      const updatedRegion = { ...editingRegion, ...newRegion };

      if (!updatedRegion.id) {
        setOperationResult({
          success: false,
          message: "Region ID is missing. Cannot update.",
        });
        return;
      }

      try {
        await updateRegion(updatedRegion).unwrap();
        setIsModalOpen(false);
        setEditingRegion(null);
        refetch();
        setOperationResult({
          success: true,
          message: "Region updated successfully",
        });
      } catch (error: any) {
        setOperationResult({
          success: false,
          message: error.data.error,
        });
      }
    }
  };

  const handleDeleteRegion = async (regionId: number) => {
    try {
      await deleteRegion(regionId).unwrap();
      refetch();
      setOperationResult({
        success: true,
        message: "Region deleted successfully",
      });
    } catch (error: any) {
      setOperationResult({
        success: false,
        message: error.data.error,
      });
    }
  };

  const openAddModal = () => {
    setEditingRegion(null);
    setNewRegion({});
    setIsModalOpen(true);
  };

  const openEditModal = (region: UnitModel) => {
    setEditingRegion(region);
    setNewRegion(region);
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading regions</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Regions</h1>
        <button
          onClick={openAddModal}
          className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Region
        </button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {regions?.map((region: UnitModel) => (
            <tr key={region.id}>
              <td className="border px-4 py-2">{region.id}</td>
              <td className="border px-4 py-2">{region.name}</td>
              <td className="border px-4 py-2">
                <button onClick={() => openEditModal(region)} className="mr-2">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDeleteRegion(region.id)}>
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 shadow-xl">
          <div className="bg-white p-8 rounded w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingRegion ? "Edit Region" : "Add New Region"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingRegion ? handleUpdateRegion() : handleAddRegion();
              }}
            >
              <input
                placeholder="Region Name"
                value={newRegion.name || ""}
                onChange={(e) =>
                  setNewRegion({ ...newRegion, name: e.target.value })
                }
                className="mb-4 w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-4 px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-yellow-500 text-white rounded"
                >
                  {editingRegion ? "Update" : "Add"} Region
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {operationResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-2xl relative">
            <div
              className={`flex items-center mb-4 ${
                operationResult.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {operationResult.success ? (
                <CheckCircle className="mr-2 h-6 w-6" />
              ) : (
                <AlertCircle className="mr-2 h-6 w-6" />
              )}
              <h2 className="text-2xl font-bold">
                {operationResult.success ? "Success" : "Error"}
              </h2>
            </div>
            <p className="text-lg mb-6">{operationResult.message}</p>
            <button
              onClick={() => setOperationResult(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
            <button
              onClick={() => setOperationResult(null)}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-blue-950 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionsPage;
