import { useLocation } from "react-router-dom";

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-display">{location.pathname}</div>;
};

export default LocationDisplay;
