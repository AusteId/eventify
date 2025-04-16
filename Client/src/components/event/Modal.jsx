

const Modal = ({ modalName, children, isDarkMode }) => {
  return (
    <div>
      <dialog id={modalName} className={`modal`}>
        <div className={`modal-box max-w-full w-auto border ${isDarkMode ? "border-[#f59e0b] bg-slate-900" : "border-transparent"}`}>
          <form method="dialog">
            <button className={`cursor-pointer font-bold text-2xl absolute right-4 top-2 rounded-full w-9 duration-750 ${isDarkMode ? "text-[#f59e0b] text-shadow-md hover:text-shadow-yellow-100" : ""}`}>
              ✕
            </button>
          </form>
          {children}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Modal;
