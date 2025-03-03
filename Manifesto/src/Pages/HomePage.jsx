import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar";

function HomePage() {
    const [isOpen, setIsOpen] = useState(false);
    const [showAd, setShowAd] = useState(true);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        manifesto: "",
        picture: null,
        youtubeLink: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, picture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.fullName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("videoUrl", formData.youtubeLink);
        formDataToSend.append("manifesto", formData.manifesto);
        formDataToSend.append("picture", formData.picture);

        try {
            const response = await fetch("http://localhost:5000/candidates", {
                method: "POST",
                body: formDataToSend,
            });
            if (!response.ok) throw new Error("Failed to post data");

            const responseData = await response.json();
            console.log("Success:", responseData);
        } catch (error) {
            console.log("Data not posted", error);
        }
        setIsOpen(false);
    };

    return (
        <>
            <NavBar />
            {/* Advertisement Banner */}
            {showAd && (
                <div className="w-full bg-yellow-300 text-black py-3 px-6 mt-16 flex justify-between items-center shadow-md relative z-10">
                    <p className="text-lg font-semibold">📢 Bags!!</p>
                    <img 
                        src="https://denriafricastores.com/cdn/shop/files/DSC_0260.jpg?v=1698930763&width=360"
                        alt="bag"
                        className="w-20 h-20 object-cover rounded-md shadow-md"
                    />
                    <button
                        onClick={() => setShowAd(false)}
                        className="text-black text-xl font-bold hover:text-gray-700"
                    >
                        ✖
                    </button>
                </div>
            )}

            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center text-center px-6">
                <div className="absolute inset-0 bg-[url(./assets/openart-image_L8UKYjta_1740677124269_raw.svg)] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 w-11/12 md:w-3/5 lg:w-2/5">
                    <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
                        <span className="text-blue-400">Welcome</span> to Manifestos
                    </h1>
                    <p className="text-lg md:text-2xl mt-4 text-gray-200 drop-shadow-md">
                        Reach your voters with your manifestos
                    </p>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-6 rounded px-8 py-3 text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg"
                    >
                        I'm a Candidate
                    </button>
                </div>
            </div>

            {/* Candidate Registration Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-gray-900">
                        <h2 className="text-2xl font-bold">Candidate Registration</h2>
                        <p className="text-gray-600 mt-2">Fill in your details below:</p>
                        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <textarea
                                name="manifesto"
                                placeholder="Your Manifesto"
                                value={formData.manifesto}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                required
                            ></textarea>
                            <label className="block text-gray-700 font-medium">
                                Upload Your Picture:
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="mt-1 w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </label>
                            <input
                                type="url"
                                name="youtubeLink"
                                placeholder="Manifesto Video (YouTube Link)"
                                value={formData.youtubeLink}
                                onChange={handleChange}
                                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default HomePage;
