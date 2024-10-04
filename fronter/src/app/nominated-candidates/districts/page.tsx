"use client";
import React, { useState, useEffect } from "react";
import {
  useGetDistrictCandidatesQuery,
  useUpdateDistrictCandidateMutation,
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

interface DistrictCandidate {
  id: string;
  ninNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category?: string;
  position?: string;
  councilorType?: string;
  gender?: string;
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
  districtElectionType: string;
  isQualified: boolean;
}

const DistrictNominated = () => {
  const { data: districtCandidates, refetch } = useGetDistrictCandidatesQuery(
    {}
  );
  const [updateDistrictCandidate] = useUpdateDistrictCandidateMutation();
  const [activeTab, setActiveTab] = useState("all");

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

  const handleQualificationChange = async (
    id: string,
    isQualified: boolean
  ) => {
    try {
      await updateDistrictCandidate({ id, isQualified }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update candidate qualification:", error);
      alert("Failed to update candidate qualification. Please try again.");
    }
  };

  const getName = (id: string | undefined, dataArray: any[] | undefined) => {
    if (!id || !dataArray) return "";
    const item = dataArray.find((item) => item.id.toString() === id.toString());
    return item ? item.name : "";
  };

  const getLocationName = (
    candidate: DistrictCandidate,
    cityField: keyof DistrictCandidate,
    ruralField: keyof DistrictCandidate,
    cityData: any[] | undefined,
    ruralData: any[] | undefined
  ) => {
    if (candidate[cityField]) {
      return getName(candidate[cityField] as string, cityData || []);
    } else {
      return getName(candidate[ruralField] as string, ruralData || []);
    }
  };

  const filterCandidatesByType = (type: string) => {
    if (type === "all") return districtCandidates;
    return districtCandidates?.filter(
      (candidate: DistrictCandidate) => candidate.districtElectionType === type
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">District Nominated Candidates</h1>

      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            activeTab === "all" ? "bg-yellow-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        {[
          "partyStructure",
          "lcv",
          "DistrictCouncillors",
          "DistrictSIGCouncillors",
        ].map((type) => (
          <button
            key={type}
            className={`mr-2 px-4 py-2 rounded ${
              activeTab === type ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Election Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Councilor Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qualified
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterCandidatesByType(activeTab)?.map(
              (candidate: DistrictCandidate) => (
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
                      {getLocationName(
                        candidate,
                        "municipality",
                        "constituency",
                        municipalities,
                        constituencies
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.districtElectionType}
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
                    <div className="text-sm text-gray-500">
                      {candidate.councilorType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {candidate.gender}
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
    </div>
  );
};

export default DistrictNominated;
