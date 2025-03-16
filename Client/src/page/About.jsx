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
          name="John Anderson"
          linkedin="linkedin.com/in/povilasgeguzis/"
          github="https://github.com/knoeks"
          phone="+37066800310"
          mail="povilas.geguzis@gmail.com"
        />

        <AboutUsCard
          photo="https://randomuser.me/api/portraits/women/2.jpg"
          name="Sarah Williams"
          linkedin="linkedin.com/sarah-williams"
          github="github.com/sarahwilliams"
          phone="098-765-4321"
          mail="sarah.williams@example.com"
        />

        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="555-123-4567"
          mail="michael.chen@example.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="555-123-4567"
          mail="michael.chen@example.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="555-123-4567"
          mail="michael.chen@example.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="555-123-4567"
          mail="michael.chen@example.com"
        />
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/3.jpg"
          name="Michael Chen"
          linkedin="linkedin.com/michael-chen"
          github="github.com/michaelchen"
          phone="555-123-4567"
          mail="michael.chen@example.com"
        />
      </div>
    </div>
  );
};

export default About;
