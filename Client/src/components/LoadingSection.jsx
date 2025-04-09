const LoadingSection = () => {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-360px)] items-center justify-center gap-6">
      <span className="loading loading-spinner loading-xl text-warning scale-150"></span>
    </div>
  );
};

export default LoadingSection;
