import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import { markFeatureUsed } from "../services/dashboardApi";
import { useTranslation } from "react-i18next"; // ✅

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import {
  MapPin,
  Star,
  IndianRupee,
  GraduationCap,
  ArrowLeft
} from "lucide-react";

import L from "leaflet";
import { useParams, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import "../styles/collegeMap.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ✅ Default Icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
L.Marker.prototype.options.icon = DefaultIcon;


// 🚀 Fly to selected college
function FlyToCollege({ selectedCollege }) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedCollege &&
      selectedCollege.lat !== undefined &&
      selectedCollege.lng !== undefined
    ) {
      map.flyTo([selectedCollege.lat, selectedCollege.lng], 12, {
        duration: 2
      });
    }
  }, [selectedCollege, map]);

  return null;
}

function CollegeMapPage({ user, setUser }) {
  const { t } = useTranslation(); // ✅ same as Hero
  const { id } = useParams();

  const [center, setCenter] = useState([20.5937, 78.9629]);
  const [zoom, setZoom] = useState(5);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    markFeatureUsed().catch((err) => {
      console.error("Feature usage tracking failed:", err);
    });
  }, []);

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(`/api/colleges/${id}`)
      .then((res) => {
        setSelectedCollege(res.data);
      })
      .catch((err) => {
        console.error("Error fetching college:", err);
      });
  }, [id]);

  useEffect(() => {
    if (
      selectedCollege &&
      selectedCollege.lat !== undefined &&
      selectedCollege.lng !== undefined
    ) {
      setCenter([selectedCollege.lat, selectedCollege.lng]);
      setZoom(10);
    } else {
      setCenter([20.5937, 78.9629]);
      setZoom(5);
    }
  }, [selectedCollege]);

  return (
    <>
      <div className="map-page">

        <div className="top-bar">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} /> {t("collegeMap.back", "Back")}
          </button>
        </div>

        <div className="map-container">

          {/* LEFT → MAP */}
          <div
            className="map-left"
            onWheel={(e) => e.stopPropagation()}
          >
            <MapContainer
              center={center}
              zoom={zoom}
              className="leaflet-map"
              scrollWheelZoom={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <FlyToCollege selectedCollege={selectedCollege} />

              {selectedCollege && (
                <Marker position={[selectedCollege.lat, selectedCollege.lng]}>
                  <Popup>{selectedCollege.name}</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* RIGHT → DETAILS */}
          <div className="map-right">
            {selectedCollege ? (
              <div className="college-card-ui">
                <h2>{selectedCollege.name}</h2>

                <p><MapPin size={16} /> {selectedCollege.location}</p>
                <p><Star size={16} /> {selectedCollege.rating}</p>

                <div className="info-row">
                  <span>
                    <IndianRupee size={16} /> {t("collegeMap.fees", "Fees")}:
                  </span>
                  <span>₹ {selectedCollege.fees}</span>
                </div>

                <div className="info-row">
                  <span>
                    <GraduationCap size={16} /> {t("collegeMap.courses", "Courses")}:
                  </span>
                  <span>{selectedCollege.courses.join(", ")}</span>
                </div>

                <button
                  className="direction-btn"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${selectedCollege.lat},${selectedCollege.lng}`
                    )
                  }
                >
                  {t("collegeMap.getDirections", "Get Directions")}
                </button>
              </div>
            ) : (
              <div className="empty-state">
                {t(
                  "collegeMap.selectCollege",
                  "Select a college to view details"
                )}
              </div>
            )}
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}

export default CollegeMapPage;