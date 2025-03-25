import { useState } from 'react';
import avatar from '../assets/avatar.png';
import axios from 'axios';

const Comment = props => {
  const [imgSrc, setImgSrc] = useState(props.avatar || avatar);

  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const deleteC = () => {
    props.setComments([]);
    props.setLoading(true);
    const del = async () => {
      try {
        const response = await api.delete('/events/comments/' + props.id);
      } catch (err) {
        console.error('Error deleting comment:', err);
      } finally {
        props.fetchComments();
      }
    };
    del();
  };

  return (
    <div className="flex w-full gap-[16px]">
      <img
        className="w-10 h-10 rounded-full"
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
          <p className="font-inter text-body-medium text-body-s pl-2">
            {props.time}
          </p>
          <button type="button" onClick={deleteC} className="text-red-400 ml-2">
            X
          </button>
        </div>
        <p className="text-body-medium font-inter pt-2 break-all">
          {props.comment}
        </p>
      </div>
    </div>
  );
};

export default Comment;
