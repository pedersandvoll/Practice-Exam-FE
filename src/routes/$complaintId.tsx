import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useGetCustomerComplaintById } from "../hooks/apiHooks";
import ComplaintDetailDialog from "../components/ComplaintDetailDialog";
import { useEffect } from "react";
import { Index } from "../routes/index";

export const Route = createFileRoute("/$complaintId")({
  component: ComplaintDetail,
});

function ComplaintDetail() {
  const { complaintId } = Route.useParams();
  const navigate = useNavigate();
  const { data: complaint, isLoading } =
    useGetCustomerComplaintById(complaintId);

  useEffect(() => {
    if (!isLoading && !complaint) {
      navigate({ to: "/" });
    }
  }, [complaint, isLoading, navigate]);

  return (
    <Index>
      <ComplaintDetailDialog
        isOpen={true}
        complaint={complaint}
        isLoading={isLoading}
      />
    </Index>
  );
}
