interface LoadMoreButtonProps {
  onClick: () => void;
  loading: boolean;
  hasMore: boolean;
}

const LoadMoreButton = ({ onClick, loading, hasMore }: LoadMoreButtonProps) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center py-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="px-6 py-3 bg-[#E3C9BF] hover:bg-[#D6BDB2] dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Loading...
          </>
        ) : (
          'Load More'
        )}
      </button>
    </div>
  );
};

export default LoadMoreButton;
