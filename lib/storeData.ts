export interface Store {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
}

export const stores: Store[] = [
  {
    id: 1,
    name: 'LaMa Downtown',
    address: '123 Main Street, Downtown, CA 90210',
    lat: 34.0522,
    lng: -118.2437,
    phone: '(555) 123-4567',
    hours: 'Mon-Sun: 6:00 AM - 11:00 PM',
  },
  {
    id: 2,
    name: 'LaMa Westside',
    address: '456 Ocean Avenue, Westside, CA 90210',
    lat: 34.0522,
    lng: -118.2437,
    phone: '(555) 234-5678',
    hours: 'Mon-Sun: 6:00 AM - 11:00 PM',
  },
  {
    id: 3,
    name: 'LaMa Eastside',
    address: '789 Park Boulevard, Eastside, CA 90210',
    lat: 34.0522,
    lng: -118.2437,
    phone: '(555) 345-6789',
    hours: 'Mon-Sun: 6:00 AM - 11:00 PM',
  },
];

// Helper function to get store by ID
export function getStoreById(id: number): Store | undefined {
  return stores.find(store => store.id === id);
}

// Helper function to get all stores
export function getAllStores(): Store[] {
  return stores;
}
