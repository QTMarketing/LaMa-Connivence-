'use client';

/**
 * StoreMap — clustered MapLibre map of LaMa retail locations.
 *
 * WHY THIS REPLACES THE GOOGLE IFRAME
 * /stores previously embedded google.com/maps?q=...&output=embed. That could
 * never have worked:
 *   1. Google answers with `x-frame-options: SAMEORIGIN` and refuses to be
 *      framed from our origin.
 *   2. Our CSP sets no `frame-src`, so `default-src 'self'` blocks the frame
 *      on our side too.
 * The grey box was not a loading state. It was a dead embed.
 *
 * MapLibre needs no API key. Tiles come from CARTO's free positron basemap,
 * the same source mapcn's primitive defaults to.
 *
 * CLUSTERING IS NOT OPTIONAL. 96 pins across six states is an unreadable smear
 * at national zoom; clusters collapse them into counts and expand on zoom.
 *
 * Primitive vendored from mapcn to components/ui/map.tsx.
 */

import { useEffect, useMemo, useRef } from 'react';
import type { FeatureCollection, Point } from 'geojson';
import { Map, MapClusterLayer, MapControls, MapPopup, useMap } from '@/components/ui/map';
import type { Store } from '@/lib/storeData';
import { MapPin, Phone } from 'lucide-react';

/** Geographic centre of the chain, so the initial view frames all six states. */
const CENTER: [number, number] = [-97.5, 32.5];

type StoreProps = {
  id: number;
  name: string;
  address: string;
  phone: string;
};

function FlyToSelected({ store }: { store: Store | null }) {
  const { map } = useMap();
  const skipFirst = useRef(true);

  useEffect(() => {
    if (!map || !store) return;
    // The page auto-selects the first store on load so the header has a name.
    // Flying there would skip the overview of all 96 locations.
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    map.flyTo({
      center: [store.lng, store.lat],
      zoom: 14,
      duration: 800,
      essential: true,
    });
  }, [map, store]);

  return null;
}

export default function StoreMap({
  stores,
  selectedStore,
  onSelect,
}: {
  stores: Store[];
  selectedStore: Store | null;
  onSelect: (store: Store) => void;
}) {
  const byId = useMemo(
    () => Object.fromEntries(stores.map((s) => [s.id, s])) as Record<number, Store>,
    [stores],
  );

  const data = useMemo<FeatureCollection<Point, StoreProps>>(
    () => ({
      type: 'FeatureCollection',
      features: stores
        .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng))
        .map((s) => ({
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: [s.lng, s.lat] },
          properties: {
            id: s.id,
            name: s.name,
            address: s.address,
            phone: s.phone,
          },
        })),
    }),
    [stores],
  );

  return (
    <div className="relative h-full w-full">
      <Map center={CENTER} zoom={5} minZoom={3} maxZoom={17} theme="light">
        <MapControls showFullscreen showCompass />
        <FlyToSelected store={selectedStore} />

        <MapClusterLayer<StoreProps>
          data={data}
          clusterRadius={50}
          clusterMaxZoom={12}
          clusterColors={['#FFB173', '#FE6A36', '#C03F1F']}
          clusterThresholds={[5, 20]}
          pointColor="#FE6A36"
          onPointClick={(feature) => {
            const id = Number(feature.properties?.id);
            const store = Number.isFinite(id) ? byId[id] : undefined;
            if (store) onSelect(store);
          }}
        />

        {selectedStore && Number.isFinite(selectedStore.lat) && Number.isFinite(selectedStore.lng) && (
          <MapPopup
            key={selectedStore.id}
            longitude={selectedStore.lng}
            latitude={selectedStore.lat}
            closeOnClick={false}
            className="min-w-56 border-gray-200 bg-white text-secondary shadow-md"
          >
            <div className="min-w-[200px] p-1">
              <p className="text-[15px] font-bold text-secondary">{selectedStore.name}</p>
              <p className="mt-1 flex items-start gap-1.5 text-[13px] leading-snug text-gray-600">
                <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                {selectedStore.address}
              </p>
              {selectedStore.phone ? (
                <a
                  href={`tel:${selectedStore.phone.replace(/[^\d+]/g, '')}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary-dark"
                >
                  <Phone size={13} aria-hidden="true" />
                  {selectedStore.phone}
                </a>
              ) : null}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedStore.lat},${selectedStore.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-[13px] font-bold text-primary-dark"
              >
                Directions
              </a>
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  );
}
