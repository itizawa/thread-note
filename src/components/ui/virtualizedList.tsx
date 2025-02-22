"use client";

import { AutoSizer, InfiniteLoader, List } from "react-virtualized";

type VirtualizedListProps<T> = {
  data: T[];
  rowRenderer: (item: T) => React.ReactNode;
  loadingRenderer: () => React.ReactNode;
  noRowsRenderer: () => React.JSX.Element;
  loadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
  rowHeight?: number;
};

export function VirtualizedList<T>({
  data,
  rowRenderer,
  loadingRenderer,
  loadMore,
  hasNextPage,
  isLoading,
  isFetching,
  rowHeight = 50,
  noRowsRenderer,
}: VirtualizedListProps<T>) {
  const loadMoreRows = async () => {
    if (isFetching) return;
    if (!hasNextPage) return;

    loadMore();
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <InfiniteLoader
          isRowLoaded={({ index }) => !!data[index]}
          loadMoreRows={loadMoreRows}
          rowCount={hasNextPage ? data.length + 1 : data.length} // + 1 すると次のページを読み込める (https://github.com/bvaughn/react-virtualized/issues/661)
          threshold={10}
        >
          {({ onRowsRendered, registerChild }) => (
            <List
              ref={registerChild}
              width={width}
              height={height}
              rowCount={isFetching ? data.length + 20 : data.length}
              rowHeight={rowHeight}
              rowRenderer={({ index, key, style }) => {
                const item = data[index];
                return (
                  <div key={key} style={style}>
                    {item ? rowRenderer(item) : loadingRenderer()}
                  </div>
                );
              }}
              onRowsRendered={onRowsRendered}
              noRowsRenderer={isLoading ? undefined : noRowsRenderer}
            />
          )}
        </InfiniteLoader>
      )}
    </AutoSizer>
  );
}
