import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">{user.fullName.charAt(0).toUpperCase()}</div>
          <h2>{user.fullName}</h2>
          <p className="email">{user.email}</p>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Income:</span>
            <span className="value">₹{user.income || 0}</span>
          </div>
          <div className="detail-item">
            <span className="label">Balance:</span>
            <span className="value">₹{user.balance || 0}</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
