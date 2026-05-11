import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, ActivityIndicator, Dialog, TextInput, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useWaterTracking } from './hooks/useWaterTracking';
import { CircularProgress } from '@/components/CircularProgress/CircularProgress';
import { palette } from '@/constants/Colors';
import { SPACING, BORDER_RADIUS } from '@/constants/spacing.constants';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/typography.constants';
import type { WaterEntry } from '@/types/waterTracking.types';

const QUICK_ADD_AMOUNTS = [200, 350, 500];

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function WaterEntryRow({
  entry,
  onDelete,
}: {
  entry: WaterEntry;
  onDelete: (id: string) => void;
}): React.JSX.Element {
  return (
    <View style={styles.entryRow}>
      <Text style={styles.entryIcon}>💧</Text>
      <Text style={styles.entryAmount}>{entry.amountMl} ml</Text>
      <Text style={styles.entryTime}>{formatTime(entry.loggedAt)}</Text>
      <TouchableOpacity onPress={() => onDelete(entry.id)}>
        <MaterialCommunityIcons name="delete-outline" size={20} color={palette.error} />
      </TouchableOpacity>
    </View>
  );
}

export function WaterTracking(): React.JSX.Element {
  const {
    todayTotal,
    dailyGoalMl,
    progressPercent,
    entries,
    isLoading,
    isEditGoalVisible,
    editGoalValue,
    handleQuickAdd,
    handleLogCustomAmount,
    handleDeleteEntry,
    handleClearAll,
    handleEditGoal,
    handleEditGoalChange,
    handleEditGoalSave,
    handleEditGoalCancel,
  } = useWaterTracking();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.accent} />
      </View>
    );
  }

  return (
    <Portal.Host>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Card */}
        <View style={styles.card}>
          <CircularProgress
            value={todayTotal}
            max={dailyGoalMl}
            unit="ml"
            color={palette.accent}
          />
          <Text style={styles.goalSubtext}>of {dailyGoalMl.toLocaleString()} ml today</Text>

          {/* Linear Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddRow}>
          {QUICK_ADD_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              mode="outlined"
              onPress={() => handleQuickAdd(amount)}
              style={styles.quickAddButton}
              textColor={palette.accent}
            >
              +{amount} ml
            </Button>
          ))}
        </View>

        {/* Log Custom Amount */}
        <TouchableOpacity onPress={handleLogCustomAmount} style={styles.customAmountRow}>
          <MaterialCommunityIcons name="plus-circle-outline" size={18} color={palette.accent} />
          <Text style={styles.customAmountText}>Log Custom Amount</Text>
        </TouchableOpacity>

        {/* Today's Log Header */}
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Today's Log</Text>
          {entries.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearAll}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Entries */}
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No water logged today</Text>
        ) : (
          entries.map((entry) => (
            <WaterEntryRow key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
          ))
        )}

        {/* Daily Goal Footer */}
        <TouchableOpacity style={styles.goalRow} onPress={handleEditGoal}>
          <Text style={styles.goalRowLabel}>Daily Goal</Text>
          <Text style={styles.goalRowValue}>{dailyGoalMl.toLocaleString()} ml</Text>
          <View style={styles.goalRowEdit}>
            <Text style={styles.editText}>Edit</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={palette.accent} />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Goal Dialog */}
      <Portal>
        <Dialog visible={isEditGoalVisible} onDismiss={handleEditGoalCancel}>
          <Dialog.Title>Edit Daily Goal</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Goal (ml)"
              mode="outlined"
              keyboardType="number-pad"
              value={editGoalValue}
              onChangeText={handleEditGoalChange}
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleEditGoalCancel}>Cancel</Button>
            <Button onPress={handleEditGoalSave}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.bgPage,
  },
  scroll: {
    flex: 1,
    backgroundColor: palette.bgPage,
  },
  content: {
    padding: SPACING.LG,
    paddingBottom: SPACING.XXL,
  },
  card: {
    backgroundColor: palette.bgCard,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XL,
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  goalSubtext: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    marginTop: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: palette.textDisabled,
    borderRadius: BORDER_RADIUS.FULL,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: palette.accent,
    borderRadius: BORDER_RADIUS.FULL,
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
  },
  quickAddButton: {
    flex: 1,
    borderColor: palette.accent,
  },
  customAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.XS,
    marginBottom: SPACING.XL,
  },
  customAmountText: {
    fontSize: FONT_SIZE.MD,
    color: palette.accent,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
    paddingBottom: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  logTitle: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: palette.textPrimary,
  },
  clearAll: {
    fontSize: FONT_SIZE.SM,
    color: palette.error,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.SM,
    borderBottomWidth: 1,
    borderBottomColor: palette.borderSubtle,
  },
  entryIcon: {
    fontSize: 18,
    marginRight: SPACING.SM,
  },
  entryAmount: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: palette.textPrimary,
  },
  entryTime: {
    fontSize: FONT_SIZE.SM,
    color: palette.textSecondary,
    marginRight: SPACING.MD,
  },
  emptyText: {
    fontSize: FONT_SIZE.SM,
    color: palette.textTertiary,
    textAlign: 'center',
    paddingVertical: SPACING.XL,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.XL,
    paddingTop: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  goalRowLabel: {
    flex: 1,
    fontSize: FONT_SIZE.MD,
    color: palette.textPrimary,
  },
  goalRowValue: {
    fontSize: FONT_SIZE.MD,
    color: palette.textSecondary,
    marginRight: SPACING.SM,
  },
  goalRowEdit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: FONT_SIZE.SM,
    color: palette.accent,
  },
});
