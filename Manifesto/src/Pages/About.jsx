import React from "react";
import NavBar from "../Components/NavBar";

function About() {
    return (
        <>
            <NavBar />
            <div className="container mx-auto px-4 py-10 m-6">
                <h1 className="text-5xl md:text-7xl font-bold text-blue-900 drop-shadow-l mb-6">About</h1>
                <p className="text-lg text-gray-700 mb-6">
                    Welcome to our Election Manifesto Platform, a modern web application designed to empower students in their decision-making process during student elections. This platform allows candidates running for various positions to upload their manifestos, share their plans, and engage with the student body.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                    Candidates can create profiles, submit detailed manifestos, and even share videos to communicate their vision directly to the voters. The platform gives students a chance to evaluate each candidate’s proposals based on the issues that matter most to them. Students can browse through different candidates, view their manifestos, and cast votes based on their preferences.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                    With a transparent voting system and real-time results, this platform helps students make informed choices while ensuring fairness and accessibility in the election process. Whether you're a candidate looking to make your mark or a student deciding on the best candidate, our platform provides the tools to foster a better and more democratic election environment.
                </p>

                <h2 className="text-2xl font-semibold text-blue-700 mb-4">Features:</h2>
                <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                    <li>Detailed candidate profiles, including manifestos and videos</li>
                    <li>Voting system allowing students to cast their votes based on manifestos</li>
                    <li>Real-time vote tallying and results display</li>
                    <li>Secure and transparent voting process</li>
                </ul>

                <p className="text-lg text-gray-700 mt-6">
                    Make your voice heard and play an active role in shaping your student leadership with our Election Manifesto Platform!
                </p>
            </div>
        </>
    );
}

export default About;
