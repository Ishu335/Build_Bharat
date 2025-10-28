import { Info, Users, Target, Shield, Heart } from 'lucide-react'
import './AboutPage.css'

function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="page-header-about">
          <h1 className="page-title">
            <Info size={32} />
            <div>
              <span className="hindi-text">मनरेगा के बारे में</span>
              <br />
              <span className="page-subtitle">About MGNREGA</span>
            </div>
          </h1>
        </div>
        
        {/* What is MGNREGA */}
        <section className="about-section">
          <h2 className="section-title">
            <span className="hindi-text">मनरेगा क्या है?</span> • What is MGNREGA?
          </h2>
          <div className="content-card">
            <p className="hindi-text large-text">
              महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा) भारत का एक सामाजिक कल्याण कार्यक्रम है जो ग्रामीण क्षेत्रों में रहने वाले परिवारों को एक वित्तीय वर्ष में 100 दिनों की गारंटीकृत मजदूरी रोजगार प्रदान करता है।
            </p>
            <p className="large-text">
              The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) is a social welfare program of India that guarantees 100 days of wage employment in a financial year to rural households whose adult members volunteer to do unskilled manual work.
            </p>
          </div>
        </section>
        
        {/* Key Objectives */}
        <section className="about-section">
          <h2 className="section-title">
            <Target size={24} />
            <span className="hindi-text">मुख्य उद्देश्य</span> • Key Objectives
          </h2>
          <div className="objectives-grid">
            <div className="objective-card">
              <div className="objective-icon">
                <Users size={32} />
              </div>
              <h3 className="hindi-text">रोजगार गारंटी</h3>
              <h4>Employment Guarantee</h4>
              <p>
                Provide at least 100 days of guaranteed wage employment per financial year to adult members of rural households
              </p>
            </div>
            
            <div className="objective-card">
              <div className="objective-icon">
                <Shield size={32} />
              </div>
              <h3 className="hindi-text">आजीविका सुरक्षा</h3>
              <h4>Livelihood Security</h4>
              <p>
                Enhance livelihood security in rural areas by providing employment opportunities during lean agricultural seasons
              </p>
            </div>
            
            <div className="objective-card">
              <div className="objective-icon">
                <Heart size={32} />
              </div>
              <h3 className="hindi-text">सामाजिक समावेश</h3>
              <h4>Social Inclusion</h4>
              <p>
                Empower rural women and marginalized communities by ensuring their participation in the workforce
              </p>
            </div>
          </div>
        </section>
        
        {/* Key Features */}
        <section className="about-section">
          <h2 className="section-title">
            <span className="hindi-text">मुख्य विशेषताएं</span> • Key Features
          </h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-number">1</div>
              <div className="feature-content">
                <h3 className="hindi-text">कानूनी गारंटी</h3>
                <h4>Legal Guarantee</h4>
                <p>Right to work is a legal entitlement for rural households</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">2</div>
              <div className="feature-content">
                <h3 className="hindi-text">मांग-आधारित</h3>
                <h4>Demand-Driven</h4>
                <p>Work is provided on demand within 15 days of application</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">3</div>
              <div className="feature-content">
                <h3 className="hindi-text">महिला भागीदारी</h3>
                <h4>Women Participation</h4>
                <p>At least one-third of beneficiaries must be women</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">4</div>
              <div className="feature-content">
                <h3 className="hindi-text">संपत्ति निर्माण</h3>
                <h4>Asset Creation</h4>
                <p>Focus on creating durable assets and strengthening rural infrastructure</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">5</div>
              <div className="feature-content">
                <h3 className="hindi-text">पारदर्शिता</h3>
                <h4>Transparency</h4>
                <p>Mandatory social audits ensure accountability and transparency</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-number">6</div>
              <div className="feature-content">
                <h3 className="hindi-text">समयबद्ध भुगतान</h3>
                <h4>Timely Payment</h4>
                <p>Wages must be paid within 15 days of work completion</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Impact */}
        <section className="about-section">
          <h2 className="section-title">
            <span className="hindi-text">प्रभाव</span> • Impact
          </h2>
          <div className="impact-stats-grid">
            <div className="impact-stat">
              <div className="impact-value">12.15 Cr+</div>
              <div className="impact-label hindi-text">लाभार्थी (2025)</div>
              <div className="impact-label-en">Beneficiaries in 2025</div>
            </div>
            
            <div className="impact-stat">
              <div className="impact-value">World's Largest</div>
              <div className="impact-label hindi-text">रोजगार कार्यक्रम</div>
              <div className="impact-label-en">Employment Program</div>
            </div>
            
            <div className="impact-stat">
              <div className="impact-value">100+</div>
              <div className="impact-label hindi-text">दिन गारंटी</div>
              <div className="impact-label-en">Days Guaranteed Employment</div>
            </div>
          </div>
        </section>
        
        {/* About This Platform */}
        <section className="about-section">
          <h2 className="section-title">
            <span className="hindi-text">इस प्लेटफॉर्म के बारे में</span> • About This Platform
          </h2>
          <div className="content-card">
            <p className="hindi-text">
              यह प्लेटफॉर्म ग्रामीण भारत के नागरिकों के लिए अपने जिले के मनरेगा प्रदर्शन को समझना आसान बनाने के लिए बनाया गया है। हम सरकारी डेटा को सरल, दृश्य प्रारूप में प्रस्तुत करते हैं जो कम साक्षरता वाली आबादी के लिए सुलभ है।
            </p>
            <p>
              This platform is built to make it easy for citizens of rural India to understand their district's MGNREGA performance. We present government data in simple, visual formats that are accessible to low-literacy populations.
            </p>
            
            <div className="platform-features">
              <h3>Platform Features:</h3>
              <ul>
                <li>✓ <span className="hindi-text">द्विभाषी</span> Bilingual (Hindi & English)</li>
                <li>✓ <span className="hindi-text">सरल दृश्य</span> Simple visualizations</li>
                <li>✓ <span className="hindi-text">मोबाइल-अनुकूल</span> Mobile-friendly design</li>
                <li>✓ <span className="hindi-text">ऐतिहासिक डेटा</span> Historical data tracking</li>
                <li>✓ <span className="hindi-text">जिला तुलना</span> District comparison</li>
                <li>✓ <span className="hindi-text">ऑफ़लाइन कैशिंग</span> Offline data caching</li>
              </ul>
            </div>
          </div>
        </section>
        
        {/* Data Source */}
        <section className="about-section">
          <h2 className="section-title">
            <span className="hindi-text">डेटा स्रोत</span> • Data Source
          </h2>
          <div className="content-card">
            <p>
              All data is sourced from the official Open Government Data (OGD) Platform India at{' '}
              <a href="https://data.gov.in" target="_blank" rel="noopener noreferrer">
                data.gov.in
              </a>
            </p>
            <p className="hindi-text">
              सभी डेटा आधिकारिक ओपन गवर्नमेंट डेटा (OGD) प्लेटफ़ॉर्म इंडिया से प्राप्त किया गया है।
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage

