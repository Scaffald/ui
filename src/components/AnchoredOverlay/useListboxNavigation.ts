/**
 * useListboxNavigation — the combobox/listbox wiring for an input with a menu.
 *
 * Spread `inputProps` on the input (role, aria-expanded, aria-controls,
 * aria-activedescendant, and an `onKeyPress` handling ArrowUp / ArrowDown /
 * Enter / Escape), `listboxProps` on the AnchoredOverlay, and
 * `getOptionProps(index)` on each row. If the input already has an
 * `onKeyPress`, call `handleKeyPress` from it instead.
 */

import { useCallback, useState } from 'react'

export interface UseListboxNavigationOptions {
  /** DOM id of the listbox; option ids are derived from it. */
  id: string
  /** Number of selectable rows currently shown. */
  itemCount: number
  open: boolean
  /** Enter on a highlighted row. */
  onSelectIndex: (index: number) => void
  /** Escape. */
  onClose?: () => void
  /** ArrowDown while closed. */
  onOpen?: () => void
}

interface KeyLike {
  nativeEvent?: { key?: string }
  key?: string
  preventDefault?: () => void
}

export interface ListboxInputProps {
  role: 'combobox'
  'aria-autocomplete': 'list'
  'aria-expanded': boolean
  'aria-controls': string
  'aria-activedescendant'?: string
  onKeyPress: (event: KeyLike) => void
}

export interface ListboxOptionProps {
  id: string
  role: 'option'
  'aria-selected': boolean
}

export function getListboxOptionId(listboxId: string, index: number): string {
  return `${listboxId}-option-${index}`
}

export function useListboxNavigation({
  id,
  itemCount,
  open,
  onSelectIndex,
  onClose,
  onOpen,
}: UseListboxNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(-1)

  // A new result set or a closed menu drops the highlight (reset during
  // render, React's pattern for state derived from props).
  const resetKey = `${open}:${itemCount}`
  const [lastResetKey, setLastResetKey] = useState(resetKey)
  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey)
    setActiveIndex(-1)
  }

  const handleKeyPress = useCallback(
    (event: KeyLike) => {
      const key = event?.nativeEvent?.key ?? event?.key
      switch (key) {
        case 'ArrowDown':
          event.preventDefault?.()
          if (!open) {
            onOpen?.()
            return
          }
          if (itemCount > 0) setActiveIndex((i) => (i + 1) % itemCount)
          return
        case 'ArrowUp':
          event.preventDefault?.()
          if (open && itemCount > 0) setActiveIndex((i) => (i <= 0 ? itemCount - 1 : i - 1))
          return
        case 'Enter':
          if (open && activeIndex >= 0 && activeIndex < itemCount) {
            event.preventDefault?.()
            onSelectIndex(activeIndex)
          }
          return
        case 'Escape':
          if (open) {
            event.preventDefault?.()
            onClose?.()
          }
          return
        default:
          return
      }
    },
    [open, itemCount, activeIndex, onSelectIndex, onClose, onOpen],
  )

  const inputProps: ListboxInputProps = {
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': open,
    'aria-controls': id,
    'aria-activedescendant':
      open && activeIndex >= 0 ? getListboxOptionId(id, activeIndex) : undefined,
    onKeyPress: handleKeyPress,
  }

  const listboxProps = { id, role: 'listbox' as const }

  const getOptionProps = useCallback(
    (index: number, selected?: boolean): ListboxOptionProps => ({
      id: getListboxOptionId(id, index),
      role: 'option',
      'aria-selected': selected ?? index === activeIndex,
    }),
    [id, activeIndex],
  )

  return {
    activeIndex,
    setActiveIndex,
    handleKeyPress,
    inputProps,
    listboxProps,
    getOptionProps,
  }
}
