import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamation, FaSpinner, FaCheck, FaRedo } from "react-icons/fa";
import "./AdminDashboard.css";
import Navbar from "../Navbar/Navbar";
import { getUserProfile, getDistrictIssues } from "../../services/api";

const AdminDashboard = () => {
  const [issues, setIssues] = useState({
    unsolved: [],
    inProgress: [],
    solved: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const initDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    let currentDistrictCode = user.districtCode;

    // If districtCode is missing, try to fetch it from the profile API to resolve it
    if (!currentDistrictCode && user._id) {
      try {
        const response = await getUserProfile(user._id);
        if (response.data && response.data.districtCode) {
          currentDistrictCode = response.data.districtCode;
          const updatedUser = { ...user, districtCode: currentDistrictCode };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        console.error(
          "Error fetching user profile to resolve districtCode:",
          err
        );
      }
    }

    if (!currentDistrictCode) {
      console.error("No district code found for admin");
      setError("No district code assigned to this admin account.");
      setLoading(false);
      return;
    }

    try {
      const response = await getDistrictIssues(currentDistrictCode);
      if (response.data && response.data.success) {
        const data = response.data.data || {};
        setIssues({
          unsolved: Array.isArray(data.unsolved) ? data.unsolved : [],
          inProgress: Array.isArray(data.inProgress) ? data.inProgress : [],
          solved: Array.isArray(data.solved) ? data.solved : [],
          total: data.total || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load district issues. The server might still be starting up."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    initDashboard();
  }, [initDashboard]);

  const handleIssueClick = (issueId) => {
    navigate(`/admin/issue/${issueId}`);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  const unsolvedList = issues?.unsolved || [];
  const inProgressList = issues?.inProgress || [];
  const solvedList = issues?.solved || [];
  const totalCount =
    issues?.total ||
    unsolvedList.length + inProgressList.length + solvedList.length;

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        {error && (
          <div className="error-banner" style={{ margin: "1rem 2rem", padding: "1rem", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{error}</span>
            <button
              onClick={initDashboard}
              style={{ padding: "0.4rem 0.8rem", cursor: "pointer", background: "#991b1b", color: "#fff", border: "none", borderRadius: "4px" }}
            >
              <FaRedo /> Retry
            </button>
          </div>
        )}

        <div className="stats-container">
          <div className="stat-card unsolved">
            <h3>Unsolved</h3>
            <span className="stat-number">{unsolvedList.length}</span>
          </div>
          <div className="stat-card in-progress">
            <h3>In Progress</h3>
            <span className="stat-number">{inProgressList.length}</span>
          </div>
          <div className="stat-card solved">
            <h3>Solved</h3>
            <span className="stat-number">{solvedList.length}</span>
          </div>
          <div className="stat-card total">
            <h3>Total</h3>
            <span className="stat-number">{totalCount}</span>
          </div>
        </div>

        <div className="issues-grid">
          <div className="issues-column">
            <h2>
              <FaExclamation /> Unsolved Issues
            </h2>
            <div className="issues-list">
              {unsolvedList.map((issue) => (
                <div
                  key={issue._id}
                  className="issue-card"
                  onClick={() => handleIssueClick(issue._id)}
                >
                  <h3>{issue.title}</h3>
                  <p>{issue.description?.substring(0, 100)}...</p>
                  <div className="issue-meta">
                    <span>By: {issue.createdBy?.username || "Anonymous"}</span>
                    <span>
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="issues-column">
            <h2>
              <FaSpinner /> In Progress
            </h2>
            <div className="issues-list">
              {inProgressList.map((issue) => (
                <div
                  key={issue._id}
                  className="issue-card"
                  onClick={() => handleIssueClick(issue._id)}
                >
                  <h3>{issue.title}</h3>
                  <p>{issue.description?.substring(0, 100)}...</p>
                  <div className="issue-meta">
                    <span>By: {issue.createdBy?.username || "Anonymous"}</span>
                    <span>
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="issues-column">
            <h2>
              <FaCheck /> Solved Issues
            </h2>
            <div className="issues-list">
              {solvedList.map((issue) => (
                <div
                  key={issue._id}
                  className="issue-card"
                  onClick={() => handleIssueClick(issue._id)}
                >
                  <h3>{issue.title}</h3>
                  <p>{issue.description?.substring(0, 100)}...</p>
                  <div className="issue-meta">
                    <span>By: {issue.createdBy?.username || "Anonymous"}</span>
                    <span>
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
