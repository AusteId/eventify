import avatar from "./../../../public/profile-picture.webp"
const ProfilePictureButton = () => {
    return (
      <section>
        <img
          src={avatar}
          alt="profile-photo"
          className="border-movie-fifth rounded-[1.5rem] w-[2rem] h-[2rem] "
        />
      </section>
    );
  };
  
  export default ProfilePictureButton;