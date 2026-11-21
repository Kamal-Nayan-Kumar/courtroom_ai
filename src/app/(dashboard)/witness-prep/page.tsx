import CasePrepStudioPage from "../case/[id]/prep/page";

export default async function WitnessPrepAliasPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const { caseId } = await searchParams;
  return (
    <CasePrepStudioPage
      caseId={caseId && caseId !== "undefined" ? caseId : "delhi-liquor-2022"}
      initialTab="witness-lab"
    />
  );
}
