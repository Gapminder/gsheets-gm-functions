/**
 * Evaluates if the referenced dataset is set up according to the standard format and complete:
 * - Checks the row header of the output sheets ( the so called "data-countries-etc/world/region-by year)
 * - Checks the about sheet (to see if it follows the requirements in col A)
 * Returns "GOOD" or "BAD: What is bad... ".
 *
 * @param concept_id The concept id ("pop") of which concept data to check status for
 * @param time_unit (Optional with default "year") Time unit variant (eg. "year") of the concept data to check status for
 * @param geography (Optional with default "countries_etc") Should be one of the sets listed in the gapminder geo ontology such as "countries_etc"
 * @param verbose Explains how a certain dataset is invalid instead of simply returning "BAD" for the row
 * @return A two-dimensional array containing the cell/column contents described above in the summary.
 */
export function GM_DATA_STATUS(
  concept_id: string,
  time_unit: string,
  geography: string,
  verbose: boolean
) {
  // Default argument value
  if (verbose === undefined) {
    verbose = false;
  }
  return [["TODO"]];
}
