import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Row, Col, Form } from "react-bootstrap";
import { FaSearch, FaSort } from "react-icons/fa";
import "./TVEpisodesList.css";
import VideoPlayer from "./VideoPlayer";
import { useNavigate } from "react-router-dom";

const TVEpisodesList = ({ tvId }) => {
  const { apiCall } = useAuth();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const navigate = useNavigate();
  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // Load show details
  useEffect(() => {
    const fetchSeries = async () => {
      const data = await apiCall(`/tv/${tvId}`);
      setSeries(data);
      if (data?.seasons?.length > 0) {
        setSelectedSeason(data.seasons[0].season_number);
      }
    };
    fetchSeries();
  }, [tvId, apiCall]);

  // Load episodes
  useEffect(() => {
    const fetchEpisodes = async () => {
      if (!selectedSeason) return;
      const seasonData = await apiCall(`/tv/${tvId}/season/${selectedSeason}`);
      setEpisodes(seasonData?.episodes || []);
    };
    fetchEpisodes();
  }, [selectedSeason, tvId, apiCall]);

  if (!series) return null;

  // Search + Sort
  const filteredEpisodes = episodes
    .filter(
      (ep) =>
        ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ep.episode_number.toString().includes(searchTerm)
    )
    .sort((a, b) =>
      sortAsc
        ? a.episode_number - b.episode_number
        : b.episode_number - a.episode_number
    );

  // Generate vidsrc embed URL
  const playEpisode = (season, episode) => {
    const url = `https://vidsrc.icu/embed/tv/${tvId}/${season}/${episode}`;
    navigate(`/tv/${tvId}/season/${season}/episode/${episode}/play`, { state: { url , title: `${series.name} - S${season}E${episode}`} });
    setCurrentVideoUrl(url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-4 mt-4 card bg-dark text-white shadow-lg border-secondary">
      <div className="card-body">
        <h3 className="fw-bold border-start border-4 ps-3 mb-4">Episodes</h3>

        {/* Video Player */}
        <VideoPlayer url={currentVideoUrl} />

        {/* Filters */}
        <div className="p-3 bg-secondary bg-opacity-25 rounded mb-4">
          <Row className="g-3 align-items-center">
            <Col xs={12} md={4}>
              <Form.Select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="bg-dark text-white border-secondary custom-input-height"
              >
                {series.seasons.map((s) => (
                  <option key={s.id} value={s.season_number}>
                    {s.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={8}>
              <div className="d-flex gap-2">
                <div className="flex-grow-1 input-group custom-input-height">
                  <span className="input-group-text bg-dark text-white border-secondary">
                    <FaSearch size={14} />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search episode..."
                    className="bg-dark text-white border-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-dark border-secondary text-white d-flex align-items-center justify-content-center custom-input-height"
                  style={{ width: "48px" }}
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  <FaSort size={16} />
                </button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Episode List */}
        <div
          className={filteredEpisodes.length > 5 ? "episodes-scrollable" : ""}
          style={
            filteredEpisodes.length > 5
              ? { maxHeight: "400px", overflowY: "auto", paddingRight: "8px" }
              : {}
          }
        >
          {filteredEpisodes.map((ep) => {
            const overview = ep.overview || "No description available.";
            const trimmed =
              overview.length > 120
                ? expanded[ep.id]
                  ? overview
                  : overview.substring(0, 120) + "..."
                : overview;

            return (
              <div
                key={ep.id}
                className="d-flex bg-secondary bg-opacity-25 p-3 rounded mb-3 episode-item"
                style={{ cursor: "pointer" }}
                onClick={() => playEpisode(selectedSeason, ep.episode_number)}
              >
                <img
                  src={
                    ep.still_path
                      ? `https://image.tmdb.org/t/p/w200${ep.still_path}`
                      : "https://via.placeholder.com/100x60?text=No+Image"
                  }
                  className="rounded me-3"
                  style={{ width: "120px", height: "70px", objectFit: "cover" }}
                  alt={ep.name}
                />
                <div>
                  <p className="fw-bold text-white mb-1">
                    {ep.episode_number}. {ep.name}
                  </p>
                  <p className="text-white-50 mb-1 small d-none d-sm-block">
                    {trimmed}
                  </p>
                  {overview.length > 120 && (
                    <button
                      className="btn btn-link text-primary p-0 small d-none d-sm-block"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(ep.id);
                      }}
                    >
                      {expanded[ep.id] ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TVEpisodesList;
