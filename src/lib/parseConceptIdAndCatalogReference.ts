/**
 * @hidden
 */
export const parseConceptIdAndCatalogReference = concept_id_and_catalog_reference => {
  const parsedDatasetReference = concept_id_and_catalog_reference.split("@");
  const conceptIdAndVersion = parsedDatasetReference[0];
  const parsedConceptIdAndVersion = conceptIdAndVersion.split("#");
  const conceptId = parsedConceptIdAndVersion[0];
  const conceptVersion = parsedConceptIdAndVersion[1] || null;
  const catalog = parsedDatasetReference[1];
  return { conceptId, conceptVersion, catalog };
};
