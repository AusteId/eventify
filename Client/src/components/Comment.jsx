import { useState } from 'react';
import avatar from '../assets/avatar.png';

const Comment = props => {
  const [imgSrc, setImgSrc] = useState(props.avatar || avatar);

  return (
    <div className="flex w-full gap-[16px]">
      <img
        className="w-[40px] h-[40px] rounded-full"
        src={imgSrc}
        alt="Comment Avatar"
        onError={() => setImgSrc(avatar)}
      />
      {/* <div className="pl-[16px] bg-light-gray"> */}
      <div className="bg-light-gray p-3 rounded-[0.5rem]">
        <div className="flex items-center">
          <h1 className="text-header-dark font-inter font-bold">
            {props.name}
          </h1>
          <p className="font-inter text-body-medium text-body-s pl-[8px]">
            {props.time}
          </p>
        </div>
        <p className="text-body-medium font-inter pt-[6px]">{props.comment}</p>
      </div>
    </div>
  );
};

export default Comment;
