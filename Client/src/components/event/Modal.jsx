
const Modal = ({ modalName, children }) => {
  return (
    <div>
      <dialog id={modalName} className="modal">
        <div className="modal-box max-w-full w-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
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
