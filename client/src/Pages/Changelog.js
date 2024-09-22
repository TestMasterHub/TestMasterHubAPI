import React from 'react';
import styles from '../Styles/PageStyles/changelog.module.css';
import Navbar from '../Components/NavFooterBar/NavBar';

const Changelog = () => {
    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>📝 Changelog</h1>
            <p className={styles.description}>
                Keep track of all the updates and changes made to TestMasterHub. This changelog provides a summary of 
                features added, improvements made, and bugs fixed in each version.
            </p>

            <section className={styles.section}>
                <h2 className={styles.version}>Version 1.0.0 - September 21, 2024</h2>
                <ul>
                    <li>🚀 Initial release of TestMasterHub with core features:</li>
                    <ul>
                        <li>Send API requests with custom headers and request bodies.</li>
                        <li>Support for various HTTP methods: GET, POST, PUT, DELETE.</li>
                        <li>Real-time viewing of response status, headers, and body.</li>
                        <li>Ability to save and reuse API configurations.</li>
                    </ul>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.version}>Version 1.1.0 - October 10, 2024</h2>
                <ul>
                    <li>✨ Added a user-friendly UI for enhanced navigation.</li>
                    <li>💾 Implemented local storage functionality for saving user configurations.</li>
                    <li>🔍 Improved error handling and validation for API responses.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.version}>Version 1.2.0 - November 5, 2024</h2>
                <ul>
                    <li>🌐 Introduced community support channels on Slack and Discord.</li>
                    <li>📚 Expanded documentation with detailed usage examples.</li>
                    <li>🛠️ Added functionality for importing and exporting API configurations in JSON format.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.version}>Version 1.3.0 - December 15, 2024</h2>
                <ul>
                    <li>✨ Enhanced UI with improved aesthetics and responsiveness.</li>
                    <li>🔄 Added dark mode support for better usability.</li>
                    <li>📊 Introduced performance improvements to speed up API requests.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.version}>Version 1.4.0 - January 20, 2025</h2>
                <ul>
                    <li>🔒 Implemented additional security features for API requests.</li>
                    <li>⚙️ Optimized codebase for better maintainability.</li>
                    <li>📝 Added a feedback feature for users to report issues and suggestions.</li>
                </ul>
            </section>
        </div>
    );
};

export default Changelog;
