"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Login from "@/app/login/page";
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

interface SummaryCardProps {
  title: string;
  value: string | number;
  isLoading: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  isLoading,
}) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="mt-2">
      {isLoading ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      ) : (
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { data: session, status } = useSession();

  const { data: regions, isLoading: isLoadingRegions } = useGetRegionsQuery();
  const { data: subregions, isLoading: isLoadingSubregions } =
    useGetSubregionsQuery();
  const { data: districts, isLoading: isLoadingDistricts } =
    useGetDistrictsQuery();
  const { data: constituencies, isLoading: isLoadingConstituencies } =
    useGetConstituenciesQuery();
  const { data: subcounties, isLoading: isLoadingSubcounties } =
    useGetSubcountiesQuery();
  const { data: parishes, isLoading: isLoadingParishes } =
    useGetParishesQuery();
  const { data: villages, isLoading: isLoadingVillages } =
    useGetVillagesQuery();
  const { data: municipalities, isLoading: isLoadingMunicipalities } =
    useGetMunicipalitiesQuery();
  const { data: divisions, isLoading: isLoadingDivisions } =
    useGetDivisionsQuery();
  const { data: wards, isLoading: isLoadingWards } = useGetWardsQuery();
  const { data: cells, isLoading: isLoadingCells } = useGetCellsQuery();

  useEffect(() => {
    // You can add any side effects here if needed
  }, [status]);

  if (status === "loading") {
    return <p className="text-center mt-8">Loading session...</p>;
  }

  if (status === "authenticated" && session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Administrative Units Summary
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <SummaryCard
            title="Regions"
            value={regions?.length ?? 0}
            isLoading={isLoadingRegions}
          />
          <SummaryCard
            title="Subregions"
            value={subregions?.length ?? 0}
            isLoading={isLoadingSubregions}
          />
          <SummaryCard
            title="Districts"
            value={districts?.length ?? 0}
            isLoading={isLoadingDistricts}
          />
          <SummaryCard
            title="Constituencies"
            value={constituencies?.length ?? 0}
            isLoading={isLoadingConstituencies}
          />
          <SummaryCard
            title="Subcounties"
            value={subcounties?.length ?? 0}
            isLoading={isLoadingSubcounties}
          />
          <SummaryCard
            title="Parishes"
            value={parishes?.length ?? 0}
            isLoading={isLoadingParishes}
          />
          <SummaryCard
            title="Villages"
            value={villages?.length ?? 0}
            isLoading={isLoadingVillages}
          />
          <SummaryCard
            title="Municipalities"
            value={municipalities?.length ?? 0}
            isLoading={isLoadingMunicipalities}
          />
          <SummaryCard
            title="Divisions"
            value={divisions?.length ?? 0}
            isLoading={isLoadingDivisions}
          />
          <SummaryCard
            title="Wards"
            value={wards?.length ?? 0}
            isLoading={isLoadingWards}
          />
          <SummaryCard
            title="Cells"
            value={cells?.length ?? 0}
            isLoading={isLoadingCells}
          />
        </div>
      </div>
    );
  }

  return <Login />; // Fallback if unauthenticated
}
