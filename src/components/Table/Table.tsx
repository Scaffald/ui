/**
 * Table component
 * Comprehensive table component with sorting, selection, expansion, and pagination.
 * Renders a grid on web and labelled cards on native; rows are bounded by
 * pagination, not virtualised.
 */

import { Fragment, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { View, Text, ScrollView, Pressable, Platform } from 'react-native'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import type { TableColumn, TableProps, TableRowData } from './Table.types'
import { getTableStyles } from './Table.styles'
import { useStyles } from '../../hooks'
import { useResponsive } from '../../hooks/useResponsive'
import { useThemeContext } from '../../theme'
import { TableColumnHeader } from './TableColumnHeader'
import { TableCell } from './TableCell'
import { ExpandedTableRow } from './ExpandedTableRow'
import { Input } from '../Input'
import { Button } from '../Button'
import { Pagination } from '../Pagination'
import { colors } from '../../tokens/colors'
import { spacing } from '../../tokens/spacing'
import { useTable } from './useTable'

/**
 * Which columns become labelled lines in a stacked row.
 *
 * The checkbox, the expander and `headerEmpty` spacers are table chrome: they
 * have no heading, so stacking them prints a line with a blank label and a
 * blank value. Only columns that carry a title say anything.
 *
 * Exported because it is the part of stacking worth pinning in a unit test;
 * the rendered form is measured by scripts/audit/smoke-wide-tables.mjs
 * against the real app.
 */
/**
 * Grid or cards?
 *
 * On web the answer is the viewport: below `stackBelow` the grid does not fit.
 * On native the answer is always cards. The grid mode is a web layout — a
 * horizontal ScrollView around a body-wide View of header and rows — and
 * Yoga laid its earlier FlatList form out as an empty header block, a row of
 * sort glyphs, and cells drawn over each other. That
 * is what every Office table showed on an iPad (#768): at 768pt portrait it
 * was not even below the default breakpoint, and in landscape it never would
 * be. Cards are the native-safe rendering at every width; `stackBelow` still
 * governs web.
 */
/**
 * What a stacked line shows for a cell. Strings, numbers and empty values
 * become a <Text>; anything else (a rendered element) is used as-is.
 */
export function stackedCellContent(value: unknown, color: string): ReactNode {
  if (value === null || value === undefined || value === '') {
    return <Text style={{ color, fontSize: 14 }}>—</Text>
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return <Text style={{ color, fontSize: 14 }}>{String(value)}</Text>
  }
  return value as ReactNode
}

export function shouldStackTable(
  platformOS: string,
  viewportWidth: number,
  stackBelow: number
): boolean {
  if (platformOS !== 'web') return true
  return viewportWidth > 0 && viewportWidth < stackBelow
}

/**
 * How a grid column takes its width.
 *
 * A declared width is fixed (a number) or proportional (a percentage). A
 * column with no declared width shares whatever the row has left, and never
 * drops below `DEFAULT_COLUMN_WIDTH` — the same figure the row's total width
 * is built from, so the header and every cell agree.
 *
 * Before this, an undeclared column got no width at all: the header cell sized
 * to its title and sort glyph, each data cell to its own text, and the row's
 * wrapper to 150px per column. On the storage table that put a 124px "Total
 * Usage" heading over a 54px "65.0 MB" cell, every row's values running into
 * each other (#799).
 */
export const DEFAULT_COLUMN_WIDTH = 150

export function columnSizing(width: number | string | undefined): ViewStyle {
  if (typeof width === 'number') {
    return { flexGrow: 0, flexShrink: 0, width, minWidth: width }
  }
  if (typeof width === 'string' && width.trim().endsWith('%')) {
    return { flexGrow: 0, flexShrink: 0, width: width.trim() as `${number}%` }
  }
  return { flexGrow: 1, flexShrink: 0, flexBasis: 0, minWidth: DEFAULT_COLUMN_WIDTH }
}

export function stackedDataColumns(columns: TableColumn[], selectableRows = false): TableColumn[] {
  return columns.filter(
    (c) => Boolean(c.title) && !c.headerEmpty && !(selectableRows && c.showCheckbox)
  )
}

export function Table({
  columns,
  data,
  showHeader = true,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchValue: controlledSearchValue,
  onSearchChange,
  actions = [],
  pagination,
  expandableRows = false,
  expansionConfig: controlledExpansionConfig,
  onRowExpand,
  selectableRows = false,
  selectionConfig: controlledSelectionConfig,
  onRowSelect,
  sortConfig: controlledSortConfig,
  onSort,
  renderExpandedRow,
  renderEmpty,
  renderLoading,
  loading = false,
  emptyMessage = 'No data available',
  style,
  headerStyle,
  bodyStyle,
  footerStyle,
  onRowPress,
  rowPressable = true,
  columnVisibility,
  pageSize,
  getRowId: getRowIdProp,
  stackBelow = 768,
}: TableProps) {
  const { theme } = useThemeContext()
  const styles = useStyles(getTableStyles, [theme] as const)
  const { width: viewportWidth } = useResponsive()

  // Below `stackBelow` a row becomes a key–value card instead of a slice of a
  // sideways-scrolling grid.
  //
  // Measured on the screening queue at 390px: 1,050px of columns inside a
  // 342px viewport — 708px of every row parked off-frame, with nothing on
  // screen to say it was there. That is the same answer the kanban board gave
  // to "more stages", and the same reason Lanes exists.
  const stacked = shouldStackTable(Platform.OS, viewportWidth, stackBelow)

  // The grid's rows are as wide as the body or the columns, whichever is
  // more. The body's width is only known once it is laid out; until then the
  // rows take the columns' total, which is what they were always given.
  const [bodyWidth, setBodyWidth] = useState(0)
  const onBodyLayout = useCallback((event: LayoutChangeEvent) => {
    setBodyWidth(event.nativeEvent.layout.width)
  }, [])

  const table = useTable({
    columns,
    data,
    searchValue: controlledSearchValue,
    onSearchChange,
    sortConfig: controlledSortConfig,
    onSort,
    selectionConfig: controlledSelectionConfig,
    onRowSelect,
    expansionConfig: controlledExpansionConfig,
    onRowExpand,
    pageSize,
    pagination,
    columnVisibility,
  })

  // Calculate total column width for proper horizontal scrolling
  const totalColumnWidth = useMemo(
    () =>
      table.visibleColumns.reduce((sum, col) => {
        if (typeof col.width === 'number') {
          return sum + col.width
        }
        return sum + DEFAULT_COLUMN_WIDTH
      }, 0),
    [table.visibleColumns]
  )

  const renderRow = useCallback(
    ({ item: row, index: rowIndex }: { item: TableRowData; index: number }) => {
      const getRowId = getRowIdProp ?? ((r, i) => r.id ?? String(i))
      const rowId = getRowId(row, rowIndex)
      const isExpanded = table.expansionConfig.expandedIds.has(rowId)
      const isSelected = table.selectionConfig.selectedIds.has(rowId)
      const isPressable = onRowPress && rowPressable

      // ── Stacked: one card per row, each cell labelled by its column ──
      //
      // Only columns that carry a heading become lines. The checkbox, the
      // expander and `headerEmpty` spacers are table chrome — they have no
      // label to show and stacking them would print blank rows.
      if (stacked) {
        const dataColumns = stackedDataColumns(table.visibleColumns, selectableRows)

        const card = (
          <View style={[styles.stackedCard, { borderBottomColor: colors.border[theme].default }]}>
            {dataColumns.map((column) => {
              const cellValue = row[column.id]
              // A column's `render` may return a bare string or number — the
              // grid path's TableCell wraps those in <Text>, but here they
              // went straight into a <View>, which react-native-web tolerates
              // and native throws on ("Text strings must be rendered within a
              // <Text> component"). It surfaced the moment native stacked
              // (#768). Same wrapping as the no-render case.
              const content = stackedCellContent(
                column.render ? column.render(cellValue, row, rowIndex) : cellValue,
                colors.text[theme].primary
              )

              return (
                <View key={column.id} style={styles.stackedLine}>
                  <Text
                    style={[
                      styles.stackedLabel,
                      { color: colors.text[theme].tertiary, fontSize: 13 },
                    ]}
                  >
                    {column.title}
                  </Text>
                  <View style={styles.stackedValue}>{content}</View>
                </View>
              )
            })}
          </View>
        )

        return (
          <View key={rowId}>
            {isPressable ? (
              <Pressable
                onPress={() => onRowPress?.(row, rowIndex)}
                accessibilityRole="button"
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                {card}
              </Pressable>
            ) : (
              card
            )}
            {expandableRows && isExpanded && renderExpandedRow ? (
              <ExpandedTableRow>{renderExpandedRow(row, rowIndex)}</ExpandedTableRow>
            ) : null}
          </View>
        )
      }

      const rowContent = (
        <View style={{ flexDirection: 'row' }}>
          {table.visibleColumns.map((column) => {
            const cellValue = row[column.id]
            const cellType = column.cellType || 'text-default'

            if (column.render) {
              return (
                <TableCell
                  key={column.id}
                  type={cellType}
                  width={column.width}
                  align={column.align}
                  style={columnSizing(column.width)}
                  {...({ children: column.render(cellValue, row, rowIndex) } as any)}
                />
              )
            }

            if (selectableRows && column.showCheckbox) {
              return (
                <TableCell
                  key={column.id}
                  type="checkbox-only"
                  width={column.width}
                  checked={isSelected}
                  onSelectionChange={(checked: boolean) => table.handleRowSelect(rowId, checked)}
                  style={columnSizing(column.width)}
                />
              )
            }

            if (expandableRows && (!column.title || column.title === '') && column.width === 40) {
              return (
                <TableCell
                  key={column.id}
                  type={isExpanded ? 'icon-close' : 'icon-open'}
                  width={column.width}
                  onIconPress={() => table.handleRowExpand(rowId, !isExpanded)}
                  style={columnSizing(column.width)}
                />
              )
            }

            if (column.headerEmpty) {
              return (
                <TableCell
                  key={column.id}
                  type="empty"
                  width={column.width}
                  style={columnSizing(column.width)}
                />
              )
            }

            return (
              <TableCell
                key={column.id}
                type={cellType}
                width={column.width}
                align={column.align}
                style={columnSizing(column.width)}
                {...({
                  text: cellValue !== null && cellValue !== undefined ? String(cellValue) : '',
                } as any)}
              />
            )
          })}
        </View>
      )

      return (
        <View key={rowId}>
          {isPressable ? (
            <Pressable
              onPress={() => onRowPress?.(row, rowIndex)}
              style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
                Platform.OS === 'web' && { cursor: 'pointer' as const },
              ]}
            >
              {rowContent}
            </Pressable>
          ) : (
            rowContent
          )}

          {isExpanded && (
            <View>
              {renderExpandedRow ? (
                renderExpandedRow(row, rowIndex)
              ) : (
                <ExpandedTableRow
                  variant={row.expandedVariant || 'variant2'}
                  title={
                    typeof row.expandedData === 'object' &&
                    row.expandedData !== null &&
                    'title' in row.expandedData
                      ? String(row.expandedData.title)
                      : undefined
                  }
                  infoItems={
                    typeof row.expandedData === 'object' &&
                    row.expandedData !== null &&
                    'items' in row.expandedData
                      ? (row.expandedData.items as Array<{ label: string; value: string }>)
                      : undefined
                  }
                />
              )}
            </View>
          )}
        </View>
      )
    },
    [
      getRowIdProp,
      table,
      onRowPress,
      rowPressable,
      selectableRows,
      expandableRows,
      renderExpandedRow,
    ]
  )

  const renderHeader = useCallback(
    () => (
      <View style={{ flexDirection: 'row', backgroundColor: colors.bg[theme].default }}>
        {table.visibleColumns.map((column) => {
          const selectColumn = table.visibleColumns.find((col) => col.showCheckbox)
          const showSelectAllCheckbox =
            selectableRows && column.showCheckbox && column.id === selectColumn?.id

          return (
            <TableColumnHeader
              key={column.id}
              title={column.title}
              sortable={column.sortable}
              sortDirection={
                table.sortConfig.columnId === column.id ? table.sortConfig.direction : null
              }
              onSort={(direction) => table.handleSort(column.id, direction || null)}
              showCheckbox={showSelectAllCheckbox}
              checked={table.selectionConfig.allSelected}
              onCheckboxChange={table.handleSelectAll}
              showRightIcon={column.sortable}
              state={column.headerEmpty ? 'empty' : 'default'}
              width={column.width}
              align={column.align}
              style={columnSizing(column.width)}
            />
          )
        })}
      </View>
    ),
    [table, selectableRows, theme]
  )

  if (loading && renderLoading) {
    return <View style={[styles.container, style]}>{renderLoading()}</View>
  }

  if (table.displayData.length === 0) {
    return (
      <View style={[styles.container, style]}>
        {showHeader && (
          <View style={[styles.header, headerStyle]}>
            <View style={styles.headerContent}>
              {searchable && (
                <Input
                  placeholder={searchPlaceholder}
                  value={table.searchValue}
                  onChangeText={table.handleSearchChange}
                  style={{ flex: 1, maxWidth: 263 }}
                />
              )}
              {actions.length > 0 && (
                <View style={styles.headerActions}>
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      color={action.color}
                      size={action.size}
                      iconStart={action.icon}
                      onPress={action.onPress}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </Button>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
        <View
          style={[
            styles.body,
            bodyStyle,
            { padding: spacing[32], alignItems: 'center', justifyContent: 'center' },
          ]}
        >
          {renderEmpty ? (
            renderEmpty()
          ) : (
            <Text style={{ color: colors.text[theme].secondary, fontSize: 14 }}>
              {emptyMessage}
            </Text>
          )}
        </View>
      </View>
    )
  }

  return (
    // Neither container is `flex: 1` any more. Inside a content-sized parent
    // (a Card in a page ScrollView) Yoga resolved flex: 1 to a height of zero
    // and `overflow: hidden` clipped every row on an iPad (#768); Chrome
    // resolved the same chain to 116px and clipped the web grid to a row and
    // a half (#799). Both size to their content now; a consumer that gives
    // the table a bounded panel passes `style={{ flex: 1 }}` itself.
    <View style={[stacked ? styles.stackedContainer : styles.container, style]}>
      {/* The toolbar only exists when it has something in it. With neither a
          search box nor actions it was still a 64px padded block — the "empty
          header" above every Office table on an iPad (#768). */}
      {showHeader && (searchable || actions.length > 0) && (
        <View style={[styles.header, headerStyle]}>
          <View style={styles.headerContent}>
            {searchable && (
              <Input
                placeholder={searchPlaceholder}
                value={table.searchValue}
                onChangeText={table.handleSearchChange}
                style={{ flex: 1, maxWidth: 263 }}
              />
            )}
            {actions.length > 0 && (
              <View style={styles.headerActions}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    color={action.color}
                    size={action.size}
                    iconStart={action.icon}
                    onPress={action.onPress}
                    disabled={action.disabled}
                  >
                    {action.label}
                  </Button>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

      {/* Stacked rows are full-width cards, so the horizontal scroller and the
          fixed `totalColumnWidth` would reintroduce exactly the overflow the
          stacking removes. The column header goes too: it labels columns that
          no longer exist as columns, and each card carries its own labels. */}
      {stacked ? (
        // NOT styles.body — that is `flex: 1`, which is right for a scroller
        // filling a sized parent and wrong for a list of cards. With it the
        // stacked list stretched to the panel height, left a screen of blank
        // above the first row, and clipped the last one at the panel edge.
        // Cards size to their content and let the page scroll.
        // A plain map, not a FlatList. The list does not scroll (the page
        // does), so virtualisation buys nothing — and a VirtualizedList nested
        // in the page's ScrollView with `removeClippedSubviews` measures a
        // zero-height window on native and paints no rows at all, which is
        // what an iPad showed once #768 made native stack: the header card,
        // the search box, and nothing underneath.
        <View style={bodyStyle}>
          {table.displayData.map((item, index) => (
            <Fragment key={getRowIdProp?.(item, index) ?? item.id ?? String(index)}>
              {renderRow({ item, index })}
            </Fragment>
          ))}
        </View>
      ) : (
        // Header plus rows, in a horizontal scroller for when the columns are
        // wider than the body. The rows are laid out at the body's width, so
        // undeclared columns share the slack instead of leaving the right
        // third of the card empty; below the columns' total the scroller
        // takes over.
        //
        // A plain map here as well. The vertical FlatList this used to be
        // needs a bounded height to scroll, and inside a content-sized Card
        // it never had one: Chrome resolved the `flex: 1` chain above it to
        // 116px and clipped the storage table to a header and a row and a
        // half (#799). Pagination bounds the row count; the page scrolls.
        <ScrollView
          style={[styles.body, bodyStyle]}
          horizontal
          showsHorizontalScrollIndicator={false}
          onLayout={onBodyLayout}
        >
          <View
            style={{
              width: Math.max(totalColumnWidth, bodyWidth) || undefined,
              minWidth: totalColumnWidth,
            }}
          >
            {renderHeader()}
            {table.displayData.map((item, index) => (
              <Fragment key={getRowIdProp?.(item, index) ?? item.id ?? String(index)}>
                {renderRow({ item, index })}
              </Fragment>
            ))}
          </View>
        </ScrollView>
      )}

      {(pagination || (pageSize && table.totalPages > 1)) && (
        <View style={[styles.footer, footerStyle]}>
          <Pagination
            {...pagination}
            totalPages={pageSize ? table.totalPages : (pagination?.totalPages ?? 1)}
            currentPage={table.currentPage}
            onPageChange={table.handlePageChange}
          />
        </View>
      )}
    </View>
  )
}
