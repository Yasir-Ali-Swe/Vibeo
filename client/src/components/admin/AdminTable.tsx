import React from "react";
import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  type FlatListProps,
} from "react-native";
import { useTheme } from "@/theme";

export interface TableColumn<T> {
  label: string;
  flex: number;
  render: (item: T) => React.ReactNode;
}

export interface AdminTableProps<T> {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderRow: (item: T) => React.ReactNode;
  columns?: TableColumn<T>[];
  ListHeaderComponent?: React.ReactElement | null;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
  contentContainerStyle?: FlatListProps<T>["contentContainerStyle"];
}

export default function AdminTable<T>({
  data,
  keyExtractor,
  renderRow,
  columns,
  ListHeaderComponent,
  emptyState,
  footer,
  contentContainerStyle,
}: AdminTableProps<T>) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const showTableColumns = isTablet && columns && columns.length > 0;

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={
        <>
          {ListHeaderComponent}

          {showTableColumns && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 16,
                backgroundColor: colors.surface.DEFAULT,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.DEFAULT,
              }}
            >
              {columns?.map((col, index) => (
                <View key={`col-${index}`} style={{ flex: col.flex }}>
                  <Text
                    style={{
                      color: colors.muted.foreground,
                      fontSize: 12,
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      }
      renderItem={({ item }) => {
        if (showTableColumns && columns) {
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border.DEFAULT,
                backgroundColor: colors.card.DEFAULT,
              }}
            >
              {columns.map((col, index) => (
                <View key={`cell-${index}`} style={{ flex: col.flex }}>
                  {col.render(item)}
                </View>
              ))}
            </View>
          );
        }
        return <>{renderRow(item)}</>;
      }}
      ListEmptyComponent={
        emptyState ? (
          <View style={{ padding: 32, alignItems: "center" }}>
            {emptyState}
          </View>
        ) : undefined
      }
      ListFooterComponent={footer ? <>{footer}</> : undefined}
    />
  );
}
