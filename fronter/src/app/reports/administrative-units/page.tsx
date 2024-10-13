"use client";
import React, { useState, useMemo } from "react";
import {
  useGetVillagesQuery,
  useGetCellsQuery,
  useGetRegionsQuery,
  useGetSubregionsQuery,
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetMunicipalitiesQuery,
  useGetSubcountiesQuery,
  useGetDivisionsQuery,
  useGetParishesQuery,
  useGetWardsQuery,
} from "@/state/api";
import PollingStationsTable from "@/app/components/PollingStationsTable";

const AdminUnitsReport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const itemsPerPage = 10;

  const { data: villages = [] } = useGetVillagesQuery();
  const { data: cells = [] } = useGetCellsQuery();
  const { data: regions = [] } = useGetRegionsQuery();
  const { data: subregions = [] } = useGetSubregionsQuery();
  const { data: districts = [] } = useGetDistrictsQuery();
  const { data: constituencies = [] } = useGetConstituenciesQuery();
  const { data: municipalities = [] } = useGetMunicipalitiesQuery();
  const { data: subcounties = [] } = useGetSubcountiesQuery();
  const { data: divisions = [] } = useGetDivisionsQuery();
  const { data: parishes = [] } = useGetParishesQuery();
  const { data: wards = [] } = useGetWardsQuery();

  const allUnits = useMemo(() => {
    return [
      ...villages.map((village) => ({ ...village, type: "Village" })),
      ...cells.map((cell) => ({ ...cell, type: "Cell" })),
    ];
  }, [villages, cells]);

  const getHierarchy = (unit: any) => {
    const parish = parishes.find((p) => p.id === unit.parishId);
    const ward = wards.find((w) => w.id === unit.wardId);

    const subcounty = subcounties.find((s) => s.id === parish?.subcountyId);
    const division = divisions.find((d) => d.id === ward?.divisionId);

    const constituency = constituencies.find(
      (c) => c.id === subcounty?.constituencyId
    );
    const municipality = municipalities.find(
      (m) => m.id === division?.municipalityId
    );

    const district = districts.find(
      (d) =>
        d.id === constituency?.districtId || d.id === municipality?.districtId
    );

    const subregion = subregions.find((s) => s.id === district?.subregionId);

    const region = regions.find((r) => r.id === subregion?.regionId);

    return {
      region: region?.name || "",
      subregion: subregion?.name || "",
      district: district?.name || "",
      constituencyMunicipality: constituency?.name || municipality?.name || "",
      subcountyDivision: subcounty?.name || division?.name || "",
      parishWard: parish?.name || ward?.name || "",
      villageCell: unit.name,
    };
  };

  const filteredUnits = useMemo(() => {
    return allUnits.filter((unit) => {
      const hierarchy = getHierarchy(unit);
      return (
        (filterType === "All" || unit.type === filterType) &&
        (unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hierarchy.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hierarchy.district.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [allUnits, filterType, searchTerm]);

  const paginatedUnits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUnits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUnits, currentPage]);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);

  const generateReport = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let content = "Administrative Units Report\n\n";
    content +=
      "Region,Subregion,District,Constituency/Municipality,Subcounty/Division,Parish/Ward,Village/Cell\n";
    filteredUnits.forEach((unit) => {
      const hierarchy = getHierarchy(unit);
      content += `${hierarchy.region},${hierarchy.subregion},${hierarchy.district},${hierarchy.constituencyMunicipality},${hierarchy.subcountyDivision},${hierarchy.parishWard},${hierarchy.villageCell}\n`;
    });

    const blob = new Blob([content], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "administrative_units_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Administrative Units Report</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Types</option>
          <option value="Village">Villages</option>
          <option value="Cell">Cells</option>
        </select>
        <button
          onClick={generateReport}
          disabled={isGenerating}
          className={`px-4 py-2 rounded flex items-center ${
            isGenerating
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {isGenerating ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          )}
          Download CSV
        </button>
      </div>

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
                Village/Cell
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUnits.map((unit) => {
              const hierarchy = getHierarchy(unit);
              return (
                <tr key={`${unit.type}-${unit.id}`}>
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
                    {hierarchy.villageCell}
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
          {Math.min(currentPage * itemsPerPage, filteredUnits.length)} of{" "}
          {filteredUnits.length} entries
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
      {/* <PollingStationsTable /> */}
    </div>
  );
};

export default AdminUnitsReport;
