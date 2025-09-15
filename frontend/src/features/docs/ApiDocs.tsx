import { ApiReferenceReact } from "@scalar/api-reference-react";
import "@scalar/api-reference-react/style.css";
import { useGetDocs } from "./hooks/useGetDocs";

export default function ApiDocs() {
  const { data: docs, isLoading, error } = useGetDocs();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading API docs</div>;

  return (
    <div className="w-full">
      <ApiReferenceReact
        configuration={{
          content: docs,
          servers: [{ url: "http://localhost:5173/api" }],
        }}
      />
    </div>
  );
}
