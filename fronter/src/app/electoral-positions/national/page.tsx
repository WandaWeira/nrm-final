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

    // Check if the selected district has city status
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

  const [candidates, setCandidates] = useState<{
    [key: string]: Candidate[];
  }>({
    cec: [],
    leagues: [],
    presidential: [],
    sigmps: [],
    eala: [],
    speakership: [],
    parliamentaryCaucus: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add candidate data to the appropriate election type
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
            className="block w-full p -2 mt-2 border rounded-md shadow-sm focus:border-blue-500"
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
            {regions?.map((region) => (
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
                (subregion) =>
                  subregion.regionId === parseInt(candidateData.region)
              )
              .map((subregion) => (
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
                (district) =>
                  district.subregionId === parseInt(candidateData.subregion)
              )
              .map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
          </select>

          {!hasCity && (
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
                      constituency.districtId ===
                      parseInt(candidateData.district)
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
                      subcounty.constituencyId ===
                      parseInt(candidateData.constituency)
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
          )}

          {hasCity && (
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
                      municipality.districtId ===
                      parseInt(candidateData.district)
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
                      (candidateData.ward
                        ? parseInt(candidateData.ward)
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
        </div>

        {renderFormFields()}

        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600"
        >
          Submit Candidate
        </button>
      </form>

      <div className="mt-8">
        {Object.keys(candidates).map((electionKey) => (
          <div key={electionKey} className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              {electionKey.replace(/([A-Z])/g, " $1").toUpperCase()}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-2 px-4 border">NIN Number</th>
                    <th className="py-2 px-4 border">First Name</th>
                    <th className="py-2 px-4 border">Last Name</th>
                    <th className="py-2 px-4 border">Phone Number</th>
                    <th className="py-2 px-4 border">Region</th>
                    <th className="py-2 px-4 border">Subregion</th>
                    <th className="py-2 px-4 border">District</th>
                    <th className="py-2 px-4 border">Constituency</th>
                    <th className="py-2 px-4 border">Subcounty</th>
                    <th className="py-2 px-4 border">Parish</th>
                    <th className="py-2 px-4 border">Village</th>
                    <th className="py-2 px-4 border">Municipality</th>
                    <th className="py-2 px-4 border">Division</th>
                    <th className="py-2 px-4 border">Ward</th>
                    <th className="py-2 px-4 border">Cell</th>
                    {hasCategoryField(electionKey) && (
                      <th className="py-2 px-4 border">Category</th>
                    )}
                  </tr>
                </thead>
                {/* ... (rest of the code from the previous response) */}

                <tbody>
                  {candidates[electionKey].map((candidate, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-4 border">
                        {candidate.ninNumber}
                      </td>
                      <td className="py-2 px-4 border">
                        {candidate.firstName}
                      </td>
                      <td className="py-2 px-4 border">{candidate.lastName}</td>
                      <td className="py-2 px-4 border">
                        {candidate.phoneNumber}
                      </td>
                      <td className="py-2 px-4 border">{candidate.region}</td>
                      <td className="py-2 px-4 border">
                        {candidate.subregion}
                      </td>
                      <td className="py-2 px-4 border">{candidate.district}</td>
                      <td className="py-2 px-4 border">
                        {candidate.constituency}
                      </td>
                      <td className="py-2 px-4 border">
                        {candidate.subcounty}
                      </td>
                      <td className="py-2 px-4 border">{candidate.parish}</td>
                      <td className="py-2 px-4 border">{candidate.village}</td>
                      <td className="py-2 px-4 border">
                        {candidate.municipality !== undefined
                          ? candidate.municipality
                          : "-"}
                      </td>
                      <td className="py-2 px-4 border">
                        {candidate.division !== undefined
                          ? candidate.division
                          : "-"}
                      </td>
                      <td className="py-2 px-4 border">
                        {candidate.ward !== undefined ? candidate.ward : "-"}
                      </td>
                      <td className="py-2 px-4 border">
                        {candidate.cell !== undefined ? candidate.cell : "-"}
                      </td>
                      {hasCategoryField(electionKey) && (
                        <td className="py-2 px-4 border">
                          {candidate.category}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default National;
