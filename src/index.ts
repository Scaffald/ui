/**
 * @scaffald/ui
 *
 * Next-generation custom UI component library
 * Built with inline styles for React Native and web
 *
 * @example
 * ```typescript
 * import { Button, TextInput } from '@scaffald/ui'
 * import { colors, spacing } from '@scaffald/ui/tokens'
 * ```
 */

// Export all tokens
export * from "./tokens";

// Export shared types and conventions
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ColorVariant,
//   ComponentSize,
//   ExtendedSize,
//   HelperTextProps,
//   IconComponent,
//   InteractiveState,
//   LabelProps,
//   SemanticType,
//   StyleVariant,
//   ThemeMode,
// } from "./components/types";

// Export icon utilities
export {
  getIconColor,
  getIconSize,
  getIconSizeForComponent,
} from "./utils/icon";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { IconSize } from "./utils/icon";

// Export error handling utilities
export { deprecated, invariant, warning } from "./utils/invariant";

// Export TipTap utilities (JSONContent helpers)
export { extractPlainText, plainTextToTipTap } from "./utils/tiptap";

// Export hooks
export { useResponsive, useSidebarState, useWindowDimensions } from "./hooks";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ResponsiveValue,
//   UseResponsiveReturn,
//   UseSidebarStateOptions,
// } from "./hooks";

// Export animation utilities
export {
  AnimatedPressable,
  // Core animated components
  AnimatedView,
  animationPresets,
  bezierCurves,
  // Transition components
  FadeTransition,
  isAnimatedPressAvailable,
  isReanimatedAvailable,
  ScaleTransition,
  SlideTransition,
  // Animation presets and configs
  springConfigs,
  timingConfigs,
  useAnimatedSpring,
  useAnimatedTiming,
  // Animation hooks
  useReducedMotion,
} from "./animation";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AnimatedPressableProps,
//   AnimatedViewProps,
//   BezierCurveKey,
//   EasingType,
//   FadeTransitionProps,
//   ScaleTransitionProps,
//   SlideAnimationType,
//   SlideDirection,
//   SlideTransitionProps,
//   SpringConfigKey,
//   TimingConfigKey,
//   UseAnimatedSpringOptions,
//   UseAnimatedSpringReturn,
//   UseAnimatedTimingOptions,
//   UseAnimatedTimingReturn,
// } from "./animation";

// Re-export ScrollView from react-native for convenience (RN-compatible)
export { ScrollView } from "react-native";

// Export platform utilities
export {
  isFocusVisibleActive,
  // Core platform utilities
  Platform,
  // Native-specific hooks
  useAccessibilityInfo,
  // Web-specific hooks
  useFocusVisible,
  // Haptic feedback
  useHaptics,
  useHoverState,
  // Platform detection hook
  usePlatform,
} from "./platform";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   FocusVisibleProps,
//   HapticImpactStyle,
//   HapticNotificationType,
//   HoverProps,
//   PlatformOS,
//   PlatformSelectOptions,
//   UseAccessibilityInfoReturn,
//   UseFocusVisibleReturn,
//   UseHapticsReturn,
//   UseHoverStateOptions,
//   UseHoverStateReturn,
//   UsePlatformReturn,
// } from "./platform";

// Export accessibility utilities
export {
  AnnouncerProvider,
  FocusGuard,
  getFocusRingStyles,
  LiveRegion,
  SkipLink,
  // Announcements
  useAnnouncer,
  useFocusRing,
  // Focus management
  useFocusTrap,
  // ID generation
  useId,
  useIds,
  useRovingTabIndex,
  // Components
  VisuallyHidden,
} from "./accessibility";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AccessibilityProps,
//   AccessibilityRole,
//   AccessibilityState,
//   Announcement,
//   AnnouncerContextValue,
//   AnnouncerProviderProps,
//   AriaAtomic,
//   // Types
//   AriaLive,
//   AriaRelevant,
//   FocusableElement,
//   FocusGuardProps,
//   FocusProps as A11yFocusProps,
//   FocusRingSize,
//   FocusRingVariant,
//   FocusTrapConfig,
//   LiveRegionProps,
//   NavigationKey,
//   RovingItemProps,
//   RovingTabIndexConfig,
//   SkipLinkProps,
//   UseFocusRingOptions,
//   UseFocusRingReturn,
//   // Hook returns
//   UseFocusTrapReturn,
//   UseRovingTabIndexOptions,
//   UseRovingTabIndexReturn,
//   // Component props
//   VisuallyHiddenProps,
// } from "./accessibility";

// Layout components
export { Box, Row, Separator, Spacer, Stack } from "./components/Layout";
export type {
  AlignItems,
  BoxProps,
  FlexDirection,
  FlexWrap,
  GapValue,
  JustifyContent,
  PaddingValue,
  Position,
  RowProps,
  SeparatorOrientation,
  SeparatorProps,
  SeparatorThickness,
  SpacerProps,
  SpacingValue,
  StackProps,
} from "./components/Layout";

// Grid component
export { Grid, GridItem } from "./components/Grid";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   GridAutoFlow,
//   GridItemProps,
//   GridProps,
//   GridTemplateColumns,
//   GridTemplateRows,
// } from "./components/Grid";

// Responsive utility components
export { Hide, Responsive, Show } from "./components/Responsive";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   HideProps,
//   ResponsiveProps,
//   ShowProps,
// } from "./components/Responsive";

// Typography components
export {
  Caption,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Heading,
  Label,
  Paragraph,
  Text,
} from "./components/Typography";
export type {
  BaseTextProps,
  CaptionProps,
  H1Props,
  H2Props,
  H3Props,
  H4Props,
  H5Props,
  H6Props,
  HeadingLevel,
  HeadingProps,
  ParagraphProps,
  TextAlign,
  TextColor,
  TextProps,
  TextSize,
  TextWeight,
} from "./components/Typography";
// Note: LabelProps from Typography is exported as FormLabelProps to avoid conflict with shared LabelProps
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { LabelProps as FormLabelProps } from "./components/Typography";

// Card components
export {
  Card,
  CardActions,
  CardBadges,
  CardContent,
  CardFooter,
  CardHeader,
  CardMedia,
  CardMetadata,
  SelectableCard,
} from "./components/Card";
export type {
  BadgeConfig,
  CardAction,
  CardActionsProps,
  CardBadgesProps,
  CardContentProps,
  CardElevation,
  CardFooterProps,
  CardHeaderProps,
  CardMediaProps,
  CardMetadataProps,
  CardPadding,
  CardProps,
  CardRadius,
  CardVariant,
  MetadataItem,
  SelectableCardProps,
} from "./components/Card";

// Liquid Glass components (iOS 26)
export { GlassSurface } from "./components/GlassSurface";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { GlassSurfaceProps, GlassSurfaceVariant } from "./components/GlassSurface";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { GlassPanel } from "./components/GlassPanel";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { GlassPanelProps } from "./components/GlassPanel";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { GlassIconButton } from "./components/GlassIconButton";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { GlassIconButtonProps, GlassIconButtonSize } from "./components/GlassIconButton";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { GlassGroup } from "./components/GlassGroup";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { GlassGroupProps } from "./components/GlassGroup";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { GlassSlider } from "./components/GlassSlider";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { GlassSliderProps } from "./components/GlassSlider";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { GlassWidget } from "./components/GlassWidget";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { GlassWidgetProps, GlassWidgetSize } from "./components/GlassWidget";

// iOS 26 Controls
export { SegmentedControl } from "./components/SegmentedControl";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { SegmentedControlProps } from "./components/SegmentedControl";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { PageControl } from "./components/PageControl";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { PageControlProps, PageControlVariant } from "./components/PageControl";

// iOS 26 Toolbar System
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { ToolbarButton } from "./components/ToolbarButton";
export type { ToolbarButtonProps, ToolbarButtonConfig, ToolbarButtonVariant } from "./components/ToolbarButton";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { ToolbarButtonGroup } from "./components/ToolbarButtonGroup";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ToolbarButtonGroupProps, ToolbarButtonGroupPosition } from "./components/ToolbarButtonGroup";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { ToolbarSearchBar } from "./components/ToolbarSearchBar";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ToolbarSearchBarProps } from "./components/ToolbarSearchBar";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { SearchAccessory } from "./components/SearchAccessory";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { SearchAccessoryProps, SearchAccessoryScope } from "./components/SearchAccessory";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { NavigationBar } from "./components/NavigationBar";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { NavigationBarProps, NavigationBarTitleSize, NavigationBarBackButton } from "./components/NavigationBar";

/** @deprecated Use BottomBar instead */
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { BottomToolbar } from "./components/BottomToolbar";
/** @deprecated Use BottomBar instead */
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { BottomToolbarProps, BottomToolbarVariant, BottomToolbarPageControl } from "./components/BottomToolbar";

// BottomBar — composable bottom bar system
export {
  BottomBar,
  BottomBarProvider,
  useBottomBarContext,
  BottomBarActions,
  BottomBarSearch,
  BottomBarPageControl,
  usePageBottomBar,
  useSearchSheet,
  useFilterSheet,
  useSortSheet,
} from "./components/BottomBar";
export type {
  BottomBarProps,
  BottomBarLevel,
  BottomBarActionsProps,
  BottomBarSearchProps,
  BottomBarPageControlProps,
  BottomBarPageControlConfig,
  BottomBarContextValue,
  FilterControl,
  SortOption,
  UseSearchSheetOptions,
  UseFilterSheetOptions,
  UseSortSheetOptions,
} from "./components/BottomBar";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { DiscoverCard } from "./components/DiscoverCard";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { DiscoverCardProps, DiscoverCardVariant } from "./components/DiscoverCard";

// Toast components
export {
  Toast,
  ToastContainer,
  ToastContext,
  ToastProvider,
  useToast,
} from "./components/Toast";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ShowToastOptions,
//   ToastAction,
//   ToastContainerProps,
//   ToastContextValue,
//   ToastData,
//   ToastPosition,
//   ToastProps,
//   ToastProviderProps,
//   ToastVariant,
// } from "./components/Toast";

// Skeleton components
export {
  Skeleton,
  SkeletonAvatar,
  SkeletonBox,
  SkeletonCard,
  SkeletonForm,
  SkeletonGroup,
  SkeletonList,
  SkeletonText,
} from "./components/Skeleton";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SkeletonAnimation,
//   SkeletonAvatarProps,
//   SkeletonBoxProps,
//   SkeletonCardProps,
//   SkeletonFormProps,
//   SkeletonGroupProps,
//   SkeletonListProps,
//   SkeletonProps,
//   SkeletonShape,
//   SkeletonTextProps,
// } from "./components/Skeleton";

export { EmptyState, ErrorState, LoadingState } from "./components/States";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   EmptyStateProps,
//   ErrorStateProps,
//   LoadingStateProps,
// } from "./components/States";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export {
//   Checklist,
//   ChecklistHeader,
//   ChecklistItem,
//   ChecklistList,
//   ChecklistProgress,
// } from "./components/Checklist";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ChecklistHeaderProps,
//   ChecklistItemData,
//   ChecklistItemProps,
//   ChecklistListProps,
//   ChecklistProgressProps,
//   ChecklistProps,
// } from "./components/Checklist";

export {
  COOKIE_CONSENT_DEFAULTS,
  CookieConsentBanner,
  CookieConsentProvider,
  CookiePreferencesDialog,
  useCookieConsent,
} from "./components/CookieConsent";
export type {
  CookieConsentBannerProps,
  CookieConsentCategory,
  CookieConsentCategoryId,
  CookieConsentProviderProps,
  CookieConsentSelections,
  CookieConsentState,
  CookieConsentStorage,
} from "./components/CookieConsent";

export {
  AvatarCropModal,
  AvatarImagePicker,
  useFilePicker,
} from "./components/ImagePicker";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AvatarCropModalProps,
//   AvatarImagePickerProps,
//   OnPickImage,
//   UseFilePickerImageProps,
//   UseFilePickerImageResult,
// } from "./components/ImagePicker";

export { KanbanBoard, KanbanCard, KanbanColumn } from "./components/Kanban";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   KanbanBoardProps,
//   KanbanCardData,
//   KanbanCardProps,
//   KanbanColumnConfig,
//   KanbanColumnProps,
// } from "./components/Kanban";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { DEFAULT_ICON_NAMES, IconSelector } from "./components/IconSelector";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   DefaultIconName,
//   IconSelectorProps,
// } from "./components/IconSelector";

export { NotificationTag } from "./components/NotificationTag";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   NotificationTagProps,
//   NotificationTagSize,
// } from "./components/NotificationTag";

export {
  MapContainer,
  MapFallback,
  MapPin,
  MapTooltip,
} from "./components/Maps";
export type {
  MapContainerProps,
  MapContainerRef,
  MapCoordinate,
  MapFallbackProps,
  MapPinProps,
  MapTooltipData,
  MapTooltipProps,
  ViewportBounds,
} from "./components/Maps";

export {
  AddressAutocomplete,
  AddressForm,
  LocationListInput,
  useAddressAutocomplete,
} from "./components/Address";
export type {
  AddressAutocompleteProps,
  AddressFormProps,
  AddressResult,
  AddressSearchOptions,
  GeocodingProvider,
  LocationListInputProps,
} from "./components/Address";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   UseAddressAutocompleteConfig,
//   UseAddressAutocompleteReturn,
// } from "./components/Address";

export { RichTextEditor } from "./components/RichTextEditor";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { RichTextEditorProps } from "./components/RichTextEditor";

// Components
export { Button } from "./components/Button";
export type {
  ButtonColor,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./components/Button";

export { SocialButton } from "./components/SocialButton";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SocialBrand,
//   SocialButtonProps,
//   SocialButtonStyle,
// } from "./components/SocialButton";

export { SocialLoginGroup } from "./components/SocialLoginGroup";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { SocialLoginGroupProps } from "./components/SocialLoginGroup";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { IconApple, IconGoogle } from "./components/Icons";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { IconAppleProps, IconGoogleProps } from "./components/Icons";

export { AppStoreButton } from "./components/AppStoreButton";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AppStore,
//   AppStoreButtonProps,
//   AppStoreButtonStyle,
// } from "./components/AppStoreButton";

export { ButtonGroup } from "./components/ButtonGroup";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ButtonGroupItem,
//   ButtonGroupMode,
//   ButtonGroupOrientation,
//   ButtonGroupProps,
//   ButtonGroupSize,
// } from "./components/ButtonGroup";

export { Input, PasswordInput, TextArea } from "./components/Input";
export { UploadSurface } from "./components/UploadSurface";
export type { UploadSelection, UploadSurfaceProps } from "./components/UploadSurface";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   InputProps,
//   InputState,
//   InputType,
//   PasswordInputProps,
//   TextAreaProps,
// } from "./components/Input";

// Input composable sub-components
export {
  InputExternalAddon,
  InputHelperText,
  InputLabel,
  InputLeftSide,
  InputRightSide,
} from "./components/Input";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   InputExternalAddonProps,
//   InputHelperTextProps,
//   InputHelperTextType,
//   InputLabelProps,
//   InputLabelType,
//   InputLeftSideProps,
//   InputRightSideProps,
// } from "./components/Input";

export { PhoneNumberInput } from "./components/PhoneNumberInput";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { PhoneNumberInputProps } from "./components/PhoneNumberInput";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { Country } from "./config/countries";

export { Dropdown } from "./components/Dropdown";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   DropdownItemState,
//   DropdownItemType,
//   DropdownPosition,
//   DropdownProps,
// } from "./components/Dropdown";

// Dropdown composable sub-components
export {
  DropdownItem,
  DropdownMenu,
  DropdownSection,
} from "./components/Dropdown";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   DropdownItemProps,
//   DropdownMenuProps,
//   DropdownSectionProps,
// } from "./components/Dropdown";

export { Checkbox } from "./components/Checkbox";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CheckboxColor,
//   CheckboxProps,
//   CheckboxSize,
//   CheckboxState,
// } from "./components/Checkbox";

export { CheckboxTree } from "./components/Checkbox/CheckboxTree";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CheckboxTreeNode,
//   CheckboxTreeProps,
// } from "./components/Checkbox/CheckboxTree";

// Checkbox Tree utilities
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export {
//   findNode,
//   getAllNodeIds,
//   getCheckedNodeIds,
//   getLeafNodeIds,
//   updateNodeChecked,
// } from "./components/Checkbox/CheckboxTree.utils";

export { Radio } from "./components/Radio";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   RadioColor,
//   RadioProps,
//   RadioSize,
//   RadioState,
// } from "./components/Radio";

export { RadioGroup } from "./components/Radio";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   RadioGroupOption,
//   RadioGroupOrientation,
//   RadioGroupProps,
// } from "./components/Radio";

export { Toggle } from "./components/Toggle";
export { Toggle as Switch } from "./components/Toggle";
export { Toggle as ToggleSwitch } from "./components/Toggle";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ToggleColor,
//   ToggleProps,
//   ToggleSize,
//   ToggleState,
// } from "./components/Toggle";

export { SelectionCard } from "./components/SelectionCard";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SelectionCardLeadingType,
//   SelectionCardProps,
//   SelectionCardType,
// } from "./components/SelectionCard";

export { Chip } from "./components/Chip";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ChipProps, ChipSize, ChipType } from "./components/Chip";

export { Accordion } from "./components/Accordion";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AccordionContentProps,
//   AccordionItemProps,
//   AccordionMode,
//   AccordionProps,
//   AccordionTriggerProps,
//   AccordionValue,
//   AccordionWidth,
// } from "./components/Accordion";

export { AddAvatar, Avatar, AvatarGroup } from "./components/Avatar";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AddAvatarProps,
//   AvatarColor,
//   AvatarGroupProps,
//   AvatarProps,
//   AvatarSize,
//   AvatarStatus,
// } from "./components/Avatar";

export { Alert } from "./components/Alert";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AlertAction,
//   AlertActionsPosition,
//   AlertButtonLayout,
//   AlertProps,
//   AlertTextField,
//   AlertType,
//   AlertVariant,
// } from "./components/Alert";

// iOS 26 Components
export { ActionSheet } from "./components/ActionSheet";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ActionSheetAction, ActionSheetProps } from "./components/ActionSheet";

export { ActivityView } from "./components/ActivityView";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ActivityViewAction,
//   ActivityViewApp,
//   ActivityViewContact,
//   ActivityViewListItem,
//   ActivityViewProps,
//   ActivityViewSection,
// } from "./components/ActivityView";

export { ContextMenu } from "./components/ContextMenu";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   ContextMenuAction,
//   ContextMenuProps,
//   ContextMenuQuickAction,
//   ContextMenuSection,
// } from "./components/ContextMenu";

export { EditMenu } from "./components/EditMenu";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { EditMenuAction, EditMenuProps } from "./components/EditMenu";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { ListItemAccessory } from "./components/ListItemAccessory";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ListItemAccessoryProps, ListItemAccessoryType } from "./components/ListItemAccessory";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { NumericStepper } from "./components/NumericStepper";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { NumericStepperProps } from "./components/NumericStepper";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { TabBar } from "./components/TabBar";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { TabBarItem, TabBarProps } from "./components/TabBar";

export { NavigationList } from "./components/NavigationList";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   NavigationListItem,
//   NavigationListProps,
//   NavigationListSection,
//   NavigationListToolbarAction,
// } from "./components/NavigationList";

export { StatusIndicator } from "./components/StatusIndicator";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   StatusIndicatorIconType,
//   StatusIndicatorProps,
//   StatusIndicatorStyle,
//   StatusIndicatorType,
// } from "./components/StatusIndicator";

export { Pagination } from "./components/Pagination";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   PaginationPosition,
//   PaginationProps,
//   PaginationRadius,
//   PaginationType,
// } from "./components/Pagination";

export { CarouselArrows, CarouselDots } from "./components/CarouselPager";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CarouselArrowsProps,
//   CarouselDotsProps,
// } from "./components/CarouselPager";

export { Step, Stepper } from "./components/Stepper";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { Breadcrumb as BreadcrumbDeprecated } from "./components/Stepper";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   StepData,
//   StepperColor,
//   StepperProps,
//   StepProps,
//   StepStatus,
// } from "./components/Stepper";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { BreadcrumbProps as BreadcrumbDeprecatedProps } from "./components/Stepper";

export {
  HintMessage,
  ProgressBar,
  ProgressBarBase,
  ProgressIndicator,
} from "./components/ProgressBar";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   HintMessageProps,
//   HintMessageType,
//   ProgressBarBaseProps,
//   ProgressBarColor,
//   ProgressBarOrientation,
//   ProgressBarProps,
//   ProgressIndicatorIconType,
//   ProgressIndicatorProps,
// } from "./components/ProgressBar";

export {
  formatRelativeTime,
  SaveStatusIndicator,
  SavingModal,
} from "./components/SaveStatusIndicator";
export type {
  SaveStatus,
  SaveStatusIndicatorProps,
  SavingModalProps,
} from "./components/SaveStatusIndicator";

// Shared components
export { HelperText } from "./components/HelperText";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { HelperTextType } from "./components/HelperText";

export { FieldError } from "./components/FieldError";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { FieldErrorProps } from "./components/FieldError";

export { CancelIcon, CheckIcon, Icon, InfoIcon } from "./components/Icon";
export { IconCircle } from "./components/IconCircle";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { IconCircleProps } from "./components/IconCircle";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CancelIconProps,
//   CheckIconProps,
//   IconProps,
//   InfoIconProps,
// } from "./components/Icon";

export { PasswordStrength } from "./components/PasswordStrength";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   PasswordRequirement,
//   PasswordStrengthLevel,
//   PasswordStrengthProps,
//   PasswordStrengthVariant,
// } from "./components/PasswordStrength";

export { Spinner } from "./components/Spinner";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SpinnerColor,
//   SpinnerProps,
//   SpinnerSize,
// } from "./components/Spinner";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { FullscreenSpinner, LoadingOverlay } from "./components/LoadingOverlay";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   FullscreenSpinnerProps,
//   LoadingOverlayProps,
// } from "./components/LoadingOverlay";

export {
  Onboarding,
  OnboardingControls,
  OnboardingStepContent,
} from "./components/Onboarding";
export type {
  OnboardingControlsProps,
  OnboardingProps,
  OnboardingStepContentProps,
  OnboardingStepInfo,
} from "./components/Onboarding";

export { RangeSlider, Slider } from "./components/Slider";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   RangeSliderProps,
//   RangeSliderSize,
//   SliderColor,
//   SliderHandleState,
//   SliderIndicatorPosition,
//   SliderProps,
// } from "./components/Slider";

export { FileUpload } from "./components/FileUpload";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   FileUploadDropZoneProps,
//   FileUploadItemProps,
//   FileUploadListProps,
//   FileUploadProgressProps,
//   FileUploadProps,
//   FileUploadStatus,
//   FileUploadVariant,
//   UploadedFile,
// } from "./components/FileUpload";

// FileUpload composable sub-components
export {
  FileUploadDropZone,
  FileUploadItem,
  FileUploadList,
  FileUploadProgress,
} from "./components/FileUpload";

// FileUpload utility functions
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export {
//   fileToUploadedFile,
//   formatFileSize,
//   generateFileId,
//   getFileIcon,
//   validateFile,
// } from "./components/FileUpload";

export { Breadcrumb } from "./components/Breadcrumb";
export type {
  BreadcrumbItemData,
  BreadcrumbItemProps,
  BreadcrumbItemState,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from "./components/Breadcrumb";

// Breadcrumb composable sub-components
export { BreadcrumbItem, BreadcrumbSeparator } from "./components/Breadcrumb";

export { Tabs } from "./components/Tabs";
export type {
  TabColor,
  TabContentProps,
  TabContentVariant,
  TabItemProps,
  TabOrientation,
  TabSize,
  TabsProps,
  TabState,
  TabTriggerProps,
  TabType,
} from "./components/Tabs";

export { Tooltip } from "./components/Tooltip";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   TooltipAction,
//   TooltipArrowPosition,
//   TooltipArrowProps,
//   TooltipColor,
//   TooltipContentProps,
//   TooltipProps,
//   TooltipStyleConfig,
//   TooltipType,
//   TriggerLayout,
// } from "./components/Tooltip";

export { Sidebar, useSidebarContext } from "./components/Sidebar";
export {
  SidebarFooter,
  SidebarHeader,
  SidebarItemGroup,
  SidebarMenuItem,
  SidebarWidget,
} from "./components/Sidebar";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SidebarFooterProps,
//   SidebarHeaderProps,
//   SidebarItemGroupProps,
//   SidebarItemState,
//   SidebarItemType,
//   SidebarMenuItemProps,
//   SidebarProps,
//   SidebarVariant,
//   SidebarWidgetProps,
//   SidebarWidgetType,
// } from "./components/Sidebar";

export { TradeControls } from "./components/TradeControls";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   TradeAsset,
//   TradeControlsProps,
//   TradeMode,
// } from "./components/TradeControls";

// Navigation components
export { NavIconButton } from "./components/NavIconButton";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   NavIconButtonBadge,
//   NavIconButtonProps,
//   NavIconButtonState,
//   NavIconButtonVariant,
// } from "./components/NavIconButton";

export { NotificationListItem } from "./components/NotificationListItem";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   NotificationAction,
//   NotificationFile,
//   NotificationLink,
//   NotificationListItemProps,
//   NotificationListItemVariant,
//   NotificationState,
// } from "./components/NotificationListItem";

export { SaaSSectionHeader } from "./components/SaaSSectionHeader";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SaaSSectionHeaderProps,
//   SaaSSectionHeaderVariant,
//   SectionHeaderAction,
//   TimePeriodOption,
// } from "./components/SaaSSectionHeader";

export { SaaSNavigation } from "./components/SaaSNavigation";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   NavigationAction,
//   NavigationAvatar,
//   SaaSNavigationProps,
//   SaaSNavigationVariant,
// } from "./components/SaaSNavigation";

// DatePicker components
export { DatePickerDay } from "./components/DatePickerDay";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   DatePickerDayProps,
//   DatePickerDayState,
// } from "./components/DatePickerDay";

export { DatePickerHeader } from "./components/DatePickerHeader";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   DatePickerHeaderPosition,
//   DatePickerHeaderProps,
//   DatePickerHeaderType,
// } from "./components/DatePickerHeader";

export { DatePickerBase } from "./components/DatePickerBase";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { DatePickerBaseProps } from "./components/DatePickerBase";

export { DatePicker } from "./components/DatePicker";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   DatePickerPresetOption,
//   DatePickerProps,
//   DatePickerSize,
//   DatePickerType,
// } from "./components/DatePicker";

export {
  ExpandedTableRow,
  Table,
  TableActionBar,
  TableAddRecordModal,
  TableCell,
  TableColumnHeader,
  TableColumnVisibilityModal,
} from "./components/Table";
export type {
  ExpandedTableRowProps,
  ExpandedTableRowVariant,
  SortDirection,
  TableActionBarProps,
  TableAddRecordModalProps,
  TableCellAlign,
  TableCellProps,
  TableCellState,
  TableCellType,
  TableColumn,
  TableColumnHeaderAlign,
  TableColumnHeaderProps,
  TableColumnHeaderState,
  TableColumnVisibilityModalProps,
  TableColumnVisibilityOption,
  TableExpansionConfig,
  TableHeaderAction,
  TableProps,
  TableRowData,
  TableSelectionConfig,
  TableSortConfig,
} from "./components/Table";

export {
  ConfirmationModal,
  EcommerceCartPreviewModal,
  EcommerceShippingModal,
  Modal,
  Modal as Dialog,
  ResponsiveModal,
  ModalActions,
  ModalContent,
  ModalHeader,
  WorkspaceMembersModal,
} from "./components/Modal";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CartItem,
//   ConfirmationModalProps,
//   EcommerceCartPreviewModalProps,
//   EcommerceShippingModalProps,
//   Member,
//   ModalAction,
//   ModalActionsOrientation,
//   ModalActionsProps,
//   ModalContentProps,
//   ModalContentVariant,
//   ModalHeaderOrientation,
//   ModalHeaderProps,
//   ModalProps,
//   ShippingOption,
//   WorkspaceMembersModalProps,
// } from "./components/Modal";

// Sheet components (bottom sheet/drawer)
export {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "./components/Sheet";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SheetAnimation,
//   SheetContentProps,
//   SheetFooterProps,
//   SheetHeaderButton,
//   SheetHeaderProps,
//   SheetHeight,
//   SheetProps,
// } from "./components/Sheet";

// Popover components
export {
  Popover,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "./components/Popover";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   PopoverContentProps,
//   PopoverFooterProps,
//   PopoverHeaderProps,
//   PopoverPlacement,
//   PopoverProps,
//   PopoverTrigger,
// } from "./components/Popover";

// Form layout components
export {
  Fieldset,
  Form,
  FormActions,
  FormField,
  FormRow,
} from "./components/Form";
export type {
  FieldsetProps,
  FormActionsProps,
  FormFieldProps,
  FormProps,
  FormRowProps,
} from "./components/Form";

// SearchSelect component
export { SearchSelect } from "./components/SearchSelect";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SearchSelectOption,
//   SearchSelectProps,
// } from "./components/SearchSelect";

// ResponsiveSelect and AdaptiveSelectSheet
export {
  AdaptiveSelectSheet,
  ResponsiveSelect,
} from "./components/ResponsiveSelect";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AdaptiveSelectSheetProps,
//   ResponsiveSelectOption,
//   ResponsiveSelectProps,
//   ResponsiveSelectSize,
// } from "./components/ResponsiveSelect";

// ScrollArea component
export { ScrollArea, scrollTo, scrollToEnd } from "./components/ScrollArea";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ScrollAreaProps } from "./components/ScrollArea";

export { List } from "./components/List";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ListProps } from "./components/List";

export {
  CloudFileListItem,
  IntegrationListItem,
  ListItem,
  PhoneNumberListItem,
  ProductListItem,
  SearchResult01ListItem,
  SearchResult02ListItem,
  SearchResult03ListItem,
  SongTitleListItem,
  TaskListItem,
  // ListItem variant components
  UserProfile01ListItem,
  UserProfile02ListItem,
} from "./components/ListItem";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CloudFileProps,
//   IntegrationProps,
//   ListItemProps,
//   ListItemVariant,
//   PhoneNumberProps,
//   ProductProps,
//   SearchResult01Props,
//   SearchResult02Props,
//   SearchResult03Props,
//   SongTitleProps,
//   TaskProps,
//   UserProfile01Props,
//   UserProfile02Props,
// } from "./components/ListItem";

// Table shared types
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { TableStyleConfig } from "./components/Table";

export { BarChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { BarChartProps } from "./components/Chart";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { BarChartBase } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { BarChartBaseProps } from "./components/Chart";

export { LinearChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { LinearChartProps } from "./components/Chart";

export { DonutChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { DonutChartProps } from "./components/Chart";

export { CircleChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { CircleChartProps } from "./components/Chart";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { HalfPieChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { HalfPieChartProps } from "./components/Chart";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { MiniLinearChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { MiniLinearChartProps } from "./components/Chart";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { SmallCircleChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { SmallCircleChartProps } from "./components/Chart";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { StackedBarChart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   StackedBarChartData,
//   StackedBarChartProps,
//   StackedBarChartStack,
// } from "./components/Chart";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { PopulationPyramid } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   PopulationPyramidData,
//   PopulationPyramidProps,
// } from "./components/Chart";

export { Chart } from "./components/Chart";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ChartProps } from "./components/Chart";

// Chart shared types
export type {
  ChartColorScheme,
  ChartDataPoint,
  ChartPeriod,
  ChartSeries,
  ChartSize,
  ChartStyleConfig,
  CircleChartSize,
  DonutChartData,
  HalfPieChartSize,
} from "./components/Chart";

// Widget components
export { DashboardWidget, DashboardWidgetHeader } from "./components/Widgets/DashboardWidget";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { DashboardWidgetProps, DashboardWidgetHeaderProps } from "./components/Widgets/DashboardWidget";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { LegendIndicator } from "./components/Widgets/LegendIndicator";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   LegendIndicatorProps,
//   LegendItem,
// } from "./components/Widgets/LegendIndicator";

export {
  CircleChart as CircleChartWidget,
  DonutChart as DonutChartWidget,
  LinearChart as LinearChartWidget,
  PieChart as PieChartWidget,
} from "./components/Widgets/Charts";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CircleChartWidgetProps,
//   DonutChartWidgetProps,
//   LinearChartWidgetProps,
//   PieChartWidgetProps,
//   WidgetChartDataPoint,
// } from "./components/Widgets/Charts";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export { MetricWidget } from "./components/Widgets/Metrics";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   MetricChangeType,
//   MetricWidgetProps,
//   MetricWidgetType,
// } from "./components/Widgets/Metrics";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export {
//   BalanceWidget,
//   ContactsWidget,
//   CreditCardWidget,
//   CurrencyConverterWidget,
//   EarningsWidget,
//   LargeBalanceWidget,
//   SpendingLimitWidget,
//   SubscriptionsWidget,
//   TransactionsWidget,
//   VirtualCardsWidget,
// } from "./components/Widgets/Finance";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   BalanceWidgetProps,
//   BalanceWidgetVariant,
//   Contact,
//   ContactsWidgetProps,
//   CreditCardWidgetProps,
//   CreditCardWidgetVariant,
//   CurrencyConverterWidgetProps,
//   EarningsDataItem,
//   EarningsWidgetProps,
//   LargeBalanceChartData,
//   LargeBalanceWidgetProps,
//   SpendingLimitWidgetProps,
//   SpendingLimitWidgetVariant,
//   Subscription,
//   SubscriptionsWidgetProps,
//   Transaction,
//   TransactionsWidgetProps,
//   VirtualCard,
//   VirtualCardsWidgetProps,
// } from "./components/Widgets/Finance";

// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export {
//   CryptoBalanceWidget,
//   CryptoConverterWidget,
//   CryptoSinglePriceWidget,
//   CryptoStockWidget,
//   FearGreedIndexWidget,
//   MarketTrendingWidget,
// } from "./components/Widgets/Crypto";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CryptoBalanceWidgetProps,
//   CryptoConverterWidgetProps,
//   CryptoSinglePriceWidgetProps,
//   CryptoStockWidgetProps,
//   CryptoStockWidgetVariant,
//   FearGreedIndexWidgetProps,
//   MarketTrendingWidgetProps,
// } from "./components/Widgets/Crypto";

// Command Menu components
export { CommandMenu } from "./components/CommandMenu";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CommandMenuProps,
//   CommandMenuTab,
// } from "./components/CommandMenu";

export { CommandMenuItem } from "./components/CommandMenu";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CommandMenuItemData,
//   CommandMenuItemOrientation,
//   CommandMenuItemProps,
//   CommandMenuItemState,
//   CommandMenuItemType,
// } from "./components/CommandMenu";

export { CommandShortcut } from "./components/CommandMenu";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CommandShortcutProps,
//   CommandShortcutVariant,
// } from "./components/CommandMenu";

export { CommandMenuFooter } from "./components/CommandMenu";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   CommandMenuFooterProps,
//   ShortcutHint,
// } from "./components/CommandMenu";

// Settings components
export { AppearanceThemeCard } from "./components/AppearanceThemeCard";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AppearanceThemeCardProps,
//   AppearanceThemeCardStyleConfig,
//   AppearanceThemeCardVariant,
// } from "./components/AppearanceThemeCard";

export { SettingsSectionHeader } from "./components/SettingsSectionHeader";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SettingsSectionHeaderProps,
//   SettingsSectionHeaderStyleConfig,
// } from "./components/SettingsSectionHeader";

export { SettingsFormField } from "./components/SettingsFormField";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { SettingsFormFieldProps } from "./components/SettingsFormField";

export { SettingsToggleCard } from "./components/SettingsToggleCard";
export type {
  SettingsToggleCardProps,
  SettingsToggleCardStyleConfig,
} from "./components/SettingsToggleCard";

export { SettingsNotificationTable } from "./components/SettingsNotificationTable";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   NotificationPreference,
//   SettingsNotificationTableProps,
// } from "./components/SettingsNotificationTable";

export { SettingsTeamTable } from "./components/SettingsTeamTable";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SettingsTeamTableProps,
//   TeamMember,
// } from "./components/SettingsTeamTable";

export { SettingsIntegrationsGrid } from "./components/SettingsIntegrationsGrid";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   Integration,
//   SettingsIntegrationsGridProps,
// } from "./components/SettingsIntegrationsGrid";

export { SettingsPageLayout } from "./components/SettingsPageLayout";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   SettingsPageLayoutProps,
//   SettingsTab,
// } from "./components/SettingsPageLayout";

// Assessment components
export {
  AssessmentHeader,
  AssessmentOptionCard,
  AssessmentProgressBar,
  AssessmentStepTransition,
  TraitScoreCard,
} from "./components/Assessment";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type {
//   AssessmentHeaderProps,
//   AssessmentOptionCardProps,
//   AssessmentProgressBarProps,
//   AssessmentStepTransitionProps,
//   TraitScoreCardProps,
// } from "./components/Assessment";

// Note: Additional components will be exported here as they are implemented
// Phase 1: Layout primitives (Box ✅, Stack ✅, Row ✅, Spacer ✅, Separator ✅)
// Phase 2: Core components (Input ✅, Checkbox ✅, Radio ✅, Toggle ✅) - Button ✅
// Phase 3: Feedback components (Alert ✅, Toast)
// Phase 4+: Complex components (Dialog, Popover, Select, Tooltip ✅, etc.)

// Theme system
export { ThemeContext, ThemeProvider, useThemeContext } from "./theme";
// [SC-27 hidden 2026-06-23 — dead export, see UI-KIT-INVENTORY.md]
// export type { ThemeContextValue } from "./theme";

/**
 * Package version
 */
export const VERSION = "0.1.0";

/**
 * Package metadata
 */
export const PACKAGE_NAME = "@scaffald/ui";
export const PACKAGE_DESCRIPTION =
  "Custom UI component library - Next generation of @unicornlove/ui";
