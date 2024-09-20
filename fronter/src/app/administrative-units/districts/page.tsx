"use client";
import React, { useState, useMemo } from "react";
import {
  useGetDistrictsQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  useGetDistrictRegistrasQuery,
  useCreateDistrictRegistraMutation,
  useUpdateDistrictRegistraMutation,
  useDeleteDistrictRegistraMutation,
  useGetSubregionsQuery,
  useGetRegionsQuery,
} from "@/state/api";
import { Edit, Trash, Plus } from "lucide-react";

interface DistrictModel {
  id: number;
  name: string;
  subregionId: number;
  hasCity: boolean;
}

interface SubregionModel {
  id: number;
  name: string;
  regionId: number; // Assuming subregions have a reference to regions
}

interface RegionModel {
  id: number;
  name: string;
}

interface DistrictRegistra {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ninNumber: string;
  isActive: boolean;
}

const DistrictsPage: React.FC = () => {
  const {
    data: districts,
    isLoading,
    isError,
    refetch,
  } = useGetDistrictsQuery();
  const { data: subregions } = useGetSubregionsQuery();
  const { data: regions } = useGetRegionsQuery(); // Fetch regions
  const [createDistrict] = useCreateDistrictMutation();
  const [updateDistrict] = useUpdateDistrictMutation();
  const [deleteDistrict] = useDeleteDistrictMutation();

  const [createDistrictRegistra] = useCreateDistrictRegistraMutation();
  const [updateDistrictRegistra] = useUpdateDistrictRegistraMutation();
  const [deleteDistrictRegistra] = useDeleteDistrictRegistraMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistraModalOpen, setIsRegistraModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<DistrictModel | null>(
    null
  );
  const [newDistrict, setNewDistrict] = useState<Partial<DistrictModel>>({});
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null
  );
  const [selectedRegistra, setSelectedRegistra] =
    useState<DistrictRegistra | null>(null);
  const [newRegistra, setNewRegistra] = useState<Partial<DistrictRegistra>>({});

  const { data: districtRegistras } = useGetDistrictRegistrasQuery(
    selectedDistrictId || 0,
    {
      skip: !selectedDistrictId,
    }
  );

  const subregionMap = useMemo(() => {
    if (!subregions) return new Map<number, string>();
    return new Map(
      subregions.map((subregion: SubregionModel) => [
        subregion.id,
        subregion.name,
      ])
    );
  }, [subregions]);

  const regionMap = useMemo(() => {
    if (!regions) return new Map<number, string>();
    return new Map(
      regions.map((region: RegionModel) => [region.id, region.name])
    );
  }, [regions]);

  const handleAddDistrict = async () => {
    try {
      const districtToCreate = {
        ...newDistrict,
        hasCity: newDistrict.hasCity || false, // Ensure hasCity is always included
      };
      await createDistrict(districtToCreate).unwrap();
      setIsModalOpen(false);
      setNewDistrict({});
      refetch();
    } catch (error) {
      console.error("Error adding district:", error);
    }
  };

  const handleUpdateDistrict = async () => {
    if (editingDistrict) {
      const updatedDistrict = {
        ...editingDistrict,
        ...newDistrict,
        hasCity: newDistrict.hasCity || false, // Ensure hasCity is always included
      };
      try {
        await updateDistrict({
          id: updatedDistrict.id,
          updates: updatedDistrict,
        }).unwrap();
        setIsModalOpen(false);
        setEditingDistrict(null);
        refetch();
      } catch (error) {
        console.error("Error updating district:", error);
      }
    }
  };

  const handleDeleteDistrict = async (districtId: number) => {
    try {
      await deleteDistrict(districtId).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting district:", error);
    }
  };

  const handleAddDistrictRegistra = async () => {
    if (selectedDistrictId && newRegistra) {
      console.log("newRegistra", newRegistra);
      try {
        await createDistrictRegistra({
          districtId: selectedDistrictId,
          registra: newRegistra as DistrictRegistra,
        }).unwrap();
        setIsRegistraModalOpen(false);
        setNewRegistra({});
        setSelectedDistrictId(null);
      } catch (error) {
        console.error("Error adding district registra:", error);
      }
    }
  };

  const handleUpdateDistrictRegistra = async () => {
    if (selectedRegistra && selectedDistrictId) {
      try {
        await updateDistrictRegistra({
          districtId: selectedDistrictId,
          id: selectedRegistra.id,
          updates: newRegistra as DistrictRegistra,
        }).unwrap();
        setIsRegistraModalOpen(false);
        setSelectedRegistra(null);
        setNewRegistra({});
      } catch (error) {
        console.error("Error updating district registra:", error);
      }
    }
  };

  const handleDeleteDistrictRegistra = async (registraId: number) => {
    if (selectedDistrictId) {
      try {
        await deleteDistrictRegistra({
          districtId: selectedDistrictId,
          id: registraId,
        }).unwrap();
        setSelectedRegistra(null);
      } catch (error) {
        console.error("Error deleting district registra:", error);
      }
    }
  };

  const openAddDistrictModal = () => {
    setEditingDistrict(null);
    setNewDistrict({ hasCity: false });
    setIsModalOpen(true);
  };

  const openEditDistrictModal = (district: DistrictModel) => {
    setEditingDistrict(district);
    setNewDistrict(district);
    setIsModalOpen(true);
  };

  const openAddRegistraModal = () => {
    setSelectedRegistra(null);
    setNewRegistra({});
    setIsRegistraModalOpen(true);
  };

  const openEditRegistraModal = (registra: DistrictRegistra) => {
    setSelectedRegistra(registra);
    setNewRegistra(registra);
    setIsRegistraModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading districts</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Districts</h1>
        <button
          onClick={openAddDistrictModal}
          className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New District
        </button>
      </div>

      <table className="min-w-full bg-white mb-8">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Region</th>
            <th className="px-4 py-2">Subregion</th>
            <th className="px-4 py-2">Has City</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {districts?.map((district: DistrictModel) => {
            const subregion = subregions?.find(
              (subregion) => subregion.id === district.subregionId
            );
            const regionName = subregion
              ? regionMap.get(subregion.regionId)
              : "N/A";

            return (
              <tr key={district.id}>
                <td className="border px-4 py-2">{district.id}</td>
                <td className="border px-4 py-2">{district.name}</td>
                <td className="border px-4 py-2">{regionName}</td>
                <td className="border px-4 py-2">
                  {subregion ? subregion.name : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {district.hasCity ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openEditDistrictModal(district)}
                    className="mr-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteDistrict(district.id)}>
                    <Trash size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedDistrictId(district.id);
                      openAddRegistraModal();
                    }}
                    className="ml-2 text-blue-500"
                  >
                    View Registra
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingDistrict ? "Edit District" : "Add District"}
            </h2>
            {/* Form fields for adding/updating a district */}
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={newDistrict.name || ""}
                  onChange={(e) =>
                    setNewDistrict({ ...newDistrict, name: e.target.value })
                  }
                  className="border px-2 py-1 w-full"
                />
              </label>
              <label>
                Subregion:
                <select
                  value={newDistrict.subregionId || ""}
                  onChange={(e) =>
                    setNewDistrict({
                      ...newDistrict,
                      subregionId: Number(e.target.value),
                    })
                  }
                  className="border px-2 py-1 w-full"
                >
                  <option value="">Select Subregion</option>
                  {subregions?.map((subregion) => (
                    <option key={subregion.id} value={subregion.id}>
                      {subregion.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Has City:
                <input
                  type="checkbox"
                  checked={newDistrict.hasCity || false}
                  onChange={(e) =>
                    setNewDistrict({
                      ...newDistrict,
                      hasCity: e.target.checked,
                    })
                  }
                  className="ml-2"
                />
              </label>
            </div>
            <div className="mt-4">
              <button
                onClick={
                  editingDistrict ? handleUpdateDistrict : handleAddDistrict
                }
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isRegistraModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {selectedRegistra
                ? "Edit District Registra"
                : "Add District Registra"}
            </h2>
            <input
              type="text"
              placeholder="First Name"
              value={newRegistra.firstName || ""}
              onChange={(e) =>
                setNewRegistra({
                  ...newRegistra,
                  firstName: e.target.value,
                })
              }
              className="border border-gray-300 p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={newRegistra.lastName || ""}
              onChange={(e) =>
                setNewRegistra({
                  ...newRegistra,
                  lastName: e.target.value,
                })
              }
              className="border border-gray-300 p-2 w-full mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newRegistra.email || ""}
              onChange={(e) =>
                setNewRegistra({
                  ...newRegistra,
                  email: e.target.value,
                })
              }
              className="border border-gray-300 p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newRegistra.phoneNumber || ""}
              onChange={(e) =>
                setNewRegistra({
                  ...newRegistra,
                  phoneNumber: e.target.value,
                })
              }
              className="border border-gray-300 p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="NIN Number"
              value={newRegistra.ninNumber || ""}
              onChange={(e) =>
                setNewRegistra({
                  ...newRegistra,
                  ninNumber: e.target.value,
                })
              }
              className="border border-gray-300 p-2 w-full mb-2"
            />
            <label className="inline-flex items-center mb-4">
              <input
                type="checkbox"
                checked={newRegistra.isActive || false}
                onChange={(e) =>
                  setNewRegistra({
                    ...newRegistra,
                    isActive: e.target.checked,
                  })
                }
                className="form-checkbox"
              />
              <span className="ml-2">Active</span>
            </label>
            <button
              onClick={
                selectedRegistra
                  ? handleUpdateDistrictRegistra
                  : handleAddDistrictRegistra
              }
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {selectedRegistra ? "Update Registra" : "Add Registra"}
            </button>
            <button
              onClick={() => setIsRegistraModalOpen(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictsPage;
