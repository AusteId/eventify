const BasicModal = props => {
  return (
    <dialog id={props.id} className="modal">
      <div className="modal-box bg-[#FFFFFF] rounded-xl max-w-224">
        {props.children}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BasicModal;
