"use client";
import React, { useState, useMemo } from "react";
import {
  useGetVillagesQuery,
  useGetCellsQuery,
  useCreateVillageMutation,
  useCreateCellMutation,
  useUpdateVillageMutation,
  useUpdateCellMutation,
  useDeleteVillageMutation,
  useDeleteCellMutation,
  useGetRegionsQuery,
  useGetSubregionsQuery,
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetSubcountiesQuery,
  useGetParishesQuery,
  useGetMunicipalitiesQuery,
  useGetDivisionsQuery,
  useGetWardsQuery,
} from "@/state/api";
import { Edit, Trash, Plus } from "lucide-react";

interface VillageCellModel {
  id: number;
  name: string;
  parishId?: number;
  wardId?: number;
  isCell: boolean;
}

const VillagesCells: React.FC = () => {
  const { data: villages, isLoading: isLoadingVillages } = useGetVillagesQuery();
  const { data: cells, isLoading: isLoadingCells } = useGetCellsQuery();
  const { data: regions } = useGetRegionsQuery();
  const { data: subregions } = useGetSubregionsQuery();
  const { data: districts } = useGetDistrictsQuery();
  const { data: constituencies } = useGetConstituenciesQuery();
  const { data: subcounties } = useGetSubcountiesQuery();
  const { data: parishes } = useGetParishesQuery();
  const { data: municipalities } = useGetMunicipalitiesQuery();
  const { data: divisions } = useGetDivisionsQuery();
  const { data: wards } = useGetWardsQuery();
  const [createVillage] = useCreateVillageMutation();
  const [createCell] = useCreateCellMutation();
  const [updateVillage] = useUpdateVillageMutation();
  const [updateCell] = useUpdateCellMutation();
  const [deleteVillage] = useDeleteVillageMutation();
  const [deleteCell] = useDeleteCellMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VillageCellModel | null>(null);
  const [newItem, setNewItem] = useState<Partial<VillageCellModel>>({});

  const villagesCells = useMemo(() => {
    const items: VillageCellModel[] = [
      ...(villages?.map((v) => ({ ...v, isCell: false })) || []),
      ...(cells?.map((c) => ({ ...c, isCell: true })) || []),
    ];
    return items;
  }, [villages, cells]);

  const regionMap = useMemo(() => {
    if (!regions) return new Map<number, any>();
    return new Map(regions.map((region) => [region.id, region]));
  }, [regions]);

  const subregionMap = useMemo(() => {
    if (!subregions) return new Map<number, any>();
    return new Map(subregions.map((subregion) => [subregion.id, subregion]));
  }, [subregions]);

  const districtMap = useMemo(() => {
    if (!districts) return new Map<number, any>();
    return new Map(districts.map((district) => [district.id, district]));
  }, [districts]);

  const constituencyMap = useMemo(() => {
    if (!constituencies) return new Map<number, any>();
    return new Map(
      constituencies.map((constituency) => [constituency.id, constituency])
    );
  }, [constituencies]);

  const subcountyMap = useMemo(() => {
    if (!subcounties) return new Map<number, any>();
    return new Map(subcounties.map((subcounty) => [subcounty.id, subcounty]));
  }, [subcounties]);

  const parishMap = useMemo(() => {
    if (!parishes) return new Map<number, any>();
    return new Map(parishes.map((parish) => [parish.id, parish]));
  }, [parishes]);

  const municipalityMap = useMemo(() => {
    if (!municipalities) return new Map<number, any>();
    return new Map(
      municipalities.map((municipality) => [municipality.id, municipality])
    );
  }, [municipalities]);

  const divisionMap = useMemo(() => {
    if (!divisions) return new Map<number, any>();
    return new Map(divisions.map((division) => [division.id, division]));
  }, [divisions]);

  const wardMap = useMemo(() => {
    if (!wards) return new Map<number, any>();
    return new Map(wards.map((ward) => [ward.id, ward]));
  }, [wards]);

  const handleAddItem = async () => {
    try {
      if (newItem.isCell) {
        await createCell(newItem).unwrap();
      } else {
        await createVillage(newItem).unwrap();
      }
      setIsModalOpen(false);
      setNewItem({});
    } catch (error) {
      console.error("Error adding village/cell:", error);
    }
  };

  const handleUpdateItem = async () => {
    if (editingItem) {
      try {
        if (editingItem.isCell) {
          await updateCell({
            id: editingItem.id,
            updates: newItem,
          }).unwrap();
        } else {
          await updateVillage({
            id: editingItem.id,
            updates: newItem,
          }).unwrap();
        }
        setIsModalOpen(false);
        setEditingItem(null);
      } catch (error) {
        console.error("Error updating village/cell:", error);
      }
    }
  };

  const handleDeleteItem = async (item: VillageCellModel) => {
    try {
      if (item.isCell) {
        await deleteCell(item.id).unwrap();
      } else {
        await deleteVillage(item.id).unwrap();
      }
    } catch (error) {
      console.error("Error deleting village/cell:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Villages and Cells</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingItem(null);
            setNewItem({});
          }}
          className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New
        </button>
      </div>

      {/* Villages Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Villages</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Subregion</th>
              <th className="px-4 py-2">District</th>
              <th className="px-4 py-2">Constituency</th>
              <th className="px-4 py-2">Subcounty</th>
              <th className="px-4 py-2">Parish</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {villagesCells
              .filter((item) => !item.isCell)
              .map((item) => {
                const parish = parishMap.get(item.parishId || 0);
                const subcounty = subcountyMap.get(parish?.subcountyId || 0);
                const constituency = constituencyMap.get(
                  subcounty?.constituencyId || 0
                );
                const district = districtMap.get(constituency?.districtId || 0);
                const subregion = subregionMap.get(district?.subregionId || 0);
                const region = regionMap.get(subregion?.regionId || 0);
                return (
                  <tr key={`v-${item.id}`}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{region?.name}</td>
                    <td className="border px-4 py-2">{subregion?.name}</td>
                    <td className="border px-4 py-2">{district?.name}</td>
                    <td className="border px-4 py-2">{constituency?.name}</td>
                    <td className="border px-4 py-2">{subcounty?.name}</td>
                    <td className="border px-4 py-2">{parish?.name}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setNewItem(item);
                          setIsModalOpen(true);
                        }}
                        className="mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="mr-2"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Cells Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Cells</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Subregion</th>
              <th className="px-4 py-2">District</th>
              <th className="px-4 py-2">Municipality</th>
              <th className="px-4 py-2">Division</th>
              <th className="px-4 py-2">Ward</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {villagesCells
              .filter((item) => item.isCell)
              .map((item) => {
                const ward = wardMap.get(item.wardId || 0);
                const division = divisionMap.get(ward?.divisionId || 0);
                const municipality = municipalityMap.get(
                  division?.municipalityId || 0
                );
                const district = districtMap.get(municipality?.districtId || 0);
                const subregion = subregionMap.get(district?.subregionId || 0);
                const region = regionMap.get(subregion?.regionId || 0);
                return (
                  <tr key={`c-${item.id}`}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{region?.name}</td>
                    <td className="border px-4 py-2">{subregion?.name}</td>
                    <td className="border px-4 py-2">{district?.name}</td>
                    <td className="border px-4 py-2">{municipality?.name}</td>
                    <td className="border px-4 py-2">{division?.name}</td>
                    <td className="border px-4 py-2">{ward?.name}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setNewItem(item);
                          setIsModalOpen(true);
                        }}
                        className="mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="mr-2"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Village/Cell Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit" : "Add"} {editingItem?.isCell ? "Cell" : "Village"}
            </h2>
            <div>
              <label className="block mb-2">
                Type:
                <select
                  value={newItem.isCell ? "cell" : "village"}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      isCell: e.target.value === "cell",
                    })
                  }
                  className="border px-2 py-1 w-full mt-1"
                >
                  <option value="village">Village</option>
                  <option value="cell">Cell</option>
                </select>
              </label>
              <label className="block mb-2">
                Name:
                <input
                  type="text"
                  value={newItem.name || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="border px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                {newItem.isCell ? "Ward" : "Parish"}:
                <select
                  value={
                    newItem.isCell
                      ? newItem.wardId
                      : newItem.parishId || ""
                  }
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      [newItem.isCell ? "wardId" : "parishId"]: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="border px-2 py-1 w-full mt-1"
                >
                  <option value="">
                    Select {newItem.isCell ? "Ward" : "Parish"}
                  </option>
                  {newItem.isCell
                    ? wards?.map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))
                    : parishes?.map((parish) => (
                        <option key={parish.id} value={parish.id}>
                          {parish.name}
                        </option>
                      ))}
                </select>
              </label>
            </div>
            <div className="mt-4">
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
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
    </div>
  );
};

export default VillagesCells;