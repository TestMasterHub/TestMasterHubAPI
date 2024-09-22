import React from 'react';
import styles from '../Styles/PageStyles/resources.module.css';
import Navbar from '../Components/NavFooterBar/NavBar';

const Resources = () => {
    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>Welcome to TestMasterHub Resources! 📚</h1>
            <p className={styles.description}>
                TestMasterHub is a powerful API testing tool designed to help developers and testers streamline their workflow. 
                This page provides all the essential resources to get you started and maximize your experience with TestMasterHub.
            </p>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🚀 Getting Started</h2>
                <p>
                    To begin using TestMasterHub, follow these steps:
                </p>
                <ul>
                    <li>1. Clone the repository from GitHub.</li>
                    <li>2. Install the necessary dependencies using npm.</li>
                    <li>3. Start the server and navigate to the client.</li>
                </ul>
                <p>
                    For detailed instructions, please refer to our official documentation on GitHub.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🛠️ Features</h2>
                <p>TestMasterHub offers a variety of features, including:</p>
                <ul>
                    <li>📩 Send API requests with custom headers and request bodies.</li>
                    <li>🔄 Supports GET, POST, PUT, DELETE, and more.</li>
                    <li>📊 View response status, headers, and body in real-time.</li>
                    <li>💾 Save and reuse API configurations.</li>
                    <li>📝 Friendly UI for API testing.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>📖 Documentation</h2>
                <p>
                    Comprehensive documentation is available to guide you through every aspect of TestMasterHub. 
                    You can find it on our <a href="https://github.com/yourusername/testmasterhub-tool" target="_blank" rel="noopener noreferrer">GitHub repository</a>.
                </p>
                <p>Key documentation sections include:</p>
                <ul>
                    <li>🚀 Installation instructions</li>
                    <li>🛠️ API usage and examples</li>
                    <li>💻 Contribution guidelines</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>💬 Community Support</h2>
                <p>
                    Join our community on Slack or Discord to ask questions, share ideas, and connect with other users. 
                    Your feedback is invaluable in helping us improve TestMasterHub! Here are some resources to connect:
                </p>
                <ul>
                    <li>🌐 Join our Slack channel</li>
                    <li>🗨️ Participate in discussions on Discord</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>📞 Contact Us</h2>
                <p>If you have any questions or need support, feel free to reach out to us via our <a href="/contact" className={styles.link}>Contact page</a>.</p>
                <p>We're here to help you get the most out of TestMasterHub!</p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>📄 License</h2>
                <p>This project is licensed under the MIT License. You can find more information in the <a href="/license" className={styles.link}>LICENSE</a> file.</p>
            </section>
        </div>
    );
};

export default Resources;