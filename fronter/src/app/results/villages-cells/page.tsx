"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  useGetVillageCellsCandidatesQuery,
  useUpdateVillageCellsCandidateMutation,
  useGetRegionsQuery,
  useGetSubregionsQuery,
  useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetSubcountiesQuery,
  useGetParishesQuery,
  useGetVillagesQuery,
  useGetMunicipalitiesQuery,
  useGetDivisionsQuery,
  useGetWardsQuery,
  useGetCellsQuery,
} from "@/state/api";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface VillageCellCandidate {
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
  village?: string;
  municipality?: string;
  division?: string;
  ward?: string;
  cell?: string;
  villageCellElectionType: string;
  isQualified: boolean;
  vote: number;
}

const VillageCellResults = () => {
  const [operationResult, setOperationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [updateVillageCellsCandidate] =
    useUpdateVillageCellsCandidateMutation();
  const { data: villageCellCandidates, refetch } =
    useGetVillageCellsCandidatesQuery({});
  const [activeTab, setActiveTab] = useState("all");
  const [editingVotes, setEditingVotes] = useState<{ [key: string]: number }>(
    {}
  );
  const [initialVotes, setInitialVotes] = useState<{ [key: string]: number }>(
    {}
  );

  // Fetch location data
  const { data: regions } = useGetRegionsQuery();
  const { data: subregions } = useGetSubregionsQuery();
  const { data: districts } = useGetDistrictsQuery();
  const { data: constituencies } = useGetConstituenciesQuery();
  const { data: subcounties } = useGetSubcountiesQuery();
  const { data: parishes } = useGetParishesQuery();
  const { data: villages } = useGetVillagesQuery();
  const { data: municipalities } = useGetMunicipalitiesQuery();
  const { data: divisions } = useGetDivisionsQuery();
  const { data: wards } = useGetWardsQuery();
  const { data: cells } = useGetCellsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (villageCellCandidates) {
      const votes = villageCellCandidates.reduce(
        (acc: any, candidate: VillageCellCandidate) => {
          acc[candidate.id] = candidate.vote;
          return acc;
        },
        {} as { [key: string]: number }
      );
      setInitialVotes(votes);
      setEditingVotes(votes);
    }
  }, [villageCellCandidates]);

  const handleVoteChange = (id: string, votes: number) => {
    setEditingVotes((prev) => ({ ...prev, [id]: votes }));
  };

  const handleVoteSubmit = async (id: string) => {
    try {
      await updateVillageCellsCandidate({
        id,
        vote: editingVotes[id],
      }).unwrap();
      refetch();
      setOperationResult({
        success: true,
        message: `Candidate vote updated successfully!`,
      });
      setInitialVotes((prev) => ({ ...prev, [id]: editingVotes[id] }));
    } catch (error: any) {
      setOperationResult({
        success: false,
        message: error.data?.error || "Failed to update candidate vote.",
      });
    }
  };

  const getName = (id: string | undefined, dataArray: any[] | undefined) => {
    if (!id || !dataArray) return "";
    const item = dataArray.find((item) => item.id.toString() === id.toString());
    return item ? item.name : "";
  };

  const getLocationName = (
    candidate: VillageCellCandidate,
    cityField: keyof VillageCellCandidate,
    ruralField: keyof VillageCellCandidate,
    cityData: any[] | undefined,
    ruralData: any[] | undefined
  ) => {
    if (candidate[cityField]) {
      return getName(candidate[cityField] as string, cityData || []);
    } else {
      return getName(candidate[ruralField] as string, ruralData || []);
    }
  };

  const groupCandidatesByTypeAndCategoryPosition = (
    candidates: VillageCellCandidate[]
  ) => {
    const grouped: {
      [key: string]: { [key: string]: VillageCellCandidate[] };
    } = {};
    candidates.forEach((candidate) => {
      if (candidate.isQualified) {
        if (!grouped[candidate.villageCellElectionType]) {
          grouped[candidate.villageCellElectionType] = {};
        }
        const key = `${candidate.category || ""}-${candidate.position || ""}`;
        if (!grouped[candidate.villageCellElectionType][key]) {
          grouped[candidate.villageCellElectionType][key] = [];
        }
        grouped[candidate.villageCellElectionType][key].push(candidate);
      }
    });
    // Ensure LC1 is always present
    if (!grouped["lc1"]) {
      grouped["lc1"] = {};
    }
    return grouped;
  };

  const sortedGroupedCandidates = useMemo(() => {
    const groupedCandidates = groupCandidatesByTypeAndCategoryPosition(
      villageCellCandidates || []
    );
    Object.keys(groupedCandidates).forEach((type) => {
      Object.keys(groupedCandidates[type]).forEach((key) => {
        groupedCandidates[type][key].sort((a, b) => b.vote - a.vote);
      });
    });
    return groupedCandidates;
  }, [villageCellCandidates]);

  const renderCandidateTable = (
    candidates: VillageCellCandidate[],
    category: string,
    position: string
  ) => {
    const winner = candidates[0];
    return (
      <div key={`${category}-${position}`} className="mb-8 overflow-x-auto">
        {(category || position) && (
          <h3 className="text-lg font-semibold mb-2">
            {category && `Category: ${category}`}
            {category && position && " - "}
            {position && `Position: ${position}`}
          </h3>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIN
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subregion
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Constituency/Municipality
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subcounty/Division
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parish/Ward
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Village/Cell
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Votes
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {candidates.map((candidate: VillageCellCandidate) => (
              <tr
                key={candidate.id}
                className={candidate === winner ? "bg-yellow-100" : ""}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {candidate.firstName} {candidate.lastName}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {candidate.ninNumber}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {candidate.phoneNumber}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getName(candidate.region, regions)}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getName(candidate.subregion, subregions)}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getName(candidate.district, districts)}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getLocationName(
                      candidate,
                      "municipality",
                      "constituency",
                      municipalities,
                      constituencies
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getLocationName(
                      candidate,
                      "division",
                      "subcounty",
                      divisions,
                      subcounties
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getLocationName(
                      candidate,
                      "ward",
                      "parish",
                      wards,
                      parishes
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {getLocationName(
                      candidate,
                      "cell",
                      "village",
                      cells,
                      villages
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="number"
                    value={editingVotes[candidate.id] || 0}
                    onChange={(e) =>
                      handleVoteChange(candidate.id, parseInt(e.target.value))
                    }
                    className="w-16 p-1 border rounded text-sm mr-2"
                  />
                  <button
                    onClick={() => handleVoteSubmit(candidate.id)}
                    className={`px-2 py-1 text-white rounded text-sm ${
                      editingVotes[candidate.id] !== initialVotes[candidate.id]
                        ? "bg-gray-950 hover:bg-gray-900"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={
                      editingVotes[candidate.id] === initialVotes[candidate.id]
                    }
                  >
                    Submit
                  </button>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {candidate === winner ? (
                    <span className="text-green-600 text-sm">Winner</span>
                  ) : (
                    <span className="text-gray-500 text-sm">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Village/Cell Election Results</h1>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`px-3 py-1 rounded text-sm ${
            activeTab === "all" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        {Object.keys(sortedGroupedCandidates).map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded text-sm ${
              activeTab === type ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type === "lc1"
              ? "LC1"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Render tables for selected election type */}
      {activeTab === "all" ? (
        Object.entries(sortedGroupedCandidates).map(
          ([type, categoryPositions]) => (
            <div key={type}>
              <h2 className="text-xl font-bold my-4">
                {type === "lc1" ? "LC1" : type}
              </h2>
              {Object.entries(categoryPositions).map(([key, candidates]) => {
                const [category, position] = key.split("-");
                return renderCandidateTable(candidates, category, position);
              })}
            </div>
          )
        )
      ) : (
        <div>
          <h2 className="text-xl font-bold my-4">
            {activeTab === "lc1" ? "LC1" : activeTab}
          </h2>
          {Object.entries(sortedGroupedCandidates[activeTab] || {}).map(
            ([key, candidates]) => {
              const [category, position] = key.split("-");
              return renderCandidateTable(candidates, category, position);
            }
          )}
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
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-950 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageCellResults;
