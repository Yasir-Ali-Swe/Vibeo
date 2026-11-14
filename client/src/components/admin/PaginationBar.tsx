import { memo } from "react";
import { View, Text, Pressable, useWindowDimensions } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useTheme, radius } from "@/theme";

export interface PaginationBarProps {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

function PaginationBar({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
}: PaginationBarProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, page * pageSize);

  const canPrev = page > 1;
  const canNext = page < pageCount;

  // Compute page numbers with ellipsis when isTablet
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (pageCount <= 5) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(pageCount - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < pageCount - 2) pages.push("...");
      pages.push(pageCount);
    }
    return pages;
  };

  return (
    <View
      style={{
        paddingVertical: 16,
        paddingHorizontal: 8,
        flexDirection: isTablet ? "row" : "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Range text */}
      <Text
        style={{
          color: colors.muted.foreground,
          fontSize: 13,
          fontWeight: "500",
          marginBottom: isTablet ? 0 : 12,
        }}
      >
        Showing {rangeStart}–{rangeEnd} of {total}
      </Text>

      {/* Controls (hidden if total <= pageSize) */}
      {total > pageSize ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Previous Button */}
          <Pressable
            onPress={() => canPrev && onChange(page - 1)}
            disabled={!canPrev}
            accessibilityRole="button"
            accessibilityLabel="Previous page"
            accessibilityState={{ disabled: !canPrev }}
            style={{
              minWidth: 44,
              height: 44,
              paddingHorizontal: 12,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              backgroundColor: colors.surface.DEFAULT,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              opacity: canPrev ? 1 : 0.35,
              marginRight: 8,
            }}
          >
            <ChevronLeft size={16} color={colors.foreground.DEFAULT} />
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 12,
                fontWeight: "600",
                marginLeft: 4,
              }}
            >
              Prev
            </Text>
          </Pressable>

          {/* Page Chips on Tablets, Text indicator on Mobile */}
          {isTablet ? (
            <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 4 }}>
              {getPageNumbers().map((p, idx) => {
                if (p === "...") {
                  return (
                    <Text
                      key={`dots-${idx}`}
                      style={{
                        color: colors.muted.foreground,
                        fontSize: 13,
                        marginHorizontal: 4,
                      }}
                    >
                      ...
                    </Text>
                  );
                }

                const isCurrent = p === page;
                return (
                  <Pressable
                    key={`page-${p}`}
                    onPress={() => onChange(p)}
                    accessibilityRole="button"
                    accessibilityLabel={`Page ${p}`}
                    accessibilityState={{ selected: isCurrent }}
                    style={{
                      minWidth: 44,
                      height: 44,
                      borderRadius: radius.md,
                      borderWidth: 1,
                      borderColor: isCurrent ? colors.primary.DEFAULT : colors.border.DEFAULT,
                      backgroundColor: isCurrent ? colors.primary.DEFAULT : colors.surface.DEFAULT,
                      alignItems: "center",
                      justifyContent: "center",
                      marginHorizontal: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: isCurrent ? colors.primary.foreground : colors.foreground.DEFAULT,
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 13,
                fontWeight: "600",
                marginHorizontal: 12,
              }}
            >
              Page {page} of {pageCount}
            </Text>
          )}

          {/* Next Button */}
          <Pressable
            onPress={() => canNext && onChange(page + 1)}
            disabled={!canNext}
            accessibilityRole="button"
            accessibilityLabel="Next page"
            accessibilityState={{ disabled: !canNext }}
            style={{
              minWidth: 44,
              height: 44,
              paddingHorizontal: 12,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.border.DEFAULT,
              backgroundColor: colors.surface.DEFAULT,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              opacity: canNext ? 1 : 0.35,
              marginLeft: 8,
            }}
          >
            <Text
              style={{
                color: colors.foreground.DEFAULT,
                fontSize: 12,
                fontWeight: "600",
                marginRight: 4,
              }}
            >
              Next
            </Text>
            <ChevronRight size={16} color={colors.foreground.DEFAULT} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

export default memo(PaginationBar);

