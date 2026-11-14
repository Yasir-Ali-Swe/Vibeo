import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, User } from "lucide-react-native";

import { useTheme, radius } from "@/theme";

interface ProfileAvatarProps {
    uri?: string | null;
    onChange: (uri: string) => void;
    size?: number;
}

export default function ProfileAvatar({
    uri,
    onChange,
    size = 112,
}: ProfileAvatarProps) {
    const { colors } = useTheme();
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            onChange(result.assets[0].uri);
        }
    };

    return (
        <Pressable
            onPress={pickImage}
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            style={{ width: size, height: size }}
        >
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: radius.full,
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.surface.elevated,
                    borderWidth: 3,
                    borderColor: colors.border.strong,
                }}
            >
                {uri ? (
                    <Image
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        transition={200}
                    />
                ) : (
                    <User size={size * 0.42} color={colors.muted.subtle} strokeWidth={1.5} />
                )}
            </View>

            {/* Camera badge, bottom-right corner */}
            <View
                style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 34,
                    height: 34,
                    borderRadius: radius.full,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.primary.DEFAULT,
                    borderWidth: 3,
                    borderColor: colors.background,
                }}
            >
                <Camera size={15} color={colors.primary.foreground} strokeWidth={2.5} />
            </View>
        </Pressable>
    );
}