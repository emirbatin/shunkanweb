
import React from 'react';
import './IntroduceYourself.css';

const Section1 = ({ goToNextSection }) => (
  <div className="sectionIntroduceYourself">
    <h1>What is your name</h1>
    <button onClick={goToNextSection}>Next Section</button>
  </div>
);

export default Section1;
