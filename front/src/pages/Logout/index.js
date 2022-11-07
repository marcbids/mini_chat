import { useContext, useEffect } from "react";
import { UserContext } from "../../userContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  const { unsetUser } = useContext(UserContext);

  useEffect(() => {
    //invoke unsetUser to clear local storage
    unsetUser();
    navigate("/", { replace: true });
    navigate(0);
  }, []);

  return null;
};
