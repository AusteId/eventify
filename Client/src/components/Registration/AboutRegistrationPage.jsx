import Button from '../Button';

const AboutRegistrationPage = () => {
  return (
    <section className=" bg-gradient-to-b from-[#FEF3C7] via-[#FFFBEB] to-[#FFF] h-[90rem] flex justify-center items-start pt-[8.06rem]">
      <section className=" w-[26rem]  pt-[2rem] px-[2rem] pb-[3rem] bg-white flex justify-center rounded-[1rem]  shadow-lg">
        <section className="flex flex-col gap-[1.5rem]">
          <h2 className="text-header-dark text-heading-l font-[700]">
            Tell us about yourself
          </h2>
          <fieldset className="fieldset text-[1rem] ">
            <section className=" flex gap-2">
              <legend className="fieldset-legend font-[400]">Birth date</legend>
            </section>
            <input type="date" className="input" />
          </fieldset>
          <fieldset className="fieldset text-[1rem] ">
            <legend className="fieldset-legend font-[400]">Bio</legend>
            <textarea
              className="textarea h-24"
              placeholder="Tell us about yourself..."
            ></textarea>
          </fieldset>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn">
              City
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
          <section className=" flex justify-between w-[100%]">
            <section className=" not-hover:">
              <Button 
                background='bg-white'
                textColor='text-btn'
                border='border border-btn'
              >Back</Button>
            </section>
            <section>
                <Button
                background='bg-white'
                textColor='text-btn'
                hoverColor='not-hover:hover'
                >
                Skip
                </Button>
            </section>
            <section className="">
              <Button>Next</Button>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};
export default AboutRegistrationPage;
