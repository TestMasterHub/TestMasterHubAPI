import React, { useState } from 'react';
import MainLayout from '../Layouts/MainLayout'; // Reusing Main Layout
import styles from '../Styles/PageStyles/CollectionPage.module.css';
import LocalDB from '../Utlis/LocalDB'
function CollectionPage({ handleFileUpload }) {
  const [activeTab, setActiveTab] = useState('Overview');
  // Assuming collections and requests are fetched from the backend, you can replace this with actual data.
  const collection = {
    name: `${LocalDB.get('collectionname')}`,
    createdOn: '24 Sep 2024, 5:15 PM',
    createdBy: 'You',
    description: 'This is a new collection description.',
  };

  // Handle tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <MainLayout handleFileUpload={handleFileUpload}>
      <div className={styles.collectionPage}>
        
        {/* The AsideBar should already be included in the MainLayout */}
        {/* Main Content */}
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <h1>{collection.name}</h1>
            <div className={styles.tabs}>
              {['Overview', 'Authorization', 'Scripts', 'Variables', 'Runs'].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.activeTab : ''}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>

          {/* Display content based on the active tab */}
          {activeTab === 'Overview' && (
            <div className={styles.overviewContent}>
              <p>{collection.description}</p>

              {/* Templates Section */}
              <div className={styles.templates}>
                <h3>Top templates for you</h3>
                <div className={styles.templateCards}>
                  <div className={styles.templateCard}>REST API basics</div>
                  <div className={styles.templateCard}>End-to-end testing</div>
                  <div className={styles.templateCard}>Functional testing</div>
                  <div className={styles.templateCard}>Integration testing</div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tab content */}
          {activeTab !== 'Overview' && <div>Content for {activeTab}</div>}
        </div>
      </div>
    </MainLayout>
  );
}

export default CollectionPage;
