import React from 'react';
import AboutUsCard from '../components/AboutUsCard';

const About = () => {
  return (
    <div className="h-full">
      <h1 className="font-bold text-2xl tablet:p-11 mb-5 text-left text-black">
        Team Members
      </h1>

      <div className="flex flex-wrap justify-evenly gap-4 space-x-6">
        <AboutUsCard
          photo="https://randomuser.me/api/portraits/men/1.jpg"
          name="John Anderson"
          linkedin="linkedin.com/john-anderson"
          github="github.com/johndoe"
          phone="123-456-7890"
          mail="john.doe@example.com"
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
