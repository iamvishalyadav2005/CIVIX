import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllIssues } from "../../services/api";
import "./Home.css";
import {
  FaThumbsUp,
  FaCommentDots,
  FaMapMarkerAlt,
  FaImage,
  FaRedo,
} from "react-icons/fa";

import Navbar from "../Navbar/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filteredIssues, setFilteredIssues] = useState([]);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllIssues(); // Axios handles token via interceptor
      const data = Array.isArray(response.data) ? response.data : [];
      setIssues(data);
    } catch (err) {
      console.error("Failed to load issues:", err);
      setError(
        err.response?.data?.message ||
          "Could not load issues. The backend service may be spinning up on Render (takes ~30-60s on first load)."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  useEffect(() => {
    let result = Array.isArray(issues) ? [...issues] : [];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (issue) =>
          (issue.title || "").toLowerCase().includes(term) ||
          (issue.description || "").toLowerCase().includes(term) ||
          (issue.location?.address || "").toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (issue) =>
          (issue.status || "").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort
    result = result.sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "upvotes") {
        return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
      }
      return 0;
    });

    setFilteredIssues(result);
  }, [issues, searchTerm, statusFilter, sortBy]);

  const handleIssueClick = (issueId) => {
    navigate(`/issue/${issueId}`);
  };

  if (loading) {
    return (
      <div className="home-layout">
        <Navbar />
        <div className="loading" style={{ textAlign: "center", padding: "4rem" }}>
          <h3>Loading issues...</h3>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>
            Connecting to CIVIX services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <Navbar />
      <div className="home-container">
        <section className="content">
          <div className="hero-section">
            <div className="hero-text">
              <h3>Civic Issues</h3>
              <p>Report and track community problems in your area</p>
            </div>
          </div>

          {error && (
            <div
              style={{
                margin: "1rem 0",
                padding: "1rem",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{error}</span>
              <button
                onClick={fetchIssues}
                style={{
                  padding: "0.4rem 0.8rem",
                  cursor: "pointer",
                  background: "#991b1b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <FaRedo /> Retry
              </button>
            </div>
          )}

          <div className="filters">
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="unsolved">Unsolved</option>
              <option value="in progress">In Progress</option>
              <option value="solved">Solved</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Recent Activity</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>

          <div className="issues-grid">
            {filteredIssues.length === 0 && !error ? (
              <div style={{ padding: "2rem", color: "#666" }}>
                No issues found.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue._id}
                  className="issue-card"
                  onClick={() => handleIssueClick(issue._id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="issue-image-container">
                    {issue.images && issue.images.length > 0 ? (
                      <img
                        src={issue.images[0]}
                        alt={issue.title || "Issue"}
                        className="issue-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                          <div class="image-placeholder">
                            <div class="image-placeholder-content">
                              <FaImage />
                              <span>No image available</span>
                            </div>
                          </div>
                        `;
                        }}
                      />
                    ) : (
                      <div className="image-placeholder">
                        <div className="image-placeholder-content">
                          <FaImage />
                          <span>No image available</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span
                    className={`status-badge ${
                      issue.status === "in progress"
                        ? "in-progress"
                        : issue.status === "solved"
                        ? "solved"
                        : "reported"
                    }`}
                  >
                    {issue.status || "unsolved"}
                  </span>

                  <h3 className="issue-title">{issue.title}</h3>
                  <p className="issue-description">
                    {(issue.description || "").length > 100
                      ? `${(issue.description || "").substring(0, 100)}...Read more`
                      : issue.description || ""}
                  </p>
                  <p className="location">
                    <FaMapMarkerAlt /> {issue.location?.address || "Address not provided"}
                  </p>
                  <p className="user">
                    {issue.createdBy?.username || "Anonymous"}
                  </p>
                  <div className="card-footer">
                    <span>
                      <FaThumbsUp /> {issue.upvotes?.length || 0}
                    </span>
                    <span>
                      <FaCommentDots /> {issue.comments?.length || 0}
                    </span>
                  </div>
                  <div className="district">{issue.districtCode || ""}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
