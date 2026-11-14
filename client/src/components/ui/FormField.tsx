import { useState } from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";
import { useTheme, radius } from "@/theme";

export interface FormFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function FormField({
  label,
  error,
  multiline,
  onFocus,
  onBlur,
  style,
  ...inputProps
}: FormFieldProps) {
  const { colors, isDark } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.destructive.DEFAULT
    : focused
      ? colors.primary.DEFAULT
      : colors.border.strong;

  return (
    <View>
      <Text
        style={{
          color: colors.foreground.muted,
          fontSize: 13,
          fontWeight: "500",
          marginBottom: 8,
        }}
      >
        {label}
      </Text>

      <TextInput
        {...inputProps}
        keyboardAppearance={isDark ? "dark" : "light"}
        multiline={multiline}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={colors.muted.subtle}
        selectionColor={colors.primary.DEFAULT}
        textAlignVertical={multiline ? "top" : "center"}
        style={[
          {
            backgroundColor: colors.surface.DEFAULT,
            borderWidth: 1,
            borderColor,
            borderRadius: radius.md,
            paddingHorizontal: 14,
            paddingVertical: multiline ? 12 : 0,
            height: multiline ? undefined : 50,
            minHeight: multiline ? 108 : undefined,
            color: colors.foreground.DEFAULT,
            fontSize: 15,
          },
          style,
        ]}
      />

      {error ? (
        <Text
          style={{
            color: colors.destructive.DEFAULT,
            fontSize: 12,
            fontWeight: "500",
            marginTop: 6,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

