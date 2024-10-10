"use client"
import React, {  useState, useMemo, use } from "react";
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
  const [activeTab, setActiveTab] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [oppositionCandidate, setOppositionCandidate] = useState<OppositionCandidate>({
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

  const [createOppositionCandidate] = useCreateNationalOppositionCandidateMutation();

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

  const getName = (id: string | undefined, dataArray: any[] | undefined) => {
    if (!id || !dataArray) return "";
    const item = dataArray.find((item) => item.id.toString() === id.toString());
    return item ? item.name : "";
  };

  const getLocationName = (
    candidate: Candidate,
    cityField: keyof Candidate,
    ruralField: keyof Candidate,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOppositionCandidate(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOppositionCandidate(oppositionCandidate).unwrap();
      alert("Opposition candidate added successfully!");
      setIsPopupOpen(false);
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
      console.error("Failed to add opposition candidate:", error);
      alert("Failed to add opposition candidate. Please try again.");
    }
  };

  const renderWinnerTable = (winner: Candidate, category: string) => {
    return (
      <div
        key={`${winner.nationalElectionType}-${category}`}
        className="mb-8 overflow-x-auto"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{category}</h3>
          <button
            onClick={() => {
              setCurrentCategory(category);
              setIsPopupOpen(true);
              setOppositionCandidate(prev => ({
                ...prev,
                nationalElectionType: winner.nationalElectionType,
                category: category,
              }));
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Opposition
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="bg-yellow-100">
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {winner.firstName} {winner.lastName}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">{winner.ninNumber}</div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {winner.phoneNumber}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {getName(winner.region, regions)}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {getName(winner.subregion, subregions)}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {getName(winner.district, districts)}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {getLocationName(
                    winner,
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
                    winner,
                    "division",
                    "subcounty",
                    divisions,
                    subcounties
                  )}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {getLocationName(winner, "ward", "parish", wards, parishes)}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {getLocationName(winner, "cell", "village", cells, villages)}
                </div>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="text-sm text-gray-500">{winner.vote}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

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
            ([category, winner]) => renderWinnerTable(winner, category)
          )}
        </>
      ) : (
        Object.entries(sortedGroupedWinners).map(([type, winners]) => (
          <div key={type}>
            <h2 className="text-xl font-bold mb-4">{type}</h2>
            {Object.entries(winners).map(([category, winner]) =>
              renderWinnerTable(winner, category)
            )}
          </div>
        ))
      )}

      {/* Popup for adding opposition candidate */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Add Opposition Candidate for {currentCategory}</h3>
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
                  ?.filter((subregion: any) => subregion.regionId === parseInt(oppositionCandidate.region))
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
                  ?.filter((district: any) => district.subregionId === parseInt(oppositionCandidate.subregion))
                  .map((district: any) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
              </select>
              <select
                name="constituency"
                value={oppositionCandidate.constituency || ""}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
              >
                <option value="">Select Constituency</option>
                {constituencies
                  ?.filter((constituency: any) => constituency.districtId === parseInt(oppositionCandidate.district))
                  .map((constituency: any) => (
                    <option key={constituency.id} value={constituency.id}>
                      {constituency.name}
                    </option>
                  ))}
              </select>
              <select
                name="subcounty"
                value={oppositionCandidate.subcounty || ""}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
              >
                <option value="">Select Subcounty</option>
                {subcounties
                  ?.filter((subcounty: any) => subcounty.constituencyId === parseInt(oppositionCandidate.constituency || "0"))
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
                className="mb-2 w-full p-2 border rounded"
              >
                <option value="">Select Parish</option>
                {parishes
                  ?.filter((parish: any) => parish.subcountyId === parseInt(oppositionCandidate.subcounty || "0"))
                  .map((parish: any) => (
                    <option key={parish.id} value={parish.id}>
                      {parish.name}
                    </option>
                  ))}
              </select>
              <select
                name="village"
                value={oppositionCandidate.village || ""}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
              >
                <option value="">Select Village</option>
                {villages
                  ?.filter((village: any) => village.parishId === parseInt(oppositionCandidate.parish || "0"))
                  .map((village: any) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
              </select>
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
                  Add Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
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