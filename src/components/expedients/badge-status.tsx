import { cn } from "@/lib/utils";
import { Text } from "../ui/text";

export interface ExpedientBadgeStatusProps {
  status: number;
  className?: string;
}

interface StatusColor {
  value: number;
  label: string;
  className: string;
}

const statusColors: Record<number, StatusColor> = {
  1: {
    value: 1,
    label: "REGISTRADO",
    className: "bg-gray-200 text-gray-800",
  },
  2: {
    value: 2,
    label: "DERIVADO",
    className: "bg-blue-200 text-blue-800",
  },
  3: {
    value: 3,
    label: "RECIBIDO",
    className: "bg-blue-200 text-blue-800",
  },
  4: {
    value: 4,
    label: "ATENDIDO",
    className: "bg-green-200 text-green-800",
  },
  5: {
    value: 5,
    label: "RESERVADO",
    className: "bg-orange-200 text-orange-800",
  },
  6: {
    value: 6,
    label: "ARCHIVADO",
    className: "bg-gray-200 text-gray-800",
  },
  7: {
    value: 7,
    label: "TRAMITE FINALIZADO",
    className: "bg-green-200 text-green-800",
  },
  8: {
    value: 8,
    label: "CONCLUIDO",
    className: "bg-green-200 text-green-800",
  },
  9: {
    value: 9,
    label: "ANULADO",
    className: "bg-red-200 text-red-800",
  },
  10: {
    value: 10,
    label: "INGRESADO",
    className: "bg-gray-200 text-gray-800",
  },
};

export default function ExpedientBadgeStatus({
  status,
  className,
}: ExpedientBadgeStatusProps) {
  const statusColor = statusColors[status];

  return (
    <Text
      className={cn(
        "text-xs px-3 py-1.5 font-semibold",
        statusColor?.className || "bg-gray-200",
        className,
      )}
    >
      {statusColor?.label || "DESCONOCIDO"}
    </Text>
  );
}
