import React from 'react';
import AboutUsCard from '../components/AboutUsCard';

const About = () => {
  return (
    <div className="p-5 h-full">
      <h1 className="font-bold text-2xl tablet:p-11 mb-5 text-left text-black">
        Team Members
      </h1>

      <div className="flex flex-wrap justify-evenly gap-4 space-x-6">
        <AboutUsCard
          photo="https://media.licdn.com/dms/image/v2/D4D03AQEnwQEDXrdChA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1725302725417?e=1747872000&v=beta&t=AsvFyrh7KTHHc-6rbu8tn313MEDqj5VA_cNTzpoDjTo"
          name="Povilas Gegužis"
          linkedin="linkedin.com/in/povilasgeguzis/"
          github="github.com/knoeks"
          phone="-"
          mail="povilas.geguzis@gmail.com"
        />

        <AboutUsCard
          photo="https://randomuser.me/api/portraits/women/2.jpg"
          name="Dariuš Jurchevič"
          linkedin="linkedin.com/sarah-williams"
          github="github.com/DariusJuch"
          phone="-"
          mail="juchevicd@gmail.com"
        />

        <AboutUsCard
          photo="https://media.licdn.com/dms/image/v2/D5635AQFPjzH5YJPBfw/profile-framedphoto-shrink_200_200/B56ZWQD1cPHoAg-/0/1741878679632?e=1742814000&v=beta&t=4tRZ6rsl0gpv1bALEddQtYfWH6_G1bV3akJsJ-r2CRM"
          name="Deividas Morkūnas"
          linkedin="linkedin.com/in/deividas-mork%C5%ABnas/"
          github="github.com/TeaAddict"
          phone="-"
          mail="deividasmor7@gmail.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Austė Idaitė"
          linkedin="linkedin.com/in/austeidaite"
          github="github.com/AusteId"
          phone="-"
          mail="auste.idaite@gmail.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Lukas Stankevičius"
          linkedin="linkedin.com/in/lukas-stankevi%C4%8Dius/"
          github="github.com/lukas622"
          phone="-"
          mail="stankeviciuslukas9@gmail.com"
        />
        {/* <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="-"
          mail="michael.chen@example.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="-"
          mail="michael.chen@example.com"
        /> */}
      </div>
    </div>
  );
};

export default About;
