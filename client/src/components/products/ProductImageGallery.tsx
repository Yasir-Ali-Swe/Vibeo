import { useCallback, useMemo, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { ImageOff } from "lucide-react-native";

import { useTheme } from "@/theme";

interface ProductImageGalleryProps {
  images?: string[];
  fallbackImage?: string;
}

function Dot({
  index,
  width,
  scrollX,
}: {
  index: number;
  width: number;
  scrollX: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const range = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, range, [6, 18, 6], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, range, [0.55, 1, 0.55], Extrapolation.CLAMP),
    };
  });

  return <Animated.View style={style} className="h-1.5 rounded-full bg-white" />;
}

function Placeholder({ size, label }: { size: number; label: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center bg-surface"
    >
      <ImageOff size={36} color={colors.muted.subtle} strokeWidth={1.5} />
      <Text className="mt-2 text-xs text-muted-subtle">{label}</Text>
    </View>
  );
}

export default function ProductImageGallery({
  images,
  fallbackImage,
}: ProductImageGalleryProps) {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  const gallery = useMemo(() => {
    if (images && images.length > 0) return images;
    return fallbackImage ? [fallbackImage] : [];
  }, [images, fallbackImage]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) =>
      failed[index] ? (
        <Placeholder size={width} label="Image unavailable" />
      ) : (
        <Image
          source={{ uri: item }}
          style={{ width, height: width }}
          contentFit="cover"
          transition={200}
          onError={() => setFailed((prev) => ({ ...prev, [index]: true }))}
        />
      ),
    [width, failed]
  );

  if (gallery.length === 0) {
    return <Placeholder size={width} label="No image available" />;
  }

  return (
    <View className="bg-surface">
      <Animated.FlatList
        data={gallery}
        keyExtractor={(uri, i) => `${i}-${uri}`}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        initialNumToRender={1}
        windowSize={3}
      />

      {gallery.length > 1 && (
        <View
          pointerEvents="none"
          className="absolute bottom-3 flex-row items-center gap-1.5 self-center rounded-full bg-black/30 px-2.5 py-2"
        >
          {gallery.map((_, i) => (
            <Dot key={i} index={i} width={width} scrollX={scrollX} />
          ))}
        </View>
      )}
    </View>
  );
}