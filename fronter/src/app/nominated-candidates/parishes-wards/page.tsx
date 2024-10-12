"use client";

import React, { useState, useEffect } from "react";
import {
  useGetParishesWardsCandidatesQuery,
  useUpdateParishesWardsCandidateMutation,
  useGetRegionsQuery,
  useGetSubregionsQuery,
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetSubcountiesQuery,
  useGetParishesQuery,
  useGetMunicipalitiesQuery,
  useGetDivisionsQuery,
  useGetWardsQuery,
  useGetCellsQuery,
  useGetVillagesQuery,
} from "@/state/api";
import { Edit, Trash, Plus, AlertCircle, CheckCircle, X } from "lucide-react";

interface ParishesWardsCandidate {
  id: string;
  ninNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category?: string;
  position?: string;
  region: string;
  subregion: string;
  district: string;
  constituency?: string;
  subcounty?: string;
  parish?: string;
  municipality?: string;
  division?: string;
  ward?: string;
  cell?: string;
  village?: string;
  parishwardElectionType: string;
  isQualified: boolean;
}

const ParishesWardsNominated = () => {
  const [operationResult, setOperationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const { data: parishesWardsCandidates, refetch } =
    useGetParishesWardsCandidatesQuery({});
  const [updateParishesWardsCandidate] =
    useUpdateParishesWardsCandidateMutation();

  const { data: regions } = useGetRegionsQuery();
  const { data: subregions } = useGetSubregionsQuery();
  const { data: districts } = useGetDistrictsQuery();
  const { data: constituencies } = useGetConstituenciesQuery();
  const { data: subcounties } = useGetSubcountiesQuery();
  const { data: parishes } = useGetParishesQuery();
  const { data: municipalities } = useGetMunicipalitiesQuery();
  const { data: divisions } = useGetDivisionsQuery();
  const { data: wards } = useGetWardsQuery();
  const { data: cells } = useGetCellsQuery();
  const { data: villages } = useGetVillagesQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleQualificationChange = async (
    id: string,
    isQualified: boolean
  ) => {
    try {
      await updateParishesWardsCandidate({ id, isQualified }).unwrap();
      refetch();
      setOperationResult({
        success: true,
        message: `Candidate Nomination updated successfully!`,
      });
    } catch (error: any) {
      setOperationResult({
        success: false,
        message: error.data?.error || "Failed to update candidate nomination.",
      });
    }
  };

  const getName = (id: string | undefined, dataArray: any[] | undefined) => {
    if (!id || !dataArray) return "";
    const item = dataArray.find((item) => item.id.toString() === id.toString());
    return item ? item.name : "";
  };

  const filterCandidatesByType = (type: string) => {
    if (type === "all") return parishesWardsCandidates;
    return parishesWardsCandidates?.filter(
      (candidate: ParishesWardsCandidate) =>
        candidate.parishwardElectionType === type
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Parish/Ward Nominated Candidates
      </h1>

      {/* Tabs */}
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "all" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        {["partyStructure", "lc2"].map((type) => (
          <button
            key={type}
            className={`mr-2 px-4 py-2 rounded ${
              activeTab === type ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type === "partyStructure" ? "Party Structure" : "LC2"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                NIN
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Region
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subregion
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                District
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Constituency/Municipality
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subcounty/Division
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Parish/Ward
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Village/Cell
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Election Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nominated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterCandidatesByType(activeTab)?.map(
              (candidate: ParishesWardsCandidate) => (
                <tr key={candidate.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.firstName} {candidate.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.ninNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getName(candidate.region, regions)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getName(candidate.subregion, subregions)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getName(candidate.district, districts)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.municipality
                        ? getName(candidate.municipality, municipalities)
                        : getName(candidate.constituency, constituencies)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.division
                        ? getName(candidate.division, divisions)
                        : getName(candidate.subcounty, subcounties)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.ward
                        ? getName(candidate.ward, wards)
                        : getName(candidate.parish, parishes)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.cell
                        ? getName(candidate.cell, cells)
                        : getName(candidate.village, villages)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.parishwardElectionType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.position}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={candidate.isQualified}
                      onChange={(e) =>
                        handleQualificationChange(
                          candidate.id,
                          e.target.checked
                        )
                      }
                      className="form-checkbox h-5 w-5 text-yellow-600"
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
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

export default ParishesWardsNominated;
