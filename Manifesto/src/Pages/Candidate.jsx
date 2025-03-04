import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import { useNavigate } from "react-router-dom";

function Candidate() {
    const [candidates, setCandidates] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);
    const [studentInfo, setStudentInfo] = useState(null); 
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginForm, setIsLoginForm] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            fetch("http://localhost:5000/student/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setStudentInfo(data);
                    const votedCandidates = data.votes.map(vote => vote.candidateId);
                    setHasVoted(votedCandidates.length > 0);
                })
                .catch(err => console.error("Error fetching student data:", err));
        }
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/candidates")
            .then((res) => res.json())
            .then((data) => setCandidates(data))
            .catch((err) => console.error("Error fetching candidates:", err));
    }, []);

    const handleVote = async (id, type) => {
        if (!isLoggedIn) {
            setShowAuthModal(true); 
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
                setCandidates((prev) =>
                    prev
                        .map((c) => (c._id === id ? { ...c, upvotes: updatedCandidate.upvotes, downvotes: updatedCandidate.downvotes } : c))
                        .sort((a, b) => b.upvotes - a.upvotes)
                );
                setHasVoted(true); 
            }
        } catch (error) {
            console.error("Error updating votes:", error);
        }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();

        const url = isLoginForm
            ? "http://localhost:5000/students/login"
            : "http://localhost:5000/students/register"; 
        const method = isLoginForm ? "POST" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrationNumber, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); 
                setIsLoggedIn(true);
                setShowAuthModal(false);
                alert(isLoginForm ? "Login successful!" : "Registration successful!");
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
                {candidates.map((candidate) => (
                    <div key={candidate._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                        <div onClick={() => navigate(`/candidate/${candidate._id}`)} className="cursor-pointer">
                            <img 
                                alt={candidate.name} 
                                src={`http://localhost:5000${candidate.picture}`} 
                                className="w-full h-40 object-cover rounded-lg mb-4" 
                            />
                            <h2 className="text-xl font-semibold">{candidate.name}</h2>
                            <p className="text-gray-500">{candidate.email}</p>
                        </div>

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
                ))}
            </div>
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

export default Candidate;
