import axios from 'axios';
const editEvent = async (data, id) => {
  const formData = new FormData();

  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  Object.keys(data).forEach(key => {
    if (key !== 'avatar') {
      if (data[key]) formData.append(key, data[key]);
    }
  });

  console.log('DATA: ', data);
  console.log('FormData: ', formData);

  const response = await axios.patch(
    import.meta.env.VITE_BACK_URL + '/api/users/' + id,
    formData,
    {
      withCredentials: true,
    },
  );

  return response.data;
};

export default editEvent;
