import React from 'react';
import Comment from './Comment';
import axios from 'axios';

const CommentSection = () => {
  const comments = [
    {
      id: 1,
      name: 'Mike Johnson',
      avatar: 'src/assets/avatar.png',
      comment:
        'Great event organizer! Really enjoyed the board game night last week.',
      time: '2 days ago',
    },
    {
      id: 2,
      name: 'John Johnson',
      avatar: 'src/assets/avatar.png',
      comment: 'One of the greatest hosts of all time!',
      time: '6 days ago',
    },
  ];

  const onPostComment = async () => {
    console.log(document.getElementById('textarea').value);

    const { data } = await axios.post(
      'https://httpbin.org/post',
      {
        firstName: 'Fred',
        lastName: 'Flintstone',
        orders: [1, 2, 3],
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  };

  return (
    <div>
      <h1 className="text-header-dark font-inter font-bold text-heading-s pb-[23px]">
        Comments
      </h1>
      <div className="flex">
        <img
          className="w-[40px] h-[40px] rounded-full"
          src="src/assets/avatar.png"
          alt=""
        />
        <div className="pl-[16px] w-full">
          <textarea
            id="textarea"
            class="field-sizing-fixed resize-none font-inter text-body-medium text-body-m w-full bg-transparent placeholder:text-slate-400 text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none ..."
            rows="4"
            placeholder="Write a comment..."
          ></textarea>
          <button
            onClick={onPostComment}
            className="btn bg-btn border-0 shadow-none hover:bg-btn-hover px-[16px] pt-[10px] pb-[10px] rounded-[8px]"
          >
            Post Comment
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[24px] pt-[32px]">
        {comments.map(comment => (
          <Comment
            name={comment.name}
            avatar={comment.avatar}
            comment={comment.comment}
            time={comment.time}
            key={comment.id}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
