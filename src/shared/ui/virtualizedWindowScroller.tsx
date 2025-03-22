"use client";

import {
  AutoSizer,
  InfiniteLoader,
  List,
  WindowScroller,
} from "react-virtualized";

const DEFAULT_HEIGHT = 500;

type VirtualizedWindowScrollerProps<T> = {
  data: T[];
  rowRenderer: (item: T) => React.ReactNode;
  loadingRenderer: () => React.ReactNode;
  noRowsRenderer: () => React.JSX.Element;
  loadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetching: boolean;
  rowHeight: number;
};

export function VirtualizedWindowScroller<T>({
  data,
  rowRenderer,
  loadingRenderer,
  loadMore,
  hasNextPage,
  isLoading,
  isFetching,
  rowHeight,
  noRowsRenderer,
}: VirtualizedWindowScrollerProps<T>) {
  const loadMoreRows = async () => {
    if (isLoading || isFetching) return;
    if (!hasNextPage) return;

    loadMore();
  };

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!data[index];
  };

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={hasNextPage ? data.length + 1 : data.length}
              threshold={10}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  ref={registerChild}
                  autoHeight
                  height={height || DEFAULT_HEIGHT}
                  width={width}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  rowCount={
                    isLoading || isFetching ? data.length + 1 : data.length
                  }
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
      )}
    </WindowScroller>
  );
}
