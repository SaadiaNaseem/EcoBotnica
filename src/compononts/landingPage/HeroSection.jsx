import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";  // Import useNavigate from React Router


export default function HeroSection() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const icons = [
        { icon: "🌸", label: "Flower" },
        { icon: "🌿", label: "Herb" },
        { icon: "🌳", label: "Tree" },
        { icon: "🪴", label: "Potted Plant" },
        { icon: "🌵", label: "Cactus" },
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
    };
    const navigate = useNavigate();  // Use navigate to programmatically navigate

    // Function to handle the button click
    const handleClick = () => {
        navigate("/AboutEcobotanica");  // Navigate to AboutEcobotanica page
    };

    return (
        <section
            className="relative flex flex-col items-center justify-center text-center w-full min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${assets.LHero})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

            {/* Hero Title */}
            <motion.h1
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl font-semibold mb-4 tracking-wide text-center z-10 relative"
            >
                Welcome to <span className="text-green-600">EcoBotanica</span>
            </motion.h1>

            {/* Content */}
            <motion.div
                className="relative z-10 max-w-4xl px-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <p className="text-sm tracking-[3px] text-green-900 uppercase mb-3">
                    Welcome to Nature’s Future
                </p>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-900 leading-tight mb-3">
                    Nurture Your Plants with <span className="text-yellow-600">AI</span>
                </h2>

                <p className="text-gray-700 text-base sm:text-lg mb-8">
                    From identification to diagnosis, grow any plant with confidence — flowers,
                    herbs, trees, succulents, indoor plants & more. Your AI companion for the
                    complete plant care journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClick}  // Handle the click to navigate
                        className="px-6 py-3 border border-green-800 text-green-900 bg-white rounded-[20px] hover:bg-green-50 transition"
                    >
                        Learn More
                    </motion.button>
                </div>

                {/* Icons row */}
                <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <p className="text-xs uppercase tracking-wider text-green-800 mb-3 text-center">
                        Loved by plant enthusiasts worldwide — flowers, herbs, trees, indoor plants & more
                    </p>

                    <div className="flex justify-center gap-6 text-3xl relative">
                        {icons.map((item, i) => (
                            <div
                                key={i}
                                className="relative flex flex-col items-center"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <motion.span
                                    whileHover={{
                                        scale: 1.4,
                                        rotate: [0, 10, -10, 0],
                                        textShadow: "0px 0px 8px rgba(34,197,94,0.8)",
                                    }}
                                    transition={{ type: "tween", duration: 0.5 }}
                                    className="cursor-pointer select-none z-10 relative"
                                >
                                    {item.icon}
                                </motion.span>

                                <AnimatePresence>
                                    {hoveredIndex === i && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute -bottom-8 text-xs text-green-900 bg-green-100 px-2 py-1 rounded shadow-lg whitespace-nowrap z-20"
                                        >
                                            {item.label}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
