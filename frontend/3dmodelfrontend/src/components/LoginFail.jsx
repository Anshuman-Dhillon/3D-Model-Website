import React from 'react';

function LoginFail({ type }) {
    return (
        <div className="alert alert-danger w-100 text-center" role="alert" style={{ borderRadius: 0 }}>
            {type} Failed. Invalid Credentials.
        </div>
    );
}

export default LoginFail;
