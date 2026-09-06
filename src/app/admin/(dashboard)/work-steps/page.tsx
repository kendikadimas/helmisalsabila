import { getAllWorkStepsAdmin } from "@/actions/worksteps";
import WorkStepsClientManager from "@/components/admin/WorkStepsClientManager";

export default async function AdminWorkStepsPage() {
  const steps = await getAllWorkStepsAdmin();

  return <WorkStepsClientManager initialSteps={steps} />;
}
