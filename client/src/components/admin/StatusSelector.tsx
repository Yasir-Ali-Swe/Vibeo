import { useState } from "react";
import { View, Text, Pressable, TextInput, Alert } from "react-native";
import { Check } from "lucide-react-native";
import type { OrderStatus } from "@/types/order";
import { STATUS_META } from "@/utils/orders";
import { useTheme, radius } from "@/theme";
import { withAlpha } from "@/utils/color";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export interface StatusSelectorProps {
  currentStatus: OrderStatus;
  onUpdateStatus: (status: OrderStatus, cancelReason?: string) => void;
}

export default function StatusSelector({
  currentStatus,
  onUpdateStatus,
}: StatusSelectorProps) {
  const { colors, isDark } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [cancelReason, setCancelReason] = useState("");

  const hasChanged = selectedStatus !== currentStatus;

  const handleUpdate = () => {
    if (!hasChanged) return;

    if (selectedStatus === "cancelled") {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to mark this order as cancelled?",
        [
          { text: "Go Back", style: "cancel" },
          {
            text: "Yes, Cancel Order",
            style: "destructive",
            onPress: () => onUpdateStatus("cancelled", cancelReason),
          },
        ]
      );
    } else {
      onUpdateStatus(selectedStatus);
    }
  };

  return (
    <View>
      {/* 5 Status Options */}
      <View
        style={{
          borderRadius: radius.md,
          borderWidth: 1,
          borderColor: colors.border.DEFAULT,
          backgroundColor: colors.surface.DEFAULT,
          overflow: "hidden",
        }}
      >
        {ORDER_STATUSES.map((status, index) => {
          const meta = STATUS_META[status];
          const isSelected = selectedStatus === status;
          const isCurrent = currentStatus === status;

          return (
            <Pressable
              key={status}
              onPress={() => setSelectedStatus(status)}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${meta.label}${isCurrent ? " (Current status)" : ""}`}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderTopWidth: index === 0 ? 0 : 1,
                borderTopColor: colors.border.DEFAULT,
                backgroundColor: isSelected
                  ? withAlpha(meta.color, 0.1)
                  : pressed
                    ? colors.surface.elevated
                    : "transparent",
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: radius.full,
                    backgroundColor: meta.color,
                    marginRight: 12,
                  }}
                />
                <Text
                  style={{
                    color: colors.foreground.DEFAULT,
                    fontSize: 14,
                    fontWeight: isSelected ? "700" : "500",
                  }}
                >
                  {meta.label}
                </Text>
                {isCurrent && (
                  <Text
                    style={{
                      color: colors.muted.foreground,
                      fontSize: 11,
                      marginLeft: 8,
                      fontStyle: "italic",
                    }}
                  >
                    (current)
                  </Text>
                )}
              </View>

              {isSelected && (
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: meta.color,
                  }}
                >
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Cancel reason input shown only when cancelled is selected */}
      {selectedStatus === "cancelled" && (
        <View style={{ marginTop: 14 }}>
          <Text
            style={{
              color: colors.muted.foreground,
              fontSize: 12,
              fontWeight: "600",
              marginBottom: 6,
            }}
          >
            Cancellation Reason (optional)
          </Text>
          <TextInput
            value={cancelReason}
            onChangeText={setCancelReason}
            placeholder="e.g., Customer requested or out of stock"
            placeholderTextColor={colors.muted.subtle}
            selectionColor={colors.primary.DEFAULT}
            keyboardAppearance={isDark ? "dark" : "light"}
            style={{
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.strong,
              backgroundColor: colors.surface.DEFAULT,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 13,
              color: colors.foreground.DEFAULT,
            }}
          />
        </View>
      )}

      {/* Update Status Button */}
      <Pressable
        onPress={handleUpdate}
        disabled={!hasChanged}
        accessibilityRole="button"
        accessibilityLabel="Update status"
        accessibilityState={{ disabled: !hasChanged }}
        style={{
          marginTop: 16,
          height: 44,
          borderRadius: radius.md,
          backgroundColor: hasChanged ? colors.primary.DEFAULT : colors.surface.elevated,
          alignItems: "center",
          justifyContent: "center",
          opacity: hasChanged ? 1 : 0.45,
        }}
      >
        <Text
          style={{
            color: hasChanged ? colors.primary.foreground : colors.muted.foreground,
            fontSize: 14,
            fontWeight: "700",
          }}
        >
          Update status
        </Text>
      </Pressable>
    </View>
  );
}

