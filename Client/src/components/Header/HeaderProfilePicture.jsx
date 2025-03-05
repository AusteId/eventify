import avatar from "../../assets/profile-picture.webp"
const ProfilePictureButton = () => {
    return (
      <section>
        <img
          src={avatar}
          alt="profile-photo"
          className="border-movie-fifth rounded-[1.5rem]   "
        />
      </section>
    );
  };
  
  export default ProfilePictureButton;