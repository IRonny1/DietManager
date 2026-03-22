import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from 'react-native-paper';

import { palette } from '@/constants/Colors';

type IllustratedCardOption = {
  value: string;
  label: string;
  emoji: string;
  description?: string;
};

type IllustratedCardProps = {
  options: IllustratedCardOption[];
  selected: string | null;
  onSelect: (value: string) => void;
  disabled?: boolean;
  columns?: 2 | 3;
};

export default function IllustratedCard({
  options,
  selected,
  onSelect,
  disabled = false,
  columns = 2,
}: IllustratedCardProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            disabled={disabled}
            style={[
              styles.card,
              columns === 3 && styles.cardThreeCol,
              isSelected && styles.cardSelected,
              disabled && styles.cardDisabled,
            ]}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text
              variant="bodyMedium"
              style={[styles.label, isSelected && styles.labelSelected]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
            {option.description && (
              <Text
                variant="bodySmall"
                style={[
                  styles.description,
                  isSelected && styles.descriptionSelected,
                ]}
                numberOfLines={2}
              >
                {option.description}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: palette.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: palette.divider,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
  },
  cardThreeCol: {
    width: '30%',
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: '#E8F5E9',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    color: palette.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelSelected: {
    color: palette.primaryDark,
  },
  description: {
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  descriptionSelected: {
    color: palette.primaryDark,
  },
});
