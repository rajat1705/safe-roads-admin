import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Home = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({ state: "", city: "" });
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [locationError, setLocationError] = useState(null); 


    useEffect(() => {
        fetch(
            "https://road-safety-backend-862776753006.asia-south1.run.app/api/config/fetch-states"
        )
            .then((res) => res.json())
            .then((data) => {
                setStates(Array.isArray(data.data) ? data.data : []);
            })
            .catch((err) => {
                console.error("Error fetching states:", err);
                setStates([]);
            });
    }, []);

    useEffect(() => {
        if (filters.state) {
            fetch(
                `https://road-safety-backend-862776753006.asia-south1.run.app/api/config/fetch-cities?state=${filters.state}`
            )
                .then((res) => res.json())
                .then((data) => {
                    console.log("Fetched cities:", data);
                    setCities(Array.isArray(data.data) ? data.data : []);
                })
                .catch((err) => {
                    console.error("Error fetching cities:", err);
                    setCities([]);
                });
        } else {
            setCities([]);
        }
    }, [filters.state]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                    setLocationError(null); 
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setLocation({ lat: null, lon: null });
                    let errorMessage = "An error occurred while retrieving your location.";

                    if (error.code === 1) {
                        errorMessage = "You have denied location access.  Please enable location permissions for this site in your browser settings to use this feature.";
                    } else if (error.code === 2) {
                        errorMessage = "Location services are unavailable.  Please ensure location services are enabled in your browser/device settings.";
                    } else if (error.code === 3) {
                        errorMessage = "Location request timed out. Please try again.";
                    }
                    setLocationError(errorMessage); 
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser.");
        }
    }, []);

    const handleSearch = () => {
        console.log("Searching reports for:", filters);
        navigate("/ReportsPage", { state: filters });
    };

    return (
        <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-[2fr_3fr] overflow-hidden">
            <div className="flex flex-col justify-center items-center lg:items-start p-10 bg-gray-100">
                <h1 className="text-5xl font-bold text-gray-800 text-center lg:text-left">
                    Safe-Roads
                </h1>
                <p className="text-lg text-gray-600 mt-2 text-center lg:text-left">
                    Report and track local issues in your area
                </p>

                <Card className="w-full max-w-lg shadow-lg bg-white p-6 rounded-lg mt-6">
                    <CardTitle className="text-2xl font-semibold text-center mb-4">
                        Find Reports in Your Area
                    </CardTitle>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                onValueChange={(value) =>
                                    setFilters({ ...filters, state: value, city: "" })
                                }>
                                <SelectTrigger className="w-full p-3 border rounded-md">
                                    <SelectValue placeholder="Select State" />
                                </SelectTrigger>
                                <SelectContent>
                                    {states.map((state) => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                onValueChange={(value) =>
                                    setFilters({ ...filters, city: value })
                                }
                                disabled={!filters.state}>
                                <SelectTrigger className="w-full p-3 border rounded-md">
                                    <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full p-3 rounded-md"
                            onClick={handleSearch}>
                            Search Reports
                        </Button>
                    </CardContent>
                </Card>

                <div className="mt-6">
                    <Button
                        variant="outline"
                        className="p-3 rounded-md"
                        onClick={() =>
                            (window.location.href = "https://safe-roads.vercel.app/")
                        }>
                        Report a New Issue
                    </Button>
                </div>
            </div>

            <div className="w-full h-full">
                {locationError ? (
                    <p className="flex items-center justify-center h-full text-gray-600">
                        {locationError}
                    </p>
                ) : location.lat && location.lon ? (
                    <MapContainer
                        center={[location.lat, location.lon]}
                        zoom={13}
                        className="w-full h-full">
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.lat, location.lon]}>
                            <Popup>You are here</Popup>
                        </Marker>
                    </MapContainer>
                ) : (
                    <p className="flex items-center justify-center h-full text-gray-600">
                        Fetching location...
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;