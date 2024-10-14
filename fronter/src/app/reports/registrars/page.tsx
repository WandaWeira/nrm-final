"use client";
import React, { useState, useMemo } from "react";
import {
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetSubcountiesQuery,
  useGetParishesQuery,
  useGetVillagesQuery,
  useGetDivisionsQuery,
  useGetMunicipalitiesQuery,
  useGetWardsQuery,
  useGetCellsQuery,
  useGetDistrictRegistrasQuery,
  useGetConstituencyRegistrasQuery,
  useGetSubcountyRegistrasQuery,
  useGetParishRegistrasQuery,
  useGetVillageRegistrasQuery,
  useGetDivisionRegistrasQuery,
  useGetMunicipalityRegistrasQuery,
  useGetWardRegistrasQuery,
  useGetCellRegistrasQuery,
} from "@/state/api";

const RegistrarsReport = () => {
  const [selectedUnit, setSelectedUnit] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const itemsPerPage = 10;

  const { data: districts = [] } = useGetDistrictsQuery();
  const { data: constituencies = [] } = useGetConstituenciesQuery();
  const { data: subcounties = [] } = useGetSubcountiesQuery();
  const { data: parishes = [] } = useGetParishesQuery();
  const { data: villages = [] } = useGetVillagesQuery();
  const { data: divisions = [] } = useGetDivisionsQuery();
  const { data: municipalities = [] } = useGetMunicipalitiesQuery();
  const { data: wards = [] } = useGetWardsQuery();
  const { data: cells = [] } = useGetCellsQuery();

  // Fetch registrars for each unit type
  const districtRegistrars = districts.map((d) => ({
    unitId: d.id,
    query: useGetDistrictRegistrasQuery(d.id),
  }));
  const constituencyRegistrars = constituencies.map((c) => ({
    unitId: c.id,
    query: useGetConstituencyRegistrasQuery(c.id),
  }));
  const subcountyRegistrars = subcounties.map((s) => ({
    unitId: s.id,
    query: useGetSubcountyRegistrasQuery(s.id),
  }));
  const parishRegistrars = parishes.map((p) => ({
    unitId: p.id,
    query: useGetParishRegistrasQuery(p.id),
  }));
  const villageRegistrars = villages.map((v) => ({
    unitId: v.id,
    query: useGetVillageRegistrasQuery(v.id),
  }));
  const divisionRegistrars = divisions.map((d) => ({
    unitId: d.id,
    query: useGetDivisionRegistrasQuery(d.id),
  }));
  const municipalityRegistrars = municipalities.map((m) => ({
    unitId: m.id,
    query: useGetMunicipalityRegistrasQuery(m.id),
  }));
  const wardRegistrars = wards.map((w) => ({
    unitId: w.id,
    query: useGetWardRegistrasQuery(w.id),
  }));
  const cellRegistrars = cells.map((c) => ({
    unitId: c.id,
    query: useGetCellRegistrasQuery(c.id),
  }));

  const allRegistrars = useMemo(() => {
    const mapRegistrars = (units: any, registrars: any, unitType:any) =>
      units.flatMap(
        (unit: any) =>
          registrars
            .find((r:any) => r.unitId === unit.id)
            ?.query.data?.map((registrar:any) => ({
              ...registrar,
              unitType,
              unitName: unit.name,
            })) || []
      );

    return [
      ...mapRegistrars(districts, districtRegistrars, "District"),
      ...mapRegistrars(constituencies, constituencyRegistrars, "Constituency"),
      ...mapRegistrars(subcounties, subcountyRegistrars, "Subcounty"),
      ...mapRegistrars(parishes, parishRegistrars, "Parish"),
      ...mapRegistrars(villages, villageRegistrars, "Village"),
      ...mapRegistrars(divisions, divisionRegistrars, "Division"),
      ...mapRegistrars(municipalities, municipalityRegistrars, "Municipality"),
      ...mapRegistrars(wards, wardRegistrars, "Ward"),
      ...mapRegistrars(cells, cellRegistrars, "Cell"),
    ].sort((a, b) => b.isActive - a.isActive);
  }, [
    districts,
    constituencies,
    subcounties,
    parishes,
    villages,
    divisions,
    municipalities,
    wards,
    cells,
    districtRegistrars,
    constituencyRegistrars,
    subcountyRegistrars,
    parishRegistrars,
    villageRegistrars,
    divisionRegistrars,
    municipalityRegistrars,
    wardRegistrars,
    cellRegistrars,
  ]);

  const filteredRegistrars = useMemo(() => {
    return allRegistrars.filter(
      (registrar) =>
        (selectedUnit === "All" || registrar.unitType === selectedUnit) &&
        (registrar.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registrar.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registrar.unitName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allRegistrars, selectedUnit, searchTerm]);

  const paginatedRegistrars = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrars.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrars, currentPage]);

  const totalPages = Math.ceil(filteredRegistrars.length / itemsPerPage);

  const generateCSV = () => {
    setIsGenerating(true);
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone Number",
      "NIN",
      "Active",
      "Unit Type",
      "Unit Name",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredRegistrars.map(
        (r) =>
          `${r.firstName},${r.lastName},${r.email},${r.phoneNumber},${r.ninNumber},${r.isActive},${r.unitType},${r.unitName}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "registrars_report.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setIsGenerating(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Registrars Report</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Units</option>
          <option value="District">Districts</option>
          <option value="Constituency">Constituencies</option>
          <option value="Subcounty">Subcounties</option>
          <option value="Parish">Parishes</option>
          <option value="Village">Villages</option>
          <option value="Division">Divisions</option>
          <option value="Municipality">Municipalities</option>
          <option value="Ward">Wards</option>
          <option value="Cell">Cells</option>
        </select>
        <button
          onClick={generateCSV}
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Name
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRegistrars.map((registrar, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {`${registrar.firstName} ${registrar.lastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registrar.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registrar.phoneNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registrar.ninNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registrar.isActive ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registrar.unitType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {registrar.unitName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredRegistrars.length)} of{" "}
          {filteredRegistrars.length} entries
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

export default RegistrarsReport;
