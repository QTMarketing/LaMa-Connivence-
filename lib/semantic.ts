const CHIP_PAD = 'px-3 py-1 typography-caption font-semibold';

export type ChipKind = 'savings' | 'urgency' | 'info' | 'notice' | 'meta';

/** You keep money. Dusty sage — not brand orange. */
export function isSavingsLabel(label: string) {
  return /save|\boff\b|%|just \$|for \$/i.test(label);
}

/** Running out / ending. Dusty brick — not brand orange. */
export function isUrgencyLabel(label: string) {
  return /limited|ending|last chance|while supplies|only \d|sold out|expires/i.test(label);
}

/** New / just in. Universal blue. */
export function isInfoLabel(label: string) {
  return /new arrival|\bnew\b|just in/i.test(label);
}

/** Seasonal / not-yet-urgent notice. Amber, not orange. */
export function isNoticeLabel(label: string) {
  return /seasonal|holiday|fall|winter|summer/i.test(label);
}

export function chipKind(label: string): ChipKind {
  if (isUrgencyLabel(label)) return 'urgency';
  if (isSavingsLabel(label)) return 'savings';
  if (isInfoLabel(label)) return 'info';
  if (isNoticeLabel(label)) return 'notice';
  return 'meta';
}

const CHIP_CLASS: Record<ChipKind, string> = {
  savings: 'badge-savings',
  urgency: 'badge-urgency',
  info: 'badge-info',
  notice: 'badge-notice',
  meta: 'badge-meta',
};

export function statusChipClass(label: string) {
  return `${CHIP_CLASS[chipKind(label)]} ${CHIP_PAD}`;
}

/** @deprecated use statusChipClass — kept so existing imports keep working. */
export function savingsChipClass(label: string) {
  return statusChipClass(label);
}
