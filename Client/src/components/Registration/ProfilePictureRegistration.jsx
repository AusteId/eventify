import Button from '../Button'
const ProfilePictureRegistration = () => {

    return(
        <>
        <section className=" flex flex-col items-center pt-[8rem]">
            <h1 className="text-header-dark text-heading-l font-[700]">Complete Your Profile</h1>
            <p className="text-light text-body-m font-[400]">Add a profile picture to help others recognize you</p>
            
            <section className=" flex justify-between w-[20%] items-center">
            <section className="">
              <Button 
                background='bg-white'
                textColor='text-btn'
                border='border border-btn'
              >Back</Button>
            </section>
            <section >
              <Button>Complete Setup</Button>
            </section>
          </section>
        </section>
       
        </>
  
    )
}
export default ProfilePictureRegistration