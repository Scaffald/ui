/**
 * useWindowDimensions — hydration-safe.
 *
 * This used to be a bare re-export from react-native. React Native Web reads
 * `Dimensions` with no `getServerSnapshot`, so the server rendered at one
 * viewport and the client hydrated at another; every style derived from the
 * width then diverged and React discarded the tree (#625).
 *
 * The implementation now lives beside `useResponsive`, because it has to share
 * that hook's store to share its server snapshot. Re-exported from here so the
 * ~18 existing call sites need no change.
 */

export { useWindowDimensions } from './useResponsive'
