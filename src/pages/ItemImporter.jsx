import { useState } from "react";
import {
  importItemsToSupabase,
  createItemsTable,
} from "../utils/supabaseItemsImporter";
import "./ItemImporter.css"; // Import the CSS file

export default function ItemImporter() {
  const [importStatus, setImportStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    try {
      // First check/create the table
      const tableResult = await createItemsTable();

      if (!tableResult.success && tableResult.message) {
        setImportStatus({
          success: false,
          message: tableResult.message,
        });
        setIsLoading(false);
        return;
      }

      // Then import the data
      const result = await importItemsToSupabase();
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
      <h2 className="importer-title">Item Data Importer</h2>

      <p className="importer-description">
        This tool will import item data into your Supabase 'items' table. Make
        sure you have set up your Supabase credentials in your .env file:
      </p>

      <button
        onClick={handleImport}
        disabled={isLoading}
        className="importer-button"
      >
        {isLoading ? "Importing..." : "Import Items"}
      </button>

      {importStatus && (
        <div
          className={`importer-status ${
            importStatus.success ? "success" : "error"
          }`}
        >
          {importStatus.success ? (
            <p>Items successfully imported!</p>
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
