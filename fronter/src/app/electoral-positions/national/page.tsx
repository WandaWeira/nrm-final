"use client";
import React, { useState } from "react";
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
} from "@/state/api";

interface Candidate {
  ninNumber: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  category?: string;
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
}

const National: React.FC = () => {
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

  const [electionType, setElectionType] = useState("");
  const [candidateData, setCandidateData] = useState<Candidate>({
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
    municipality: undefined,
    division: undefined,
    ward: undefined,
    cell: undefined,
  });
  const [hasCity, setHasCity] = useState(false);
  const [candidates, setCandidates] = useState<{ [key: string]: Candidate[] }>({
    cec: [],
    leagues: [],
    presidential: [],
    sigmps: [],
    eala: [],
    speakership: [],
    parliamentaryCaucus: [],
  });

  const categoryOptions = {
    cec: [
      "Chairman",
      "Vice Chairman",
      "2nd Vice Chairman",
      "Vice Chairman Karamoja Region",
      "Vice Chairman Eastern Region",
      "Vice Chairman Northern Region",
      "Vice Chairman Central Region",
      "Vice Chairman Kampala Region",
      "Vice Chairman Western Region",
    ],
    leagues: [
      "Elders",
      "Youth",
      "Women",
      "PWDS",
      "Veterans",
      "Workers",
      "Entrepreneurs",
      "Historicals",
      "Diaspora",
      "Institutions",
    ],
    sigmps: ["Workers MP", "PEDS MP", "YOUTH MP", "OLDER PERSONS MP"],
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCandidateData({
      ...candidateData,
      [name]: value === "" ? undefined : value,
    });

    if (name === "district") {
      const selectedDistrict = districts?.find(
        (d) => d.id.toString() === value
      );
      setHasCity(selectedDistrict?.hasCity || false);
    }
  };

  const handleElectionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setElectionType(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidates((prev) => ({
      ...prev,
      [electionType]: [...prev[electionType], candidateData],
    }));
    setCandidateData({
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
      municipality: undefined,
      division: undefined,
      ward: undefined,
      cell: undefined,
    });
  };

  const renderFormFields = () => {
    switch (electionType) {
      case "cec":
      case "leagues":
      case "sigmps":
        return (
          <select
            className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
            name="category"
            value={candidateData.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            {categoryOptions[electionType as keyof typeof categoryOptions].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </select>
        );
      default:
        return null;
    }
  };

  const hasCategoryField = (type: string) => {
    return type === "cec" || type === "leagues" || type === "sigmps";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        National Elections Candidate Information
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <ElectionTypeSelector
          electionType={electionType}
          handleElectionTypeChange={handleElectionTypeChange}
        />

        <CandidateInfoFields
          candidateData={candidateData}
          handleInputChange={handleInputChange}
          regions={regions}
          subregions={subregions}
          districts={districts}
        />

        {!hasCity && (
          <NonCityFields
            candidateData={candidateData}
            handleInputChange={handleInputChange}
            constituencies={constituencies}
            subcounties={subcounties}
            parishes={parishes}
            villages={villages}
            electionType={electionType}
          />
        )}

        {hasCity && (
          <CityFields
            candidateData={candidateData}
            handleInputChange={handleInputChange}
            municipalities={municipalities}
            divisions={divisions}
            wards={wards}
            cells={cells}
          />
        )}

        {renderFormFields()}

        <SubmitButton />
      </form>

      <CandidatesTables
        candidates={candidates}
        hasCategoryField={hasCategoryField}
      />
    </div>
  );
};

const ElectionTypeSelector = ({
  electionType,
  handleElectionTypeChange,
}: {
  electionType: string;
  handleElectionTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      Election Type
    </label>
    <select
      className="block w-full mt-1 p-2 border rounded-md shadow-sm focus:border-blue-500"
      name="electionType"
      value={electionType}
      onChange={handleElectionTypeChange}
    >
      <option value="">Select Election Type</option>
      <option value="cec">CEC Elections</option>
      <option value="leagues">Chairman of Leagues</option>
      <option value="presidential">Presidential Elections</option>
      <option value="sigmps">SIG MPs Elections</option>
      <option value="eala">EALA Elections</option>
      <option value="speakership">Speakership Elections</option>
      <option value="parliamentaryCaucus">
        Parliamentary Caucus Elections
      </option>
    </select>
  </div>
);

const CandidateInfoFields = ({
  candidateData,
  handleInputChange,
  regions,
  subregions,
  districts,
}: {
  candidateData: Candidate;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  regions: any;
  subregions: any;
  districts: any;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="ninNumber"
      placeholder="NIN Number"
      value={candidateData.ninNumber}
      onChange={handleInputChange}
    />
    <input
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="firstName"
      placeholder="First Name"
      value={candidateData.firstName}
      onChange={handleInputChange}
    />
    <input
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="lastName"
      placeholder="Last Name"
      value={candidateData.lastName}
      onChange={handleInputChange}
    />
    <input
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="phoneNumber"
      placeholder="Phone Number"
      value={candidateData.phoneNumber}
      onChange={handleInputChange}
    />
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="region"
      value={candidateData.region}
      onChange={handleInputChange}
    >
      <option value="">Select Region</option>
      {regions?.map((region: any) => (
        <option key={region.id} value={region.id}>
          {region.name}
        </option>
      ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="subregion"
      value={candidateData.subregion}
      onChange={handleInputChange}
    >
      <option value="">Select Subregion</option>
      {subregions
        ?.filter(
          (subregion: any) =>
            subregion.regionId === parseInt(candidateData.region)
        )
        .map((subregion: any) => (
          <option key={subregion.id} value={subregion.id}>
            {subregion.name}
          </option>
        ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="district"
      value={candidateData.district}
      onChange={handleInputChange}
    >
      <option value="">Select District</option>
      {districts
        ?.filter(
          (district: any) =>
            district.subregionId === parseInt(candidateData.subregion)
        )
        .map((district: any) => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
    </select>
  </div>
);

const NonCityFields = ({
  candidateData,
  handleInputChange,
  constituencies,
  subcounties,
  parishes,
  villages,
  electionType,
}: {
  candidateData: Candidate;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  constituencies: any;
  subcounties: any;
  parishes: any;
  villages: any;
  electionType: string;
}) => (
  <>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="constituency"
      value={candidateData.constituency}
      onChange={handleInputChange}
    >
      <option value="">Select Constituency</option>
      {constituencies
        ?.filter(
          (constituency: any) =>
            constituency.districtId === parseInt(candidateData.district)
        )
        .map((constituency: any) => (
          <option key={constituency.id} value={constituency.id}>
            {constituency.name}
          </option>
        ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="subcounty"
      value={candidateData.subcounty}
      onChange={handleInputChange}
    >
      <option value="">Select Subcounty</option>
      {subcounties
        ?.filter(
          (subcounty: any) =>
            subcounty.constituencyId === parseInt(candidateData.constituency)
        )
        .map((subcounty: any) => (
          <option key={subcounty.id} value={subcounty.id}>
            {subcounty.name}
          </option>
        ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="parish"
      value={candidateData.parish}
      onChange={handleInputChange}
    >
      <option value="">Select Parish</option>
      {parishes
        ?.filter(
          (parish: any) =>
            parish.subcountyId === parseInt(candidateData.subcounty)
        )
        .map((parish: any) => (
          <option key={parish.id} value={parish.id}>
            {parish.name}
          </option>
        ))}
    </select>
    {electionType !== "presidential" && (
      <select
        className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
        name="village"
        value={candidateData.village}
        onChange={handleInputChange}
      >
        <option value="">Select Village</option>
        {villages
          ?.filter(
            (village: any) =>
              village.parishId === parseInt(candidateData.parish)
          )
          .map((village: any) => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
      </select>
    )}
  </>
);

const CityFields = ({
  candidateData,
  handleInputChange,
  municipalities,
  divisions,
  wards,
  cells,
}: {
  candidateData: Candidate;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  municipalities: any;
  divisions: any;
  wards: any;
  cells: any;
}) => (
  <>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="municipality"
      value={candidateData.municipality || ""}
      onChange={handleInputChange}
    >
      <option value="">Select Municipality</option>
      {municipalities
        ?.filter(
          (municipality: any) =>
            municipality.districtId === parseInt(candidateData.district)
        )
        .map((municipality: any) => (
          <option key={municipality.id} value={municipality.id.toString()}>
            {municipality.name}
          </option>
        ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="division"
      value={candidateData.division || ""}
      onChange={handleInputChange}
    >
      <option value="">Select Division</option>
      {divisions
        ?.filter(
          (division: any) =>
            division.municipalityId ===
            (candidateData.municipality
              ? parseInt(candidateData.municipality)
              : undefined)
        )
        .map((division: any) => (
          <option key={division.id} value={division.id.toString()}>
            {division.name}
          </option>
        ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="ward"
      value={candidateData.ward || ""}
      onChange={handleInputChange}
    >
      <option value="">Select Ward</option>
      {wards
        ?.filter(
          (ward: any) =>
            ward.divisionId ===
            (candidateData.division
              ? parseInt(candidateData.division)
              : undefined)
        )
        .map((ward: any) => (
          <option key={ward.id} value={ward.id.toString()}>
            {ward.name}
          </option>
        ))}
    </select>
    <select
      className="block w-full p-2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
      name="cell"
      value={candidateData.cell || ""}
      onChange={handleInputChange}
    >
      <option value="">Select Cell</option>
      {cells
        ?.filter(
          (cell: any) =>
            cell.wardId ===
            (candidateData.ward ? parseInt(candidateData.ward) : undefined)
        )
        .map((cell: any) => (
          <option key={cell.id} value={cell.id.toString()}>
            {cell.name}
          </option>
        ))}
    </select>
  </>
);

const SubmitButton = () => (
  <button
    type="submit"
    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600"
  >
    Submit Candidate
  </button>
);

const CandidatesTables = ({
  candidates,
  hasCategoryField,
}: {
  candidates: { [key: string]: Candidate[] };
  hasCategoryField: (type: string) => boolean;
}) => {
  const electionTypes = Object.keys(candidates);
  const [activeTab, setActiveTab] = useState(electionTypes[0]);

  return (
    <div className="mt-8">
      <div className="mb-4">
        <div className="sm:hidden">
          <select
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {electionTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {electionTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`${
                  activeTab === type
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700'
                } rounded-md px-3 py-2 text-sm font-medium`}
              >
                {type.replace(/([A-Z])/g, ' $1').toUpperCase()}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-4">
          {activeTab.replace(/([A-Z])/g, ' $1').toUpperCase()} Candidates
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIN</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                {hasCategoryField(activeTab) && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates[activeTab].map((candidate, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{candidate.firstName} {candidate.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{candidate.ninNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{candidate.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{candidate.district}, {candidate.constituency}</div>
                  </td>
                  {hasCategoryField(activeTab) && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{candidate.category}</div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default National;