"use client";

import { Button, useConfig } from "@payloadcms/ui";

// "Export to Excel" above the Registrations list
// (admin.components.beforeListTable). Downloads every entry as a CSV that
// opens in Excel / Google Sheets — see the export endpoint in
// collections/Registrations.ts. The browser sends the admin login cookie, so
// only signed-in staff get the file.
export function ExportRegistrations() {
  const {
    config: {
      routes: { api: apiRoute },
    },
  } = useConfig();

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--base)" }}>
      <Button el="anchor" url={`${apiRoute || "/api"}/registrations/export`} buttonStyle="primary" size="medium" margin={false}>
        ⬇ Export to Excel (CSV)
      </Button>
    </div>
  );
}
