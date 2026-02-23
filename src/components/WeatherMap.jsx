import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { Layers, MapPin, Maximize2 } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
};

const WeatherMap = ({ lat, lon, city }) => {
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const position = [lat, lon];

    // Layers: clouds_new, precipitation_new, pressure_new, wind_new, temp_new
    const overlayLayer = 'clouds_new';
    const tileLayerUrl = `https://tile.openweathermap.org/map/${overlayLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[2.5rem] overflow-hidden border border-white/20 relative group"
            style={{ height: '400px' }}
        >
            <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Layers size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Satellite Overlay</span>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <MapPin size={16} className="text-pink-400" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{city}</span>
                </div>
            </div>

            <div className="absolute top-6 right-6 z-[1000]">
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 p-3 rounded-2xl text-white transition-all active:scale-95">
                    <Maximize2 size={18} />
                </button>
            </div>

            <MapContainer
                center={position}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', borderRadius: '2.5rem' }}
                zoomControl={false}
            >
                <ChangeView center={position} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <TileLayer
                    url={tileLayerUrl}
                    attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
                />
                <Marker position={position}>
                    <Popup>
                        <div className="font-bold">{city}</div>
                    </Popup>
                </Marker>
            </MapContainer>

            <div className="absolute bottom-6 left-6 right-6 z-[1000] flex justify-between items-center pointer-events-none">
                <div className="flex gap-2">
                    {['clouds', 'precip', 'temp', 'wind'].map((l) => (
                        <div key={l} className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-white/70 uppercase tracking-tighter">
                            {l}
                        </div>
                    ))}
                </div>
                <p className="text-[10px] text-white/40 font-medium italic">Interactive Weather Engine</p>
            </div>
        </motion.div>
    );
};

export default WeatherMap;
