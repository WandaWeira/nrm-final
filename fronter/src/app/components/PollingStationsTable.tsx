import React, { useState, useEffect } from "react";
import {
  useGetRegionsQuery,
  useGetSubregionsQuery,
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetMunicipalitiesQuery,
  useGetSubcountiesQuery,
  useGetDivisionsQuery,
  useGetParishesQuery,
  useGetWardsQuery,
  useGetParishPollingStationsQuery,
  useGetWardPollingStationsQuery,
} from "@/state/api";

const PollingStationsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allPollingStations, setAllPollingStations] = useState([]);
  const itemsPerPage = 10;

  const { data: regions = [], isLoading: isLoadingRegions } =
    useGetRegionsQuery();
  const { data: subregions = [], isLoading: isLoadingSubregions } =
    useGetSubregionsQuery();
  const { data: districts = [], isLoading: isLoadingDistricts } =
    useGetDistrictsQuery();
  const { data: constituencies = [], isLoading: isLoadingConstituencies } =
    useGetConstituenciesQuery();
  const { data: municipalities = [], isLoading: isLoadingMunicipalities } =
    useGetMunicipalitiesQuery();
  const { data: subcounties = [], isLoading: isLoadingSubcounties } =
    useGetSubcountiesQuery();
  const { data: divisions = [], isLoading: isLoadingDivisions } =
    useGetDivisionsQuery();
  const { data: parishes = [], isLoading: isLoadingParishes } =
    useGetParishesQuery();
  const { data: wards = [], isLoading: isLoadingWards } = useGetWardsQuery();

  const isLoading =
    isLoadingRegions ||
    isLoadingSubregions ||
    isLoadingDistricts ||
    isLoadingConstituencies ||
    isLoadingMunicipalities ||
    isLoadingSubcounties ||
    isLoadingDivisions ||
    isLoadingParishes ||
    isLoadingWards;

  useEffect(() => {
    const fetchPollingStations = async () => {
      if (!isLoading) {
        const parishPollingStations = await Promise.all(
          parishes.map(async (parish) => {
            const { data = [] } = await useGetParishPollingStationsQuery(
              parish.id
            ).refetch();
            return data.map((station) => ({
              ...station,
              parishId: parish.id,
              type: "parish",
            }));
          })
        );

        const wardPollingStations = await Promise.all(
          wards.map(async (ward) => {
            const { data = [] } = await useGetWardPollingStationsQuery(
              ward.id
            ).refetch();
            return data.map((station) => ({
              ...station,
              wardId: ward.id,
              type: "ward",
            }));
          })
        );

        setAllPollingStations([
          ...parishPollingStations.flat(),
          ...wardPollingStations.flat(),
        ]);
      }
    };

    fetchPollingStations();
  }, [isLoading, parishes, wards]);

  const getHierarchy = (station) => {
    let parish,
      ward,
      subcounty,
      division,
      constituency,
      municipality,
      district,
      subregion,
      region;

    if (station.type === "parish") {
      parish = parishes.find((p) => p.id === station.parishId);
      subcounty = subcounties.find((s) => s.id === parish?.subcountyId);
      constituency = constituencies.find(
        (c) => c.id === subcounty?.constituencyId
      );
    } else {
      ward = wards.find((w) => w.id === station.wardId);
      division = divisions.find((d) => d.id === ward?.divisionId);
      municipality = municipalities.find(
        (m) => m.id === division?.municipalityId
      );
    }

    district = districts.find(
      (d) =>
        d.id === constituency?.districtId || d.id === municipality?.districtId
    );
    subregion = subregions.find((s) => s.id === district?.subregionId);
    region = regions.find((r) => r.id === subregion?.regionId);

    return {
      region: region?.name || "",
      subregion: subregion?.name || "",
      district: district?.name || "",
      constituencyMunicipality: constituency?.name || municipality?.name || "",
      subcountyDivision: subcounty?.name || division?.name || "",
      parishWard: parish?.name || ward?.name || "",
      pollingStation: station.name,
    };
  };

  const filteredStations = allPollingStations.filter((station) => {
    const hierarchy = getHierarchy(station);
    return Object.values(hierarchy).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Polling Stations Report</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-4 py-2 border rounded mb-4"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subregion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Constituency/Municipality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subcounty/Division
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parish/Ward
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Polling Station
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStations.map((station, index) => {
              const hierarchy = getHierarchy(station);
              return (
                <tr key={`${station.id}-${index}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hierarchy.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hierarchy.subregion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hierarchy.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hierarchy.constituencyMunicipality}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hierarchy.subcountyDivision}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hierarchy.parishWard}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hierarchy.pollingStation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredStations.length)} of{" "}
          {filteredStations.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollingStationsTable;
