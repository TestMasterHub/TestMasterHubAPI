import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EnvironmentsList({ Environments }) {
  const [currentEnvironments, setCurrentEnvironments] = useState({});
  const [openEnvironments, setOpenEnvironments] = useState({}); // Track open state per environment
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch updated Environments from LocalDB
    const updatedEnvironments =
      JSON.parse(localStorage.getItem("environments")) || {};
    setCurrentEnvironments(updatedEnvironments);
  }, []);

  // Toggle environment visibility
  const toggleEnvironment = (id) => {
    setOpenEnvironments((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle visibility for the specific environment
    }));
  };

  const handleNameClick = (key) => {
    const environment = currentEnvironments[key];
    if (environment) {
      navigate(`/Environments/${environment.name}`, {
        state: { environment },
      });
    }
  };

  // If there are no environments, show a message
  if (!Object.keys(currentEnvironments).length) {
    return <div className="p-4 text-gray-500">No Environments available</div>;
  }

  return (
    <div className="EnvironmentList">
      {Object.entries(currentEnvironments).map(([key, environment]) => (
        <div key={environment.id} className="environment-container">
          <div
            className="environment-header"
            onClick={() => toggleEnvironment(environment.id)} // Toggle individual environment
          >
            <span
              className="environment-name"
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggle on environment name click
                handleNameClick(key);
              }}
            >
              {environment.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
