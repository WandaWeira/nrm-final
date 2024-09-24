"use client";
import React, { useState, useMemo } from "react";
import {
  useGetParishesQuery,
  useGetWardsQuery,
  useCreateParishMutation,
  useCreateWardMutation,
  useUpdateParishMutation,
  useUpdateWardMutation,
  useDeleteParishMutation,
  useDeleteWardMutation,
  useGetRegionsQuery,
  useGetSubregionsQuery,
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetSubcountiesQuery,
  useGetMunicipalitiesQuery,
  useGetDivisionsQuery,
  useGetParishRegistrarsQuery,
  useGetWardRegistrarsQuery,
  useCreateParishRegistrarMutation,
  useCreateWardRegistrarMutation,
  useUpdateParishRegistrarMutation,
  useUpdateWardRegistrarMutation,
  useDeleteParishRegistrarMutation,
  useDeleteWardRegistrarMutation,
} from "@/state/api";
import { Edit, Trash, Plus } from "lucide-react";

interface ParishWardModel {
  id: number;
  name: string;
  subcountyId?: number;
  divisionId?: number;
  isWard: boolean;
}

interface Registra {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ninNumber: string;
  isActive: boolean;
}

const ParishesWards: React.FC = () => {
  const { data: parishes, isLoading: isLoadingParishes } =
    useGetParishesQuery();
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery();
  const { data: regions } = useGetRegionsQuery();
  const { data: subregions } = useGetSubregionsQuery();
  const { data: districts } = useGetDistrictsQuery();
  const { data: constituencies } = useGetConstituenciesQuery();
  const { data: subcounties } = useGetSubcountiesQuery();
  const { data: municipalities } = useGetMunicipalitiesQuery();
  const { data: divisions } = useGetDivisionsQuery();
  const [createParish] = useCreateParishMutation();
  const [createWard] = useCreateWardMutation();
  const [updateParish] = useUpdateParishMutation();
  const [updateWard] = useUpdateWardMutation();
  const [deleteParish] = useDeleteParishMutation();
  const [deleteWard] = useDeleteWardMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParishWardModel | null>(null);
  const [newItem, setNewItem] = useState<Partial<ParishWardModel>>({});
  const [selectedParishId, setSelectedParishId] = useState<number | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [showParishRegistras, setShowParishRegistras] = useState(false);
  const [showWardRegistras, setShowWardRegistras] = useState(false);

  const { data: parishRegistras, refetch: refetchParishRegistras } =
    useGetParishRegistrarsQuery(selectedParishId || 0, {
      skip: !selectedParishId,
    });

  const { data: wardRegistras, refetch: refetchWardRegistras } =
    useGetWardRegistrarsQuery(selectedWardId || 0, {
      skip: !selectedWardId,
    });

  const [isRegistraModalOpen, setIsRegistraModalOpen] = useState(false);
  const [newRegistra, setNewRegistra] = useState<Partial<Registra>>({});
  const [editingRegistra, setEditingRegistra] = useState<Registra | null>(null);

  const [createParishRegistra] = useCreateParishRegistrarMutation();
  const [createWardRegistra] = useCreateWardRegistrarMutation();
  const [updateParishRegistra] = useUpdateParishRegistrarMutation();
  const [updateWardRegistra] = useUpdateWardRegistrarMutation();
  const [deleteParishRegistra] = useDeleteParishRegistrarMutation();
  const [deleteWardRegistra] = useDeleteWardRegistrarMutation();

  const parishesWards = useMemo(() => {
    const items: ParishWardModel[] = [
      ...(parishes?.map((p) => ({ ...p, isWard: false })) || []),
      ...(wards?.map((w) => ({ ...w, isWard: true })) || []),
    ];
    return items;
  }, [parishes, wards]);

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

  const handleAddItem = async () => {
    try {
      if (newItem.isWard) {
        await createWard(newItem).unwrap();
      } else {
        await createParish(newItem).unwrap();
      }
      setIsModalOpen(false);
      setNewItem({});
    } catch (error) {
      console.error("Error adding parish/ward:", error);
    }
  };

  const handleUpdateItem = async () => {
    if (editingItem) {
      try {
        if (editingItem.isWard) {
          await updateWard({
            id: editingItem.id,
            updates: newItem,
          }).unwrap();
        } else {
          await updateParish({
            id: editingItem.id,
            updates: newItem,
          }).unwrap();
        }
        setIsModalOpen(false);
        setEditingItem(null);
      } catch (error) {
        console.error("Error updating parish/ward:", error);
      }
    }
  };

  const handleDeleteItem = async (item: ParishWardModel) => {
    try {
      if (item.isWard) {
        await deleteWard(item.id).unwrap();
      } else {
        await deleteParish(item.id).unwrap();
      }
    } catch (error) {
      console.error("Error deleting parish/ward:", error);
    }
  };

  const handleViewParishRegistras = (itemId: number) => {
    setSelectedParishId(itemId);
    setShowParishRegistras(true);
    setShowWardRegistras(false);
    refetchParishRegistras();
  };

  const handleViewWardRegistras = (itemId: number) => {
    setSelectedWardId(itemId);
    setShowWardRegistras(true);
    setShowParishRegistras(false);
    refetchWardRegistras();
  };

  const handleAddParishRegistra = async () => {
    if (!selectedParishId) return;
    try {
      await createParishRegistra({
        parishId: selectedParishId,
        registrar: newRegistra,
      }).unwrap();
      setIsRegistraModalOpen(false);
      setNewRegistra({});
      if (selectedParishId) {
        refetchParishRegistras();
      }
    } catch (error) {
      console.error("Error adding parish registra:", error);
    }
  };

  const handleAddWardRegistra = async () => {
    if (!selectedWardId) return;
    console.log(selectedWardId,newRegistra)
    try {
      await createWardRegistra({
        wardId: selectedWardId,
        registrar: newRegistra,
      }).unwrap();
      setIsRegistraModalOpen(false);
      setNewRegistra({});
      if (selectedWardId) {
        refetchWardRegistras();
      }
    } catch (error) {
      console.error("Error adding ward registra:", error);
    }
  };

  const handleUpdateParishRegistra = async () => {
    if (!selectedParishId || !editingRegistra) return;
    try {
      await updateParishRegistra({
        parishId: selectedParishId,
        id: editingRegistra.id,
        updates: editingRegistra,
      }).unwrap();
      setIsRegistraModalOpen(false);
      setEditingRegistra(null);
      if (selectedParishId) {
        refetchParishRegistras();
      }
    } catch (error) {
      console.error("Error updating parish registra:", error);
    }
  };

  const handleUpdateWardRegistra = async () => {
    if (!selectedWardId || !editingRegistra) return;
    try {
      await updateWardRegistra({
        wardId: selectedWardId,
        id: editingRegistra.id,
        updates: editingRegistra,
      }).unwrap();
      setIsRegistraModalOpen(false);
      setEditingRegistra(null);
      if (selectedWardId) {
        refetchWardRegistras();
      }
    } catch (error) {
      console.error("Error updating ward registra:", error);
    }
  };

  const handleDeleteParishRegistra = async (registra: Registra) => {
    if (!selectedParishId) return;
    try {
      await deleteParishRegistra({
        parishId: selectedParishId,
        id: registra.id,
      }).unwrap();
      if (selectedParishId) {
        refetchParishRegistras();
      }
    } catch (error) {
      console.error("Error deleting parish registra:", error);
    }
  };

  const handleDeleteWardRegistra = async (registra: Registra) => {
    if (!selectedWardId) return;
    try {
      await deleteWardRegistra({
        wardId: selectedWardId,
        id: registra.id,
      }).unwrap();
      if (selectedWardId) {
        refetchWardRegistras();
      }
    } catch (error) {
      console.error("Error deleting ward registra:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Parishes and Wards</h1>
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

      {/* Parishes Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Parishes</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Subregion</th>
              <th className="px-4 py-2">District</th>
              <th className="px-4 py-2">Constituency</th>
              <th className="px-4 py-2">Subcounty</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parishesWards
              .filter((item) => !item.isWard)
              .map((item) => {
                const subcounty = subcountyMap.get(item.subcountyId || 0);
                const constituency = constituencyMap.get(
                  subcounty?.constituencyId || 0
                );
                const district = districtMap.get(constituency?.districtId || 0);
                const subregion = subregionMap.get(district?.subregionId || 0);
                const region = regionMap.get(subregion?.regionId || 0);
                return (
                  <tr key={`p-${item.id}`}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{region?.name}</td>
                    <td className="border px-4 py-2">{subregion?.name}</td>
                    <td className="border px-4 py-2">{district?.name}</td>
                    <td className="border px-4 py-2">{constituency?.name}</td>
                    <td className="border px-4 py-2">{subcounty?.name}</td>
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
                      <button
                        onClick={() => handleViewParishRegistras(item.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        View Registras
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Wards Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Wards</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Region</th>
              <th className="px-4 py-2">Subregion</th>
              <th className="px-4 py-2">District</th>
              <th className="px-4 py-2">Municipality</th>
              <th className="px-4 py-2">Division</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parishesWards
              .filter((item) => item.isWard)
              .map((item) => {
                const division = divisionMap.get(item.divisionId || 0);
                const municipality = municipalityMap.get(
                  division?.municipalityId || 0
                );
                const district = districtMap.get(municipality?.districtId || 0);
                const subregion = subregionMap.get(district?.subregionId || 0);
                const region = regionMap.get(subregion?.regionId || 0);
                return (
                  <tr key={`w-${item.id}`}>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{region?.name}</td>
                    <td className="border px-4 py-2">{subregion?.name}</td>
                    <td className="border px-4 py-2">{district?.name}</td>
                    <td className="border px-4 py-2">{municipality?.name}</td>
                    <td className="border px-4 py-2">{division?.name}</td>
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
                      <button
                        onClick={() => handleViewWardRegistras(item.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        View Registras
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Parish Registras Table */}
      {showParishRegistras && (
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">
              Registras for Parish:{" "}
              {parishes?.find((p) => p.id === selectedParishId)?.name}
            </h2>
            <button
              onClick={() => setIsRegistraModalOpen(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
            >
              Add Parish Registra
            </button>
          </div>

          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">NIN Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parishRegistras?.map((registra: Registra) => (
                <tr key={registra.id}>
                  <td className="border px-4 py-2">{registra.firstName}</td>
                  <td className="border px-4 py-2">{registra.lastName}</td>
                  <td className="border px-4 py-2">{registra.email}</td>
                  <td className="border px-4 py-2">{registra.phoneNumber}</td>
                  <td className="border px-4 py-2">{registra.ninNumber}</td>
                  <td className="border px-4 py-2">
                    {registra.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setEditingRegistra(registra);
                        setIsRegistraModalOpen(true);
                      }}
                      className="mr-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteParishRegistra(registra)}
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ward Registras Table */}
      {showWardRegistras && (
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">
              Registras for Ward:{" "}
              {wards?.find((w) => w.id === selectedWardId)?.name}
            </h2>
            <button
              onClick={() => setIsRegistraModalOpen(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
            >
              Add Ward Registra
            </button>
          </div>

          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone Number</th>
                <th className="px-4 py-2">NIN Number</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wardRegistras?.map((registra: Registra) => (
                <tr key={registra.id}>
                  <td className="border px-4 py-2">{registra.firstName}</td>
                  <td className="border px-4 py-2">{registra.lastName}</td>
                  <td className="border px-4 py-2">{registra.email}</td>
                  <td className="border px-4 py-2">{registra.phoneNumber}</td>
                  <td className="border px-4 py-2">{registra.ninNumber}</td>
                  <td className="border px-4 py-2">
                    {registra.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => {
                        setEditingRegistra(registra);
                        setIsRegistraModalOpen(true);
                      }}
                      className="mr-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteWardRegistra(registra)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Parish/Ward Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? "Edit" : "Add"}{" "}
              {editingItem?.isWard ? "Ward" : "Parish"}
            </h2>
            <div>
              <label className="block mb-2">
                Type:
                <select
                  value={newItem.isWard ? "ward" : "parish"}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      isWard: e.target.value === "ward",
                    })
                  }
                  className="border px-2 py-1 w-full mt-1"
                >
                  <option value="parish">Parish</option>
                  <option value="ward">Ward</option>
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
                {newItem.isWard ? "Division" : "Subcounty"}:
                <select
                  value={
                    newItem.isWard
                      ? newItem.divisionId
                      : newItem.subcountyId || ""
                  }
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      [newItem.isWard ? "divisionId" : "subcountyId"]: Number(
                        e.target.value
                      ),
                    })
                  }
                  className="border px-2 py-1 w-full mt-1"
                >
                  <option value="">
                    Select {newItem.isWard ? "Division" : "Subcounty"}
                  </option>
                  {newItem.isWard
                    ? divisions?.map((division) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))
                    : subcounties?.map((subcounty) => (
                        <option key={subcounty.id} value={subcounty.id}>
                          {subcounty.name}
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

      {/* ... (implement Registra modal similar to SubcountiesDivisions) */}

      {/* Add/Edit Registra Modal */}
      {isRegistraModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingRegistra ? "Edit Registra" : "Add Registra"} for{" "}
              {showParishRegistras ? "Parish" : "Ward"}
            </h2>
            <div>
              <label className="block mb-2">
                First Name:
                <input
                  type="text"
                  value={
                    editingRegistra?.firstName || newRegistra.firstName || ""
                  }
                  onChange={(e) =>
                    editingRegistra
                      ? setEditingRegistra({
                          ...editingRegistra,
                          firstName: e.target.value,
                        })
                      : setNewRegistra({
                          ...newRegistra,
                          firstName: e.target.value,
                        })
                  }
                  className="border px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                Last Name:
                <input
                  type="text"
                  value={
                    editingRegistra?.lastName || newRegistra.lastName || ""
                  }
                  onChange={(e) =>
                    editingRegistra
                      ? setEditingRegistra({
                          ...editingRegistra,
                          lastName: e.target.value,
                        })
                      : setNewRegistra({
                          ...newRegistra,
                          lastName: e.target.value,
                        })
                  }
                  className="border px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                Email:
                <input
                  type="email"
                  value={editingRegistra?.email || newRegistra.email || ""}
                  onChange={(e) =>
                    editingRegistra
                      ? setEditingRegistra({
                          ...editingRegistra,
                          email: e.target.value,
                        })
                      : setNewRegistra({
                          ...newRegistra,
                          email: e.target.value,
                        })
                  }
                  className="border px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                Phone Number:
                <input
                  type="text"
                  value={
                    editingRegistra?.phoneNumber ||
                    newRegistra.phoneNumber ||
                    ""
                  }
                  onChange={(e) =>
                    editingRegistra
                      ? setEditingRegistra({
                          ...editingRegistra,
                          phoneNumber: e.target.value,
                        })
                      : setNewRegistra({
                          ...newRegistra,
                          phoneNumber: e.target.value,
                        })
                  }
                  className="border px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                NIN Number:
                <input
                  type="text"
                  value={
                    editingRegistra?.ninNumber || newRegistra.ninNumber || ""
                  }
                  onChange={(e) =>
                    editingRegistra
                      ? setEditingRegistra({
                          ...editingRegistra,
                          ninNumber: e.target.value,
                        })
                      : setNewRegistra({
                          ...newRegistra,
                          ninNumber: e.target.value,
                        })
                  }
                  className="border px-2 py-1 w-full mt-1"
                />
              </label>
              <label className="block mb-2">
                <input
                  type="checkbox"
                  checked={
                    editingRegistra?.isActive || newRegistra.isActive || false
                  }
                  onChange={(e) =>
                    editingRegistra
                      ? setEditingRegistra({
                          ...editingRegistra,
                          isActive: e.target.checked,
                        })
                      : setNewRegistra({
                          ...newRegistra,
                          isActive: e.target.checked,
                        })
                  }
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  if (editingRegistra) {
                    showParishRegistras
                      ? handleUpdateParishRegistra()
                      : handleUpdateWardRegistra();
                  } else {
                    showParishRegistras
                      ? handleAddParishRegistra()
                      : handleAddWardRegistra();
                  }
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsRegistraModalOpen(false);
                  setEditingRegistra(null);
                }}
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

export default ParishesWards;
