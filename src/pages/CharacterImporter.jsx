import { useState } from "react";
import {
  importCharactersToSupabase,
  createCharactersTable,
} from "../utils/supabaseCharactersImport";
import "./CharacterImporter.css"; // Import the CSS file

export default function CharacterImporter() {
  const [importStatus, setImportStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      // First check/create the table
      const tableResult = await createCharactersTable();

      if (!tableResult.success && tableResult.message) {
        setImportStatus({
          success: false,
          message: tableResult.message,
        });
        setIsLoading(false);
        return;
      }

      // Then import the data
      const result = await importCharactersToSupabase();
      setImportStatus(result);
    } catch (error) {
      setImportStatus({
        success: false,
        message: error.message || "An error occurred during import",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="importer-container">
      <h2 className="importer-title">Character Data Importer</h2>

      <p className="importer-description">
        This tool will import character data into your Supabase 'characters'
        table. Make sure you have set up your Supabase credentials in your .env
        file:
      </p>

      <button
        onClick={handleImport}
        disabled={isLoading}
        className="importer-button"
      >
        {isLoading ? "Importing..." : "Import Characters"}
      </button>

      {importStatus && (
        <div
          className={`importer-status ${
            importStatus.success ? "success" : "error"
          }`}
        >
          {importStatus.success ? (
            <p>Characters successfully imported!</p>
          ) : (
            <div>
              <p className="status-title">Import failed:</p>
              <p>
                {importStatus.message || JSON.stringify(importStatus.error)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
