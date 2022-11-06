import { useContent } from "../../hooks/useContent";

export const Status = ({ id }) => {
  const { data } = useContent("gatewayStatus", id);
  const isOnline = data?.data?.value;
  return (
    <span title={isOnline ? "Online" : "Offline"}>
      {isOnline ? "🟢" : "🔴"}
    </span>
  );
};
