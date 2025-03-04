import RegistrationHrader from "../Header/RegistrationHeader"

const AboutRegistrationPage = () => {
    return(
        <section className=" bg-gradient-to-b from-[#FEF3C7] via-[#FFFBEB] to-[#FFF] h-[90rem] flex justify-center items-start pt-[8.06rem]">
            <section className=" w-[26rem] h-[30rem] pt-[2rem] px-[2rem] pb-[3rem] bg-white flex justify-center rounded-[1rem]  shadow-lg">
                <section className="flex flex-col gap-[1.5rem]">
                    <h2 className="text-header-dark text-heading-l font-[700]">Tell us about yourself</h2>
                    <fieldset className="fieldset text-[1rem] ">
                        <legend className="fieldset-legend font-[400]">Age</legend>
                        <input type="text" className="input" placeholder="Enter you age" />
                    </fieldset>
                    <fieldset className="fieldset text-[1rem] ">
                    <legend className="fieldset-legend font-[400]">Bio</legend>
                    <textarea className="textarea h-24" placeholder="Tell us about yourself..."></textarea>
                    </fieldset>
                </section>
            </section>
        </section>
    )
}
export default AboutRegistrationPage;