"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  useGetNationalsQuery,
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
  useCreateNationalOppositionCandidateMutation,
  useGetNationalOppositionCandidatesQuery,
  useUpdateNationalOppositionCandidateMutation,
  useDeleteNationalOppositionCandidateMutation,
} from "@/state/api";

interface Candidate {
  id: string;
  ninNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category?: string;
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
  nationalElectionType: string;
  isQualified: boolean;
  vote: number;
}

interface OppositionCandidate {
  id?: string;
  ninNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category?: string;
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
  nationalElectionType: string;
  vote: number;
  party: string;
}

const NationalOpposition = () => {
  const { data: nationalCandidates } = useGetNationalsQuery({});
  const { data: oppositionCandidates, refetch } =
    useGetNationalOppositionCandidatesQuery({});
  const [createOppositionCandidate] =
    useCreateNationalOppositionCandidateMutation();
  const [updateOppositionCandidate] =
    useUpdateNationalOppositionCandidateMutation();
  const [deleteOppositionCandidate] =
    useDeleteNationalOppositionCandidateMutation();
  const [activeTab, setActiveTab] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [oppositionCandidate, setOppositionCandidate] =
    useState<OppositionCandidate>({
      ninNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      category: "",
      region: "",
      subregion: "",
      district: "",
      constituency: "",
      subcounty: "",
      parish: "",
      village: "",
      municipality: "",
      division: "",
      ward: "",
      cell: "",
      nationalElectionType: "",
      vote: 0,
      party: "",
    });

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

  const [hasCity, setHasCity] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getName = (id: string | undefined, dataArray: any[] | undefined) => {
    if (!id || !dataArray) return "";
    const item = dataArray.find((item) => item.id.toString() === id.toString());
    return item ? item.name : "";
  };

  const getLocationName = (
    candidate: Candidate | OppositionCandidate,
    cityField: keyof (Candidate | OppositionCandidate),
    ruralField: keyof (Candidate | OppositionCandidate),
    cityData: any[] | undefined,
    ruralData: any[] | undefined
  ) => {
    if (candidate[cityField]) {
      return getName(candidate[cityField] as string, cityData || []);
    } else {
      return getName(candidate[ruralField] as string, ruralData || []);
    }
  };

  const groupWinnersByTypeAndCategory = (candidates: Candidate[]) => {
    const grouped: { [key: string]: { [key: string]: Candidate } } = {};
    candidates.forEach((candidate) => {
      if (candidate.isQualified) {
        if (!grouped[candidate.nationalElectionType]) {
          grouped[candidate.nationalElectionType] = {};
        }
        const category = candidate.category || "";
        if (
          !grouped[candidate.nationalElectionType][category] ||
          candidate.vote >
            grouped[candidate.nationalElectionType][category].vote
        ) {
          grouped[candidate.nationalElectionType][category] = candidate;
        }
      }
    });
    return grouped;
  };

  const sortedGroupedWinners = useMemo(() => {
    return groupWinnersByTypeAndCategory(nationalCandidates || []);
  }, [nationalCandidates]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOppositionCandidate((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));

    if (name === "district") {
      const selectedDistrict = districts?.find(
        (d) => d.id.toString() === value
      );
      setHasCity(selectedDistrict?.hasCity || false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editMode && oppositionCandidate.id) {
        await updateOppositionCandidate(oppositionCandidate).unwrap();
      } else {
        await createOppositionCandidate(oppositionCandidate).unwrap();
      }
      refetch();
      alert(
        `Opposition candidate ${editMode ? "updated" : "added"} successfully!`
      );
      setIsPopupOpen(false);
      setEditMode(false);
      setOppositionCandidate({
        ninNumber: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        category: "",
        region: "",
        subregion: "",
        district: "",
        constituency: "",
        subcounty: "",
        parish: "",
        village: "",
        municipality: "",
        division: "",
        ward: "",
        cell: "",
        nationalElectionType: "",
        vote: 0,
        party: "",
      });
    } catch (error) {
      console.error(
        `Failed to ${editMode ? "update" : "add"} opposition candidate:`,
        error
      );
      alert(
        `Failed to ${
          editMode ? "update" : "add"
        } opposition candidate. Please try again.`
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this opposition candidate?"
      )
    ) {
      try {
        await deleteOppositionCandidate(id).unwrap();
        alert("Opposition candidate deleted successfully!");
      } catch (error) {
        console.error("Failed to delete opposition candidate:", error);
        alert("Failed to delete opposition candidate. Please try again.");
      }
    }
  };

  const renderCandidateRow = (
    candidate: Candidate | OppositionCandidate,
    bgColor: string,
    isOpposition: boolean = false
  ) => (
    <tr className={bgColor} key={candidate.id}>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {candidate.firstName} {candidate.lastName}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-500">{candidate.ninNumber}</div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-500">{candidate.phoneNumber}</div>
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
          {getLocationName(candidate, "ward", "parish", wards, parishes)}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {getLocationName(candidate, "cell", "village", cells, villages)}
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <div className="text-sm text-gray-500">{candidate.vote}</div>
      </td>
      {"party" in candidate && (
        <td className="px-3 py-2 whitespace-nowrap">
          <div className="text-sm text-gray-500">{candidate.party}</div>
        </td>
      )}
      {isOpposition && (
        <td className="px-3 py-2 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentCategory(candidate.category || "");
                setIsPopupOpen(true);
                setEditMode(true);
                setOppositionCandidate(candidate as OppositionCandidate);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => handleDelete(candidate.id as string)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );

  const renderWinnerTable = (winner: Candidate, category: string) => (
    <div
      key={`${winner.nationalElectionType}-${category}-winner`}
      className="mb-8 overflow-x-auto"
    >
      <h3 className="text-lg font-semibold mb-2">Winner - {category}</h3>
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {renderCandidateRow(winner, "bg-yellow-100")}
        </tbody>
      </table>
    </div>
  );

  const renderOppositionTable = (
    oppositionCandidates: OppositionCandidate[],
    category: string
  ) => (
    <div
      key={`${oppositionCandidates[0].nationalElectionType}-${category}-opposition`}
      className="mb-8 overflow-x-auto"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Opposition - {category}</h3>
        <button
          onClick={() => {
            setCurrentCategory(category);
            setIsPopupOpen(true);
            setEditMode(false);
            setOppositionCandidate({
              ninNumber: "",
              firstName: "",
              lastName: "",
              phoneNumber: "",
              category: category,
              region: "",
              subregion: "",
              district: "",
              constituency: "",
              subcounty: "",
              parish: "",
              village: "",
              municipality: "",
              division: "",
              ward: "",
              cell: "",
              nationalElectionType:
                oppositionCandidates[0].nationalElectionType,
              vote: 0,
              party: "",
            });
          }}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Opposition Candidate
        </button>
      </div>
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
              Party
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {oppositionCandidates.map((candidate) =>
            renderCandidateRow(candidate, "bg-red-100", true)
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">National Opposition Leaders</h1>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(sortedGroupedWinners).map((type) => (
          <button
            key={type}
            className={`px-3 py-1 rounded text-sm ${
              activeTab === type ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Render tables for selected election type or all types if none selected */}
      {activeTab ? (
        <>
          <h2 className="text-xl font-bold mb-4">{activeTab}</h2>
          {Object.entries(sortedGroupedWinners[activeTab]).map(
            ([category, winner]) => (
              <div key={`${activeTab}-${category}`}>
                {renderWinnerTable(winner, category)}
                {oppositionCandidates?.filter(
                  (candidate: OppositionCandidate) =>
                    candidate.nationalElectionType === activeTab &&
                    candidate.category === category
                ).length > 0 ? (
                  renderOppositionTable(
                    oppositionCandidates.filter(
                      (candidate: OppositionCandidate) =>
                        candidate.nationalElectionType === activeTab &&
                        candidate.category === category
                    ),
                    category
                  )
                ) : (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setCurrentCategory(category);
                        setIsPopupOpen(true);
                        setEditMode(false);
                        setOppositionCandidate({
                          ninNumber: "",
                          firstName: "",
                          lastName: "",
                          phoneNumber: "",
                          category: category,
                          region: "",
                          subregion: "",
                          district: "",
                          constituency: "",
                          subcounty: "",
                          parish: "",
                          village: "",
                          municipality: "",
                          division: "",
                          ward: "",
                          cell: "",
                          nationalElectionType: activeTab,
                          vote: 0,
                          party: "",
                        });
                      }}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Opposition Candidate
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </>
      ) : (
        Object.entries(sortedGroupedWinners).map(([type, winners]) => (
          <div key={type}>
            <h2 className="text-xl font-bold mb-4">{type}</h2>
            {Object.entries(winners).map(([category, winner]) => (
              <div key={`${type}-${category}`}>
                {renderWinnerTable(winner, category)}
                {oppositionCandidates?.filter(
                  (candidate: OppositionCandidate) =>
                    candidate.nationalElectionType === type &&
                    candidate.category === category
                ).length > 0 ? (
                  renderOppositionTable(
                    oppositionCandidates.filter(
                      (candidate: OppositionCandidate) =>
                        candidate.nationalElectionType === type &&
                        candidate.category === category
                    ),
                    category
                  )
                ) : (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setCurrentCategory(category);
                        setIsPopupOpen(true);
                        setEditMode(false);
                        setOppositionCandidate({
                          ninNumber: "",
                          firstName: "",
                          lastName: "",
                          phoneNumber: "",
                          category: category,
                          region: "",
                          subregion: "",
                          district: "",
                          constituency: "",
                          subcounty: "",
                          parish: "",
                          village: "",
                          municipality: "",
                          division: "",
                          ward: "",
                          cell: "",
                          nationalElectionType: type,
                          vote: 0,
                          party: "",
                        });
                      }}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Opposition Candidate
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      {/* Popup for adding/editing opposition candidate */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">
              {editMode ? "Edit" : "Add"} Opposition Candidate for{" "}
              {currentCategory}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="ninNumber"
                value={oppositionCandidate.ninNumber}
                onChange={handleInputChange}
                placeholder="NIN Number"
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="firstName"
                value={oppositionCandidate.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="lastName"
                value={oppositionCandidate.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                value={oppositionCandidate.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <input
                type="text"
                name="party"
                value={oppositionCandidate.party}
                onChange={handleInputChange}
                placeholder="Party"
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <select
                name="region"
                value={oppositionCandidate.region}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
                required
              >
                <option value="">Select Region</option>
                {regions?.map((region: any) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
              <select
                name="subregion"
                value={oppositionCandidate.subregion}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
                required
              >
                <option value="">Select Subregion</option>
                {subregions
                  ?.filter(
                    (subregion: any) =>
                      subregion.regionId ===
                      parseInt(oppositionCandidate.region)
                  )
                  .map((subregion: any) => (
                    <option key={subregion.id} value={subregion.id}>
                      {subregion.name}
                    </option>
                  ))}
              </select>
              <select
                name="district"
                value={oppositionCandidate.district}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
                required
              >
                <option value="">Select District</option>
                {districts
                  ?.filter(
                    (district: any) =>
                      district.subregionId ===
                      parseInt(oppositionCandidate.subregion)
                  )
                  .map((district: any) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>
              {!hasCity && (
                <>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="constituency"
                    value={oppositionCandidate.constituency || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Constituency</option>
                    {constituencies
                      ?.filter(
                        (constituency: any) =>
                          constituency.districtId ===
                          parseInt(oppositionCandidate.district)
                      )
                      .map((constituency: any) => (
                        <option key={constituency.id} value={constituency.id}>
                          {constituency.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="subcounty"
                    value={oppositionCandidate.subcounty || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Subcounty</option>
                    {subcounties
                      ?.filter(
                        (subcounty: any) =>
                          subcounty.constituencyId ===
                          parseInt(oppositionCandidate.constituency || "0")
                      )
                      .map((subcounty: any) => (
                        <option key={subcounty.id} value={subcounty.id}>
                          {subcounty.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="parish"
                    value={oppositionCandidate.parish || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Parish</option>
                    {parishes
                      ?.filter(
                        (parish: any) =>
                          parish.subcountyId ===
                          parseInt(oppositionCandidate.subcounty || "0")
                      )
                      .map((parish: any) => (
                        <option key={parish.id} value={parish.id}>
                          {parish.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="village"
                    value={oppositionCandidate.village || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Village</option>
                    {villages
                      ?.filter(
                        (village: any) =>
                          village.parishId ===
                          parseInt(oppositionCandidate.parish || "0")
                      )
                      .map((village: any) => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                  </select>
                </>
              )}

              {hasCity && (
                <>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="municipality"
                    value={oppositionCandidate.municipality || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Municipality</option>
                    {municipalities
                      ?.filter(
                        (municipality: any) =>
                          municipality.districtId ===
                          parseInt(oppositionCandidate.district)
                      )
                      .map((municipality: any) => (
                        <option
                          key={municipality.id}
                          value={municipality.id.toString()}
                        >
                          {municipality.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="division"
                    value={oppositionCandidate.division || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Division</option>
                    {divisions
                      ?.filter(
                        (division: any) =>
                          division.municipalityId ===
                          (oppositionCandidate.municipality
                            ? parseInt(oppositionCandidate.municipality)
                            : undefined)
                      )
                      .map((division: any) => (
                        <option
                          key={division.id}
                          value={division.id.toString()}
                        >
                          {division.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="ward"
                    value={oppositionCandidate.ward || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Ward</option>
                    {wards
                      ?.filter(
                        (ward: any) =>
                          ward.divisionId ===
                          (oppositionCandidate.division
                            ? parseInt(oppositionCandidate.division)
                            : undefined)
                      )
                      .map((ward: any) => (
                        <option key={ward.id} value={ward.id.toString()}>
                          {ward.name}
                        </option>
                      ))}
                  </select>
                  <select
                    className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
                    name="cell"
                    value={oppositionCandidate.cell || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Cell</option>
                    {cells
                      ?.filter(
                        (cell: any) =>
                          cell.wardId ===
                          (oppositionCandidate.ward
                            ? parseInt(oppositionCandidate.ward)
                            : undefined)
                      )
                      .map((cell: any) => (
                        <option key={cell.id} value={cell.id.toString()}>
                          {cell.name}
                        </option>
                      ))}
                  </select>
                </>
              )}
              <input
                type="number"
                name="vote"
                value={oppositionCandidate.vote}
                onChange={handleInputChange}
                placeholder="Votes"
                className="mb-2 w-full p-2 border rounded"
                required
              />
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  {editMode ? "Update" : "Add"} Candidate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setEditMode(false);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NationalOpposition;
