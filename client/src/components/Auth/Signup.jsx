import React from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  return (
    <div className="signup">
      <form className="signup-form">
        <h1>Signup to ChatCord</h1>

        <div className="signup-formConrol">
          <input type="text" placeholder="Enter your username" />
        </div>

        {/* <div className="signup-error">
          <p>**This displays some error messages**</p>
        </div> */}

        <button className="signup-submitBtn" type="submit">
          Sign up
        </button>

        <p className="signup-info">
          Already have an account? <Link to="/">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
