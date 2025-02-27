import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import NavBar from "../Components/NavBar";

function CandidateInfo() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(true); // To toggle between Login and Register forms

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            // Optionally, verify the token with an API request here to fetch user data
            fetch("http://localhost:5000/student/me", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setHasVoted(data.votes.some((vote) => vote.candidateId === id));
                })
                .catch((err) => console.error("Error fetching student data:", err));
        }
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:5000/candidates/${id}`)
            .then((res) => res.json())
            .then((data) => setCandidate(data))
            .catch((err) => console.error("Error fetching candidate:", err));
    }, [id]);

    const handleVote = async (id, type) => {
        if (!isLoggedIn) {
            setShowAuthModal(true); // Show authentication modal if not logged in
            return;
        }

        if (hasVoted) {
            alert("You have already voted.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/candidates/${id}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });

            if (response.ok) {
                const updatedCandidate = await response.json();
                setCandidate((prev) =>
                    prev._id === updatedCandidate._id
                        ? { ...prev, upvotes: updatedCandidate.upvotes, downvotes: updatedCandidate.downvotes }
                        : prev
                );
                setHasVoted(true); // Update voting status
            }
        } catch (error) {
            console.error("Error updating votes:", error);
        }
    };

    const getYouTubeID = (url) => {
        const match = url?.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([^#&?]*))/);
        return match ? match[1] : null;
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        const url = isLoginForm
            ? "http://localhost:5000/students/login"
            : "http://localhost:5000/students/register"; // Toggle between login and register
        const method = isLoginForm ? "POST" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationNumber, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Save JWT in localStorage
                setIsLoggedIn(true);
                setShowAuthModal(false); // Close modal after successful login/registration
                alert(isLoginForm ? "Login successful!" : "Registration successful!");
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    if (!candidate) return <div className="text-center mt-20">Loading...</div>;

    return (
        <>
            <NavBar />
            <div className="mt-20 mx-auto max-w-2xl p-6 bg-white shadow-lg rounded-lg">
                <img src={`http://localhost:5000${candidate.picture}`} alt={candidate.name} className="w-full h-60 object-cover rounded-lg mb-4" />
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-gray-600 m-4">{candidate.email}</p>
                <p>{candidate.manifesto}</p>

                {candidate.videoUrl && (
                    <div className="mt-4">
                        <iframe
                            width="100%"
                            height="250"
                            src={`https://www.youtube.com/embed/${getYouTubeID(candidate.videoUrl)}`}
                            title="Candidate Manifesto"
                            frameBorder="0"
                            allowFullScreen
                            className="rounded-lg"
                        />
                    </div>
                )}

                <div className="flex items-center mt-4 space-x-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleVote(candidate._id, "upvote"); }}
                        className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={hasVoted}
                    >
                        ⬆ {candidate.upvotes}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleVote(candidate._id, "downvote"); }}
                        className={`px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 ${hasVoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={hasVoted}
                    >
                        ⬇ {candidate.downvotes}
                    </button>
                </div>
            </div>

            {/* Authentication Modal */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">{isLoginForm ? "Login" : "Register"}</h2>
                        <form onSubmit={handleAuthSubmit}>
                            <div className="mb-4">
                                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-600">Registration Number</label>
                                <input
                                    id="registrationNumber"
                                    type="text"
                                    value={registrationNumber}
                                    onChange={(e) => setRegistrationNumber(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md mt-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md mt-1"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                {isLoginForm ? "Login" : "Register"}
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <button
                                onClick={() => setIsLoginForm(!isLoginForm)}
                                className="text-blue-500 text-sm hover:underline"
                            >
                                {isLoginForm ? "Don't have an account? Register here" : "Already have an account? Login here"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CandidateInfo;
