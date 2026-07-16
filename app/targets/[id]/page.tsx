import { AcquisitionProfile } from "@/components/acquisition-profile";

export default async function TargetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AcquisitionProfile id={id} />;
}
