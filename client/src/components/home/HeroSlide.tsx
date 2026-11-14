import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ArrowRight } from "lucide-react-native";

import type { HeroSlideProps } from "@/types/banner";
import { useTheme } from "@/theme";

const TEXT_SHADOW = {
  textShadowColor: "rgba(0,0,0,0.55)",
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 6,
} as const;

function HeroSlide({ slide, width, onPress }: HeroSlideProps) {
  const { colors } = useTheme();
  return (
    <View style={{ width }} className="px-4 py-1">
      <View className="rounded-xl shadow-lg">
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${slide.title}. ${slide.ctaText}`}
          className="h-[200px] w-full overflow-hidden rounded-xl border border-border bg-surface active:opacity-95"
        >
          <Image
            source={{ uri: slide.image }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={250}
          />

          {/* 1. Uniform dim so bright photos never wash out the text */}
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }]}
          />
          {/* 3. Content */}
          <View style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
            <View>
              {slide.tag ? (
                <View className="mb-2 self-start rounded-full bg-primary px-2.5 py-1">
                  <Text
                    style={{ color: colors.primary.foreground }}
                    className="text-[10px] font-extrabold uppercase tracking-widest"
                  >
                    {slide.tag}
                  </Text>
                </View>
              ) : null}

              <Text
                numberOfLines={2}
                style={[{ color: "#FFFFFF", maxWidth: 260 }, TEXT_SHADOW]}
                className="text-2xl font-black leading-7 tracking-tight"
              >
                {slide.title}
              </Text>

              <Text
                numberOfLines={2}
                style={[{ color: "rgba(255,255,255,0.92)", maxWidth: 250 }, TEXT_SHADOW]}
                className="mt-1 text-xs leading-4"
              >
                {slide.description}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 self-start rounded-md bg-primary px-4 py-2.5">
              <Text
                style={{ color: colors.primary.foreground }}
                className="text-xs font-bold tracking-wide"
              >
                {slide.ctaText}
              </Text>
              <ArrowRight
                size={14}
                color={colors.primary.foreground}
                strokeWidth={2.5}
              />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(HeroSlide);