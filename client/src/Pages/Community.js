import React from 'react';
import styles from '../Styles/PageStyles/community.module.css';
import Navbar from '../Components/NavFooterBar/NavBar';

const Community = () => {
    return (
        <div className={styles.container}>
            <Navbar />
            <h1 className={styles.title}>🌍 TestMasterHub Community</h1>
            <p className={styles.description}>
                Welcome to the TestMasterHub community! This page is dedicated to helping you connect with other users, 
                share your experiences, and contribute to the growth of our platform.
            </p>

            <h2 className={styles.subtitle}>🤝 Get Involved</h2>
            <p className={styles.text}>
                We encourage you to engage with fellow developers and API enthusiasts. Here’s how you can get involved:
            </p>
            <ul className={styles.list}>
                <li>Join our [Discord Server](#) to chat with other users and developers.</li>
                <li>Follow us on [Twitter](#) for updates and news.</li>
                <li>Participate in discussions on our [GitHub Discussions](#).</li>
                <li>Share your feedback and suggestions through our [Feedback Form](#).</li>
            </ul>

            <h2 className={styles.subtitle}>🌟 Contribute</h2>
            <p className={styles.text}>
                We welcome contributions to improve TestMasterHub! Whether it's code, documentation, or reporting issues, 
                your input is invaluable.
            </p>
            <p className={styles.text}>
                Check out our [Contribution Guidelines](#) for more information on how to get started.
            </p>

            <h2 className={styles.subtitle}>📅 Upcoming Events</h2>
            <p className={styles.text}>
                Stay tuned for upcoming webinars, meetups, and community events! You can find the schedule on our 
                [Events Page](#).
            </p>

            <h2 className={styles.subtitle}>📜 Community Guidelines</h2>
            <p className={styles.text}>
                Please follow our community guidelines to ensure a welcoming environment for everyone. 
                Read our [Community Guidelines](#) to learn more.
            </p>
        </div>
    );
};

export default Community;
