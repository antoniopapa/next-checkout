import React from 'react';
import Head from "next/head";

const Wrapper = (props) => {
    return (
        <div>
            <Head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
                      integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
                      crossOrigin="anonymous"/>
                <script src="https://js.stripe.com/v3/"></script>
            </Head>
            <div className="container">
                {props.children}
            </div>
        </div>
    );
};

export default Wrapper;
