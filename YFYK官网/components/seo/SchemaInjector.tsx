export function SchemaInjector({ schemas, id = "yfyk-schema" }: { schemas: object[]; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
