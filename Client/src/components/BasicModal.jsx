import { useNotifications } from "./context/NotificationContext";

const BasicModal = props => {
  const {isDarkMode} = useNotifications();
  return (
    <dialog id={props.id} className="modal">
      <div className={`modal-box ${isDarkMode ? "bg-slate-900" : "bg-white"} rounded-xl max-w-224`}>
        {props.children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BasicModal;
