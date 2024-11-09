import { useEffect } from "react";
import CsvImportForm from "../Components/ImportExport/CsvImportForm";
import SearchShowStudents from "../Components/ImportExport/SearchShow";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/UserContext";

export default function Students() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <CsvImportForm />
      <SearchShowStudents />
    </div>
  );
}
