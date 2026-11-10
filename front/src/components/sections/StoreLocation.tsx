import { ArrowUpRight, MapPin, Navigation } from "lucide-react";

export default function StoreLocation({
  address,
  mapsUrl,
}: {
  address: string;
  mapsUrl?: string;
}) {
  if (!address.trim()) return null;

  const query = encodeURIComponent(address.trim());
  const destination = mapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <aside className="container store-location" aria-label="Localização da TOP3D">
      <div className="store-location-map" aria-hidden="true">
        <iframe
          src={`https://maps.google.com/maps?q=${query}&z=16&output=embed`}
          title="Mapa da localização da TOP3D"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
        />
      </div>
      <div className="store-location-copy">
        <span className="eyebrow"><MapPin size={14} /> NOSSA LOJA</span>
        <h2>Encontre a TOP3D</h2>
        <p>{address}</p>
      </div>
      <a
        className="store-location-link"
        href={destination}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Como chegar à TOP3D: ${address}. Abrir no Google Maps`}
      >
        <Navigation size={18} />
        Como chegar
        <ArrowUpRight size={17} />
      </a>
    </aside>
  );
}
