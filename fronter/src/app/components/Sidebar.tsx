import React, { useState } from "react";
import {
  Layout,
  LucideIcon,
  Menu,
  Globe,
  Users,
  SlidersHorizontalIcon,
  ChevronDown,
  ChevronUp,
  Layers,
  PieChart,
  Folders,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

// SidebarLink component
interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollaped: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollaped,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href}>
      <div
        className={`cursor-pointer flex items-center ${
          isCollaped ? "justify-center py-4" : "justify-start px-6 py-4"
        } hover:text-yellow-500 hover:bg-yellow-100 gap-3 transition-colors ${
          isActive ? "bg-yellow-200 text-white" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" size={24} />
        <span
          className={`${
            isCollaped ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

// SidebarDropdown component
interface SidebarDropdownProps {
  label: string;
  icon: LucideIcon;
  isCollaped: boolean;
  units: string[];
  isOpen: boolean;
  toggleDropdown: () => void;
  pathname: string;
}

const SidebarDropdown = ({
  label,
  icon: Icon,
  isCollaped,
  units,
  isOpen,
  toggleDropdown,
  pathname,
}: SidebarDropdownProps) => {
  return (
    <div>
      <div
        className={`cursor-pointer flex items-center ${
          isCollaped ? "justify-center py-4" : "justify-start px-6 py-4"
        } hover:text-yellow-500 hover:bg-yellow-100 gap-3 transition-colors`}
        onClick={toggleDropdown}
      >
        <Icon className="w-6 h-6 !text-gray-700" size={24} />
        <span
          className={`${
            isCollaped ? "hidden" : "block"
          } font-medium text-gray-700`}
        >
          {label}
        </span>
        {!isCollaped && (
          <div className="ml-auto">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="ml-12 mt-2">
          {units.map((unit) => (
            <Link
              key={unit}
              href={`/${label
                .toLowerCase()
                .replace(/\s+/g, "-")}/${unit.toLowerCase()}`}
            >
              <div
                className={`p-2 hover:bg-yellow-50 text-gray-950 ${
                  pathname ===
                  `/${label
                    .toLowerCase()
                    .replace(/\s+/g, "-")}/${unit.toLowerCase()}`
                    ? "bg-yellow-200 text-white"
                    : ""
                }`}
              >
                {unit}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar component
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleSidebar = () =>
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdownLabel: string) => {
    setOpenDropdown(openDropdown === dropdownLabel ? null : dropdownLabel);
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  // Administrative Units
  const administrativeUnits = [
    "Regions",
    "Subregions",
    "Districts",
    "Constituencies-Municipalities",
    "Subcounties-Divisions",
    "Parishes-Wards",
    "Villages-Cells",
  ];

  // Electoral Positions
  const electoralPositions = [
    "National",
    "Districts",
    "Constituencies-Municipalities",
    "Subcounties-Divisions",
    "Parishes-Wards",
    "Villages-Cells",
  ];

  //Reports
  const reportUnits = ["Administrative-Units", "Electoral-Positions"];

  return (
    <div className={sidebarClassNames}>
      {/* Top logo */}
      <div
        className={`flex gap-3 justify-between md:justify-normal items-center pt-8 ${
          isSidebarCollapsed ? "px-5" : "px-8"
        }`}
      >
        <div>logo</div>
        <h1
          className={`${
            isSidebarCollapsed ? "hidden" : "block"
          } font-extrabold text-2xl`}
        >
          NRM-CMS
        </h1>
        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-yellow-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Sidebar links */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollaped={isSidebarCollapsed}
        />
        {session?.user?.role === "SuperAdmin" && (
          <SidebarLink
            href="/users"
            icon={Users}
            label="Users"
            isCollaped={isSidebarCollapsed}
          />
        )}

        <SidebarDropdown
          label="Administrative Units"
          icon={Globe}
          isCollaped={isSidebarCollapsed}
          units={administrativeUnits}
          isOpen={openDropdown === "Administrative Units"}
          toggleDropdown={() => toggleDropdown("Administrative Units")}
          pathname={pathname}
        />
        <SidebarDropdown
          label="Electoral Positions"
          icon={Layers}
          isCollaped={isSidebarCollapsed}
          units={electoralPositions}
          isOpen={openDropdown === "Electoral Positions"}
          toggleDropdown={() => toggleDropdown("Electoral Positions")}
          pathname={pathname}
        />
        <SidebarDropdown
          label="Nominated Candidates"
          icon={Users}
          isCollaped={isSidebarCollapsed}
          units={electoralPositions}
          isOpen={openDropdown === "Nominated Candidates"}
          toggleDropdown={() => toggleDropdown("Nominated Candidates")}
          pathname={pathname}
        />
        <SidebarDropdown
          label="Results"
          icon={PieChart}
          isCollaped={isSidebarCollapsed}
          units={electoralPositions}
          isOpen={openDropdown === "Results"}
          toggleDropdown={() => toggleDropdown("Results")}
          pathname={pathname}
        />
        <SidebarDropdown
          label="General"
          icon={SlidersHorizontalIcon}
          isCollaped={isSidebarCollapsed}
          units={electoralPositions}
          isOpen={openDropdown === "general"}
          toggleDropdown={() => toggleDropdown("general")}
          pathname={pathname}
        />

        <SidebarDropdown
          label="Reports"
          icon={Folders}
          isCollaped={isSidebarCollapsed}
          units={reportUnits}
          isOpen={openDropdown === "reports"}
          toggleDropdown={() => toggleDropdown("reports")}
          pathname={pathname}
        />
      </div>

      {/* Footer */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"}`}>
        <p className="text-center text-xs text-gray-500">&copy; 2024 NRM-CMS</p>
      </div>
    </div>
  );
};

export default Sidebar;
