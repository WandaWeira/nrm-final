"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
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
  useCreateSubcountiesDivisionsOppositionCandidateMutation,
  useGetSubcountiesDivisionsOppositionCandidatesQuery,
  useUpdateSubcountiesDivisionsOppositionCandidateMutation,
  useDeleteSubcountiesDivisionsOppositionCandidateMutation,
  useGetSubcountiesDivisionsCandidatesQuery,
} from "@/state/api";

interface Candidate {
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
  constituency: string;
  subcounty: string;
  parish: string;
  village?: string;
  municipality?: string;
  division?: string;
  ward?: string;
  cell?: string;
  subcountiesDivisionsElectionType: string;
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
  position?: string;
  councilorType?: string;
  gender?: string;
  region: string;
  subregion: string;
  district: string;
  constituency: string;
  subcounty: string;
  parish: string;
  village?: string;
  municipality?: string;
  division?: string;
  ward?: string;
  cell?: string;
  subcountiesDivisionsElectionType: string;
  vote: number;
  party: string;
}

const SubcountyDivisionOpposition: React.FC = () => {
  const { data: subcountiesDivisionsCandidates } =
    useGetSubcountiesDivisionsCandidatesQuery({});
  const { data: oppositionCandidates, refetch } =
    useGetSubcountiesDivisionsOppositionCandidatesQuery();
  const [createOppositionCandidate] =
    useCreateSubcountiesDivisionsOppositionCandidateMutation();
  const [updateOppositionCandidate] =
    useUpdateSubcountiesDivisionsOppositionCandidateMutation();
  const [deleteOppositionCandidate] =
    useDeleteSubcountiesDivisionsOppositionCandidateMutation();

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

  const [activeTab, setActiveTab] = useState<string>("all");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [hasCity, setHasCity] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [oppositionCandidate, setOppositionCandidate] =
    useState<OppositionCandidate>({
      ninNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      category: "",
      position: "",
      councilorType: "",
      gender: "",
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
      subcountiesDivisionsElectionType: "",
      vote: 0,
      party: "",
    });

  const categoryOptions = {
    partyStructure: [
      "youth",
      "women",
      "pwds",
      "elders",
      "mainstream",
      "veterans",
    ],
  };

  const positionOptions = {
    partyStructure: [
      "chairman",
      "vice chairman",
      "secretary finance",
      "general secretary",
      "secretary publicity",
    ],
  };

  const councilorTypeOptions = {
    SubcountyCouncillors: ["Direct councillors", "Female councillors"],
    SubcountySIGCouncillors: [
      "Youth councilor",
      "PWD councilor",
      "Elders councilor",
    ],
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

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

  const validateForm = () => {
    const requiredFields = [
      "region",
      "subregion",
      "district",
      "subcountiesDivisionsElectionType",
      "party",
      "ninNumber",
      "firstName",
      "lastName",
      "phoneNumber",
    ];
    for (let field of requiredFields) {
      if (!oppositionCandidate[field as keyof OppositionCandidate]) {
        alert(`Please fill the ${field} field`);
        return false;
      }
    }

    if (isNaN(Number(oppositionCandidate.vote))) {
      alert("Vote must be a number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSubmit = {
        ...oppositionCandidate,
        vote: Number(oppositionCandidate.vote),
      };

      Object.keys(dataToSubmit).forEach(
        (key) =>
          dataToSubmit[key as keyof OppositionCandidate] === undefined &&
          delete dataToSubmit[key as keyof OppositionCandidate]
      );

      if (editMode && oppositionCandidate.id) {
        await updateOppositionCandidate(dataToSubmit).unwrap();
      } else {
        await createOppositionCandidate(dataToSubmit).unwrap();
      }
      refetch();
      alert(
        `Opposition candidate ${editMode ? "updated" : "added"} successfully!`
      );
      setIsPopupOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(
        `Failed to ${editMode ? "update" : "add"} opposition candidate:`,
        error
      );
      if (error.data && error.data.error) {
        console.error("Server error message:", error.data.error);
        alert(
          `Failed to ${editMode ? "update" : "add"} opposition candidate. ${
            error.data.error
          }`
        );
      } else {
        alert(
          `Failed to ${
            editMode ? "update" : "add"
          } opposition candidate. Please try again.`
        );
      }
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
        refetch();
        alert("Opposition candidate deleted successfully!");
      } catch (error) {
        console.error("Failed to delete opposition candidate:", error);
        alert("Failed to delete opposition candidate. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setOppositionCandidate({
      ninNumber: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      category: "",
      position: "",
      councilorType: "",
      gender: "",
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
      subcountiesDivisionsElectionType: "",
      vote: 0,
      party: "",
    });
    setEditMode(false);
    setHasCity(false);
  };

  const getName = (id: string | undefined, dataArray: any[] | undefined) => {
    if (!id || !dataArray) return "";
    const item = dataArray.find((item) => item.id.toString() === id.toString());
    return item ? item.name : "";
  };

  const getLocationName = (
    candidate: OppositionCandidate,
    cityField: keyof OppositionCandidate,
    ruralField: keyof OppositionCandidate,
    cityData: any[] | undefined,
    ruralData: any[] | undefined
  ) => {
    if (candidate[cityField]) {
      return getName(candidate[cityField] as string, cityData || []);
    } else {
      return getName(candidate[ruralField] as string, ruralData || []);
    }
  };

  const getCategoryKey = (candidate: OppositionCandidate) => {
    switch (candidate.subcountiesDivisionsElectionType) {
      case "partyStructure":
        return `${candidate.category}-${candidate.position}`;
      case "lc3":
        return "lc3";
      case "SubcountyCouncillors":
        return candidate.councilorType || "";
      case "SubcountySIGCouncillors":
        return `${candidate.councilorType}-${candidate.gender}`;
      default:
        return "";
    }
  };

  const groupWinnersByTypeAndCategory = (candidates: any[]) => {
    const grouped: { [key: string]: { [key: string]: any } } = {};
    candidates.forEach((candidate) => {
      if (candidate.isQualified) {
        if (!grouped[candidate.subcountiesDivisionsElectionType]) {
          grouped[candidate.subcountiesDivisionsElectionType] = {};
        }
        const category = getCategoryKey(candidate);
        if (
          !grouped[candidate.subcountiesDivisionsElectionType][category] ||
          candidate.vote >
            grouped[candidate.subcountiesDivisionsElectionType][category].vote
        ) {
          grouped[candidate.subcountiesDivisionsElectionType][category] =
            candidate;
        }
      }
    });
    return grouped;
  };

  const sortedGroupedWinners = useMemo(() => {
    return groupWinnersByTypeAndCategory(subcountiesDivisionsCandidates || []);
  }, [subcountiesDivisionsCandidates]);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCandidateRow = (
    candidate: OppositionCandidate,
    bgColor: string,
    isOpposition: boolean = false
  ) => (
    <React.Fragment key={candidate.id}>
      <tr
        className={`${bgColor} cursor-pointer`}
        onClick={() => toggleRowExpansion(candidate.id as string)}
      >
        <td className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </span>
            {expandedRows[candidate.id as string] ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </div>
        </td>
      </tr>
      {expandedRows[candidate.id as string] && (
        <tr className={bgColor}>
          <td className="px-3 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <strong>NIN:</strong> {candidate.ninNumber}
              </div>
              <div>
                <strong>Phone:</strong> {candidate.phoneNumber}
              </div>
              <div>
                <strong>Region:</strong> {getName(candidate.region, regions)}
              </div>
              <div>
                <strong>Subregion:</strong>{" "}
                {getName(candidate.subregion, subregions)}
              </div>
              <div>
                <strong>District:</strong>{" "}
                {getName(candidate.district, districts)}
              </div>
              <div>
                <strong>Constituency:</strong>{" "}
                {getName(candidate.constituency, constituencies)}
              </div>
              <div>
                <strong>Subcounty:</strong>{" "}
                {getName(candidate.subcounty, subcounties)}
              </div>
              <div>
                <strong>Parish:</strong> {getName(candidate.parish, parishes)}
              </div>
              <div>
                <strong>Village:</strong> {getName(candidate.village, villages)}
              </div>
              <div>
                <strong>Municipality:</strong>{" "}
                {getName(candidate.municipality, municipalities)}
              </div>
              <div>
                <strong>Division:</strong>{" "}
                {getName(candidate.division, divisions)}
              </div>
              <div>
                <strong>Ward:</strong> {getName(candidate.ward, wards)}
              </div>
              <div>
                <strong>Cell:</strong> {getName(candidate.cell, cells)}
              </div>
              <div>
                <strong>Votes:</strong> {candidate.vote}
              </div>
              <div>
                <strong>Party:</strong> {candidate.party}
              </div>
              {candidate.category && (
                <div>
                  <strong>Category:</strong> {candidate.category}
                </div>
              )}
              {candidate.position && (
                <div>
                  <strong>Position:</strong> {candidate.position}
                </div>
              )}
              {candidate.councilorType && (
                <div>
                  <strong>Councilor Type:</strong> {candidate.councilorType}
                </div>
              )}
              {candidate.gender && (
                <div>
                  <strong>Gender:</strong> {candidate.gender}
                </div>
              )}
            </div>
            {isOpposition && (
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopupOpen(true);
                    setEditMode(true);
                    setOppositionCandidate(candidate);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(candidate.id as string);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </td>
        </tr>
      )}
    </React.Fragment>
  );

  const renderWinnerTable = (winner: any, category: string) => (
    <div
      key={`${winner.subcountiesDivisionsElectionType}-${category}-winner`}
      className="mb-8"
    >
      <h3 className="text-lg font-semibold mb-2">Winner - {category}</h3>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {renderCandidateRow(winner, "bg-yellow-100")}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOppositionTable = (
    oppositionCandidates: OppositionCandidate[],
    category: string
  ) => (
    <div
      key={`${oppositionCandidates[0].subcountiesDivisionsElectionType}-${category}-opposition`}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <h3 className="text-lg font-semibold mb-2 sm:mb-0">
          Opposition - {category}
        </h3>
        <button
          onClick={() => {
            setIsPopupOpen(true);
            setEditMode(false);
            setOppositionCandidate({
              ninNumber: "",
              firstName: "",
              lastName: "",
              phoneNumber: "",
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
              subcountiesDivisionsElectionType:
                oppositionCandidates[0].subcountiesDivisionsElectionType,
              vote: 0,
              party: "",
            });
          }}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Opposition Candidate
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {oppositionCandidates.map((candidate) =>
              renderCandidateRow(candidate, "bg-red-100", true)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFormFields = () => {
    switch (oppositionCandidate.subcountiesDivisionsElectionType) {
      case "partyStructure":
        return (
          <>
            <select
              className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
              name="category"
              value={oppositionCandidate.category || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {categoryOptions.partyStructure.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
              name="position"
              value={oppositionCandidate.position || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Position</option>
              {positionOptions.partyStructure.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </>
        );
      case "SubcountyCouncillors":
        return (
          <select
            className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
            name="councilorType"
            value={oppositionCandidate.councilorType || ""}
            onChange={handleInputChange}
          >
            <option value="">Select Councilor Type</option>
            {councilorTypeOptions.SubcountyCouncillors.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "SubcountySIGCouncillors":
        return (
          <>
            <select
              className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
              name="councilorType"
              value={oppositionCandidate.councilorType || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Councilor Type</option>
              {councilorTypeOptions.SubcountySIGCouncillors.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-yellow-500"
              name="gender"
              value={oppositionCandidate.gender || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </>
        );
      case "lc3":
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Subcounty/Division Opposition Leaders
      </h1>

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
      {activeTab === "all"
        ? Object.entries(sortedGroupedWinners).map(([type, winners]) => (
            <div key={type}>
              <h2 className="text-xl font-bold mb-4">{type}</h2>
              {Object.entries(winners).map(([category, winner]) => (
                <div key={`${type}-${category}`}>
                  {renderWinnerTable(winner, category)}
                  {oppositionCandidates &&
                  oppositionCandidates.filter(
                    (candidate: OppositionCandidate) =>
                      candidate.subcountiesDivisionsElectionType === type &&
                      getCategoryKey(candidate) === category
                  ).length > 0 ? (
                    renderOppositionTable(
                      oppositionCandidates.filter(
                        (candidate: OppositionCandidate) =>
                          candidate.subcountiesDivisionsElectionType === type &&
                          getCategoryKey(candidate) === category
                      ),
                      category
                    )
                  ) : (
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          setIsPopupOpen(true);
                          setEditMode(false);
                          setOppositionCandidate({
                            ninNumber: "",
                            firstName: "",
                            lastName: "",
                            phoneNumber: "",
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
                            subcountiesDivisionsElectionType: type,
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
        : Object.entries(sortedGroupedWinners[activeTab] || {}).map(
            ([category, winner]) => (
              <div key={`${activeTab}-${category}`}>
                {renderWinnerTable(winner, category)}
                {oppositionCandidates &&
                oppositionCandidates.filter(
                  (candidate: OppositionCandidate) =>
                    candidate.subcountiesDivisionsElectionType === activeTab &&
                    getCategoryKey(candidate) === category
                ).length > 0 ? (
                  renderOppositionTable(
                    oppositionCandidates.filter(
                      (candidate: OppositionCandidate) =>
                        candidate.subcountiesDivisionsElectionType ===
                          activeTab && getCategoryKey(candidate) === category
                    ),
                    category
                  )
                ) : (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setIsPopupOpen(true);
                        setEditMode(false);
                        setOppositionCandidate({
                          ninNumber: "",
                          firstName: "",
                          lastName: "",
                          phoneNumber: "",
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
                          subcountiesDivisionsElectionType: activeTab,
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

      {/* Popup for adding/editing opposition candidate */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 shadow-xl w-full">
          <div className="bg-white p-8 rounded w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">
              {editMode
                ? "Edit Opposition Candidate"
                : "Add Opposition Candidate"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="subcountiesDivisionsElectionType"
                  value={oppositionCandidate.subcountiesDivisionsElectionType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Election Type</option>
                  <option value="partyStructure">Party Structure</option>
                  <option value="lc3">LC3</option>
                  <option value="SubcountyCouncillors">
                    Subcounty Councillors
                  </option>
                  <option value="SubcountySIGCouncillors">
                    Subcounty SIG Councillors
                  </option>
                </select>

                <input
                  type="text"
                  name="firstName"
                  value={oppositionCandidate.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={oppositionCandidate.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={oppositionCandidate.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="ninNumber"
                  value={oppositionCandidate.ninNumber}
                  onChange={handleInputChange}
                  placeholder="NIN Number"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="party"
                  value={oppositionCandidate.party}
                  onChange={handleInputChange}
                  placeholder="Party"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormFields()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="region"
                  value={oppositionCandidate.region}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  name="district"
                  value={oppositionCandidate.district}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
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
                {!hasCity ? (
                  <select
                    name="constituency"
                    value={oppositionCandidate.constituency || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
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
                ) : (
                  <select
                    name="municipality"
                    value={oppositionCandidate.municipality || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Municipality</option>
                    {municipalities
                      ?.filter(
                        (municipality: any) =>
                          municipality.districtId ===
                          parseInt(oppositionCandidate.district)
                      )
                      .map((municipality: any) => (
                        <option key={municipality.id} value={municipality.id}>
                          {municipality.name}
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {!hasCity ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="subcounty"
                    value={oppositionCandidate.subcounty || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
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
                    name="parish"
                    value={oppositionCandidate.parish || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
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
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="division"
                    value={oppositionCandidate.division || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Division</option>
                    {divisions
                      ?.filter(
                        (division: any) =>
                          division.municipalityId ===
                          parseInt(oppositionCandidate.municipality || "0")
                      )
                      .map((division: any) => (
                        <option key={division.id} value={division.id}>
                          {division.name}
                        </option>
                      ))}
                  </select>
                  <select
                    name="ward"
                    value={oppositionCandidate.ward || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Ward</option>
                    {wards
                      ?.filter(
                        (ward: any) =>
                          ward.divisionId ===
                          parseInt(oppositionCandidate.division || "0")
                      )
                      .map((ward: any) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!hasCity && (
                  <select
                    name="village"
                    value={oppositionCandidate.village || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
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
                )}
                {hasCity && (
                  <select
                    name="cell"
                    value={oppositionCandidate.cell || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Cell</option>
                    {cells
                      ?.filter(
                        (cell: any) =>
                          cell.wardId ===
                          parseInt(oppositionCandidate.ward || "0")
                      )
                      .map((cell: any) => (
                        <option key={cell.id} value={cell.id}>
                          {cell.name}
                        </option>
                      ))}
                  </select>
                )}
                <input
                  type="number"
                  name="vote"
                  value={oppositionCandidate.vote}
                  onChange={handleInputChange}
                  placeholder="Votes"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default SubcountyDivisionOpposition;
