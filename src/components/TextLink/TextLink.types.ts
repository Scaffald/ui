import type { ReactNode } from 'react'
import type { PressableProps, TextStyle, ViewStyle } from 'react-native'

export interface TextLinkProps extends Omit<PressableProps, 'style' | 'children'> {
  /** The link's text — a verb phrase or a destination ("See all", "Open profile"). */
  children: ReactNode
  /** Trailing arrow, the prototype's "→". @default true */
  arrow?: boolean
  /** sm (default) sits in a section header; md stands alone under a block. */
  size?: 'sm' | 'md'
  /** Accent (default) or the secondary text colour, for a quiet link. */
  tone?: 'accent' | 'muted'
  style?: ViewStyle
  textStyle?: TextStyle
}
