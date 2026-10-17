import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/Card";
import Select from "@/shared/components/Select";
import { useAdminStore } from "../admin.store";
import MetadataCodesComponent from "../components/MetadataCodesComponent";

const metadataOptions = [
  {
    value: "codes",
    label: "Codes",
    description: "Manage your codes",
    component: MetadataCodesComponent,
  },
];

function MetadataPage() {
  const loadAllCodes = useAdminStore((state) => state.loadAllCodes);
  const [selectedMetadata, setSelectedMetadata] = useState<string | null>(null);

  useEffect(() => {
    void loadAllCodes();
  }, [loadAllCodes]);

  const SelectedPanel = useMemo(
    () => metadataOptions.find((o) => o.value === selectedMetadata)?.component,
    [selectedMetadata],
  );

  return (
    <section className="px-2 py-2 w-full h-full">
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Manage your metadata here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="w-full flex flex-row justify-end px-1 py-1">
              <Select
                options={metadataOptions}
                value={selectedMetadata}
                onChange={setSelectedMetadata}
                placeholder="Choose a type"
                className="max-w-xs"
              />
            </div>
            <div className="w-full h-full flex flex-col">
              {SelectedPanel ? (
                <SelectedPanel />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-fg-muted">
                    Select a metadata type to manage.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export default MetadataPage;
