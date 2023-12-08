import React, { useState } from 'react';
import { LoginForm } from './Login';
import { RegisterForm } from './Register';

export function Home() {
    const [showLoginForm, setShowLoginForm] = useState(true);

    const toggleForms = () => {
        setShowLoginForm(!showLoginForm);
        $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
    }

    return (
        <>
            <div className="box flex-box">
                <div className="form">
                    <LoginForm />
                    <RegisterForm />

                    <p className="message">
                        {showLoginForm ? 'Not Registered? ' : 'Already registered? '}
                        <a href="#" onClick={toggleForms}>{showLoginForm ? 'Create an Account' : 'Sign In'}</a>
                    </p>
                </div>
            </div>

        </>
    );
}