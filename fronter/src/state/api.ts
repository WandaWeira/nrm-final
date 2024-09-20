import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// Define your models
export interface UnitModel {
  id: number;
  name: string;
}

export interface SubregionModel extends UnitModel {
  regionId: number;
  region?: UnitModel; // Contains the region object
}

// export interface DistrictModel extends UnitModel {
//   subregionId: number;
// }

export interface DistrictModel extends UnitModel {
  subregionId: number;
  hasCity: boolean;
}

export interface DistrictRegistra {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ninNumber: string;
  isActive: boolean;
}

export interface RegionalCoordinator {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ninNumber: string;
  isActive: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  ninNumber: string;
  email: string;
  password: string;
  role: string; // e.g., 'District Registrar', 'Regional Coordinator', etc.
  phoneNumber: string; 
  // address?: string; // Optional
  // createdAt?: string; // Optional
  // updatedAt?: string; // Optional
}

// 19/09/2024-----------------------START
export interface ConstituencyModel extends UnitModel {
  districtId: number;
  nrmRegistra: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    ninNumber: string;
    isActive: boolean;
  };
}

export interface MunicipalityModel extends UnitModel {
  districtId: number;
  nrmRegistra: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    ninNumber: string;
    isActive: boolean;
  };
}

export interface Registra {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ninNumber: string;
  isActive: boolean;
}

export interface ConstituencyRegistra extends Registra {
  constituencyId: number;
}

export interface MunicipalityRegistra extends Registra {
  municipalityId: number;
}
// 19/09/2024-----------------------END



// Define the API
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await getSession(); // Get the session from NextAuth

      if (session?.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: [
    'Regions', 'Subregions', 'Districts', 'Constituencies', 'Subcounties', 
    'Parishes', 'Villages', 'Divisions', 'Municipalities', 'Wards', 
    'Cells', 'Cities', 'Users', 'ConstituencyRegistrars',
    'MunicipalityRegistrars'
  ],
  endpoints: (build) => ({
    // Authentication
    // login: build.mutation<LoginResponse, LoginCredentials>({
    //   query: (credentials) => ({
    //     url: 'auth/login',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    // }),

    // Users endpoints
    getUsers: build.query<User[], void>({
      query: () => 'user/users',
      providesTags: ['Users'],
    }),
    fetchUser: build.query<User, string>({
      query: (id) => `user/users/${id}`,
    }),
    addUser: build.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: 'user/add-user',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: build.mutation<User, User>({
      query: (user) => ({
        url: `user/users/${user.id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({
        url: `user/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Regions endpoints
    getRegions: build.query<UnitModel[], void>({
      query: () => 'regions',
      providesTags: ['Regions'],
    }),
    addRegion: build.mutation<UnitModel, Partial<UnitModel>>({
      query: (newRegion) => ({
        url: 'regions',
        method: 'POST',
        body: newRegion,
      }),
      invalidatesTags: ['Regions'],
    }),
    updateRegion: build.mutation<UnitModel, UnitModel>({
      query: (updatedRegion) => ({
        url: `regions/${updatedRegion.id}`,
        method: 'PUT',
        body: updatedRegion,
      }),
      invalidatesTags: ['Regions'],
    }),
    deleteRegion: build.mutation<void, number>({
      query: (id) => ({
        url: `regions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Regions'],
    }),

    // Subregions endpoints
    getSubregions: build.query<SubregionModel[], void>({
      query: () => 'subregions',
      providesTags: ['Subregions'],
    }),
    createSubregion: build.mutation<SubregionModel, Partial<SubregionModel>>({
      query: (newSubregion) => ({
        url: '/subregions',
        method: 'POST',
        body: newSubregion,
      }),
      invalidatesTags: ['Subregions'],
    }),
    updateSubregion: build.mutation<SubregionModel, { id: number; updates: Partial<SubregionModel> }>({
      query: ({ id, updates }) => ({
        url: `/subregions/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Subregions'],
    }),
    deleteSubregion: build.mutation<void, number>({
      query: (id) => ({
        url: `/subregions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subregions'],
    }),

    // Districts endpoints
    // Districts endpoints
    getDistricts: build.query<DistrictModel[], void>({
      query: () => 'districts',
      providesTags: ['Districts'],
    }),
    createDistrict: build.mutation<DistrictModel, Partial<DistrictModel>>({
      query: (newDistrict) => ({
        url: '/districts',
        method: 'POST',
        body: newDistrict,
      }),
      invalidatesTags: ['Districts'],
    }),
    updateDistrict: build.mutation<DistrictModel, { id: number; updates: Partial<DistrictModel> }>({
      query: ({ id, updates }) => ({
        url: `/districts/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Districts'],
    }),
    deleteDistrict: build.mutation<void, number>({
      query: (id) => ({
        url: `/districts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Districts'],
    }),

    // District Registrars endpoints
    getDistrictRegistras: build.query<DistrictRegistra[], number>({
      query: (districtId) => `districts/${districtId}/registrars`,
    }),
    createDistrictRegistra: build.mutation<void, { districtId: number; registra: Partial<DistrictRegistra> }>({
      query: ({ districtId, registra }) => ({
        url: `districts/${districtId}/registrars`,
        method: 'POST',
        body: registra,
      }),
    }),
    updateDistrictRegistra: build.mutation<void, { districtId: number; id: number; updates: Partial<DistrictRegistra> }>({
      query: ({ districtId, id, updates }) => ({
        url: `districts/${districtId}/registrars/${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
    deleteDistrictRegistra: build.mutation<void, { districtId: number; id: number }>({
      query: ({ districtId, id }) => ({
        url: `districts/${districtId}/registrars/${id}`,
        method: 'DELETE',
      }),
    }),

    // 19/09/2024-----------------------START
    createConstituency: build.mutation<ConstituencyModel, Partial<ConstituencyModel>>({
      query: (newConstituency) => ({
        url: '/constituencies',
        method: 'POST',
        body: newConstituency,
      }),
      invalidatesTags: ['Constituencies'],
    }),
    updateConstituency: build.mutation<ConstituencyModel, { id: number; updates: Partial<ConstituencyModel> }>({
      query: ({ id, updates }) => ({
        url: `/constituencies/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Constituencies'],
    }),
    deleteConstituency: build.mutation<void, number>({
      query: (id) => ({
        url: `/constituencies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Constituencies'],
    }),
    getConstituencyRegistras: build.query<Registra[], number>({
      query: (constituencyId) => `constituencies/${constituencyId}/registrars`,
      providesTags: ['ConstituencyRegistrars'],
    }),
    createConstituencyRegistra: build.mutation<void, { constituencyId: number; registra: Partial<Registra> }>({
      query: ({ constituencyId, registra }) => ({
        url: `constituencies/${constituencyId}/registrars`,
        method: 'POST',
        body: registra,
      }),
      invalidatesTags: ['ConstituencyRegistrars'],
    }),
    updateConstituencyRegistra: build.mutation<void, { constituencyId: number; id: number; updates: Partial<Registra> }>({
      query: ({ constituencyId, id, updates }) => ({
        url: `constituencies/${constituencyId}/registrars/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['ConstituencyRegistrars'],
    }),
    deleteConstituencyRegistra: build.mutation<void, { constituencyId: number; id: number }>({
      query: ({ constituencyId, id }) => ({
        url: `constituencies/${constituencyId}/registrars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ConstituencyRegistrars'],
    }),

    // Municipalities endpoints
  
    createMunicipality: build.mutation<MunicipalityModel, Partial<MunicipalityModel>>({
      query: (newMunicipality) => ({
        url: '/municipalities',
        method: 'POST',
        body: newMunicipality,
      }),
      invalidatesTags: ['Municipalities'],
    }),
    updateMunicipality: build.mutation<MunicipalityModel, { id: number; updates: Partial<MunicipalityModel> }>({
      query: ({ id, updates }) => ({
        url: `/municipalities/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Municipalities'],
    }),
    deleteMunicipality: build.mutation<void, number>({
      query: (id) => ({
        url: `/municipalities/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Municipalities'],
    }),
    getMunicipalityRegistras: build.query<Registra[], number>({
      query: (municipalityId) => `municipalities/${municipalityId}/registrars`,
      providesTags: ['MunicipalityRegistrars'],
    }),
    createMunicipalityRegistra: build.mutation<void, { municipalityId: number; registra: Partial<Registra> }>({
      query: ({ municipalityId, registra }) => ({
        url: `municipalities/${municipalityId}/registrars`,
        method: 'POST',
        body: registra,
      }),
      invalidatesTags: ['MunicipalityRegistrars'],
    }),
    updateMunicipalityRegistra: build.mutation<void, { municipalityId: number; id: number; updates: Partial<Registra> }>({
      query: ({ municipalityId, id, updates }) => ({
        url: `municipalities/${municipalityId}/registrars/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['MunicipalityRegistrars'],
    }),
    deleteMunicipalityRegistra: build.mutation<void, { municipalityId: number; id: number }>({
      query: ({ municipalityId, id }) => ({
        url: `municipalities/${municipalityId}/registrars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MunicipalityRegistrars'],
    }),

    // 19/09/2024-----------------------END

    // Regional Coordinators endpoints
    // getRegionalCoordinatorsInSubregion: build.query<RegionalCoordinator[], number>({
    //   query: (subregionId) => `/subregions/${subregionId}/regionalCoordinators`,
    // }),
    createRegionalCoordinatorInSubregion: build.mutation<RegionalCoordinator, { subregionId: number; coordinator: Partial<RegionalCoordinator> }>({
      query: ({ subregionId, coordinator }) => ({
        url: `/subregions/${subregionId}/regionalCoordinators`,
        method: 'POST',
        body: coordinator,
      }),
    }),

      // Regional Coordinator endpoints
      getRegionalCoordinatorsInSubregion: build.query<RegionalCoordinator[], number>({
        query: (subregionId) => `subregions/${subregionId}/regionalCoordinators`,
      }),
      createRegionalCoordinator: build.mutation<void, { subregionId: number; coordinator: Partial<RegionalCoordinator> }>({
        query: ({ subregionId, coordinator }) => ({
          url: `subregions/${subregionId}/regionalCoordinators`,
          method: 'POST',
          body: coordinator,
        }),
      }),
      updateRegionalCoordinator: build.mutation<void, { subregionId: number; id: number; updates: Partial<RegionalCoordinator> }>({
        query: ({ subregionId, id, updates }) => ({
          url: `subregions/${subregionId}/regionalCoordinators/${id}`,
          method: 'PUT',
          body: updates,
        }),
      }),
      deleteRegionalCoordinator: build.mutation<void, { subregionId: number; id: number }>({
        query: ({ subregionId, id }) => ({
          url: `subregions/${subregionId}/regionalCoordinators/${id}`,
          method: 'DELETE',
        }),
      }),

    // Other endpoints
    // getDistricts: build.query<UnitModel[], void>({
    //   query: () => 'districts',
    //   providesTags: ['Districts'],
    // }),
    getConstituencies: build.query<UnitModel[], void>({
      query: () => 'constituencies',
      providesTags: ['Constituencies'],
    }),
    getSubcounties: build.query<UnitModel[], void>({
      query: () => 'subcounties',
      providesTags: ['Subcounties'],
    }),
    getParishes: build.query<UnitModel[], void>({
      query: () => 'parishes',
      providesTags: ['Parishes'],
    }),
    getVillages: build.query<UnitModel[], void>({
      query: () => 'villages',
      providesTags: ['Villages'],
    }),
    getDivisions: build.query<UnitModel[], void>({
      query: () => 'divisions',
      providesTags: ['Divisions'],
    }),
    getMunicipalities: build.query<UnitModel[], void>({
      query: () => 'municipalities',
      providesTags: ['Municipalities'],
    }),
    getWards: build.query<UnitModel[], void>({
      query: () => 'wards',
      providesTags: ['Wards'],
    }),
    getCells: build.query<UnitModel[], void>({
      query: () => 'cells',
      providesTags: ['Cells'],
    }),
    getCities: build.query<UnitModel[], void>({
      query: () => 'districts/cities',
      providesTags: ['Cities'],
    }),





  }),
});

// Export hooks
export const { 
  // useLoginMutation,
  useGetUsersQuery,
  useFetchUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRegionsQuery,
  useAddRegionMutation,
  useUpdateRegionMutation,
  useDeleteRegionMutation,
  useGetSubregionsQuery,
  // useGetSubregionByIdQuery,
  useCreateSubregionMutation,
  useUpdateSubregionMutation,
  useDeleteSubregionMutation,
  // useGetDistrictsInSubregionQuery,
  // useCreateDistrictInSubregionMutation,
  useGetRegionalCoordinatorsInSubregionQuery,
  useCreateRegionalCoordinatorInSubregionMutation,
  // useGetDistrictsQuery,
  useGetConstituenciesQuery,
  useGetSubcountiesQuery,
  useGetParishesQuery,
  useGetVillagesQuery,
  useGetDivisionsQuery,
  useGetMunicipalitiesQuery,
  useGetWardsQuery,
  useGetCellsQuery,
  useGetCitiesQuery,
  useCreateRegionalCoordinatorMutation,
  useUpdateRegionalCoordinatorMutation,
  useDeleteRegionalCoordinatorMutation,
  useGetDistrictsQuery,
  useCreateDistrictMutation,
  useUpdateDistrictMutation,
  useDeleteDistrictMutation,
  useGetDistrictRegistrasQuery,
  useCreateDistrictRegistraMutation,
  useUpdateDistrictRegistraMutation,
  useDeleteDistrictRegistraMutation,


  useCreateConstituencyMutation,
  useUpdateConstituencyMutation,
  useDeleteConstituencyMutation,
  useCreateMunicipalityMutation,
  useUpdateMunicipalityMutation,
  useDeleteMunicipalityMutation,

  useGetConstituencyRegistrasQuery,
  useCreateConstituencyRegistraMutation,
  useUpdateConstituencyRegistraMutation,
  useDeleteConstituencyRegistraMutation,
  useGetMunicipalityRegistrasQuery,
  useCreateMunicipalityRegistraMutation,
  useUpdateMunicipalityRegistraMutation,
  useDeleteMunicipalityRegistraMutation,
} = api;
