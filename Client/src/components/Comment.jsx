const Comment = (props) => {
  return (
    <div className="flex w-full">
        <img className="w-[40px] h-[40px] rounded-full" src={props.avatar} alt="Comment Avatar" />
        <div className="pl-[16px]">
            <div className="flex items-center">
                <h1 className="text-header-dark font-inter font-bold">{props.name}</h1>
                <p className="font-inter text-body-medium text-body-s pl-[8px]">{props.time}</p>
            </div>
            <p className="text-body-medium font-inter pt-[6px]">
                {props.comment}
            </p>
        </div>
    </div>
  )
}

export default Comment