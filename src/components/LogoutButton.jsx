import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const authMethod = localStorage.getItem("authMethod");
    if (authMethod === "strapi") {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authMethod");
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  };

  return (
    <button onClick={handleLogout}>
      Sign out
    </button>
  );
};

export default LogoutButton;

