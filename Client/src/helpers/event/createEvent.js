// import axios from 'axios';

// const createEvent = async data => {
//   const response = await axios.post(
//     import.meta.env.VITE_BACK_URL + '/api/events',
//     data,
//     {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     },
//   );

//   return response.data;
// };

// export default createEvent;

import axios from 'axios';

const createEvent = async data => {
  const formData = new FormData();

  if (data.image) {
    formData.append('image', data.image);
  }

  Object.keys(data).forEach(key => {
    if (key !== 'image') {
      if (data[key]) formData.append(key, data[key]);
    }
  });

  console.log('DATA: ', data);
  console.log('FormData: ', formData);

  const response = await axios.post(
    import.meta.env.VITE_BACK_URL + '/api/events',
    formData,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export default createEvent;
