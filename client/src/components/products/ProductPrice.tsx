import { View, Text } from "react-native";
import { formatPrice } from "@/utils/format";

interface ProductPriceProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  lg: { price: "text-2xl", original: "text-base" },
  md: { price: "text-xl", original: "text-sm" },
  sm: { price: "text-base", original: "text-xs" },
} as const;

export default function ProductPrice({
  price,
  originalPrice,
  discountPercent,
  size = "lg",
}: ProductPriceProps) {
  const isDiscounted = originalPrice !== undefined && originalPrice > price;
  const percent =
    discountPercent ??
    (isDiscounted ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
      <Text
        style={{ marginRight: 12 }}
        className={`${SIZES[size].price} font-extrabold tracking-tight text-foreground`}
      >
        {formatPrice(price)}
      </Text>

      {isDiscounted && (
        <Text
          style={{ marginRight: 12 }}
          className={`${SIZES[size].original} text-muted-subtle line-through`}
        >
          {formatPrice(originalPrice)}
        </Text>
      )}

      {isDiscounted && percent > 0 && (
        <View className="rounded-full bg-success/15 px-2 py-0.5">
          <Text className="text-[11px] font-bold text-success">{percent}% OFF</Text>
        </View>
      )}
    </View>
  );
}