import React, { useState } from 'react';
import { Button, Input, Modal, Toast, Loader } from '../components/ui';
import './Showcase.css';

const Showcase = () => {
  // Input State
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast States
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    if (val.length < 5 && val.length > 0) {
      setInputError('Input must be at least 5 characters long');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="showcase-page">
      <div className="showcase-container">
        <div className="showcase-header">
          <h1>Interactive Component Library</h1>
          <p>Explore and test the custom-built, documented UI components for EcoExplorer.</p>
        </div>

        {/* 1. Button Section */}
        <section className="showcase-section">
          <h2>1. Button Component</h2>
          <p className="section-desc">Supports multiple variants, sizing, loading overlays, and disabled states.</p>
          
          <div className="showcase-grid">
            <div className="showcase-group">
              <h3>Variants</h3>
              <div className="showcase-items">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="danger">Danger Button</Button>
              </div>
            </div>

            <div className="showcase-group">
              <h3>Sizes</h3>
              <div className="showcase-items">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div className="showcase-group">
              <h3>States</h3>
              <div className="showcase-items">
                <Button loading={true}>Loading State</Button>
                <Button disabled={true}>Disabled State</Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Input Section */}
        <section className="showcase-section">
          <h2>2. Input Component</h2>
          <p className="section-desc">Supports label tags, leading icons, disabled states, and dynamic validation states.</p>
          
          <div className="showcase-grid">
            <div className="showcase-group">
              <h3>Normal state</h3>
              <Input
                label="Search Destinations"
                placeholder="Type destination..."
                value={inputValue}
                onChange={handleInputChange}
                icon="🔍"
              />
            </div>

            <div className="showcase-group">
              <h3>Validation Error state</h3>
              <Input
                label="Email Input"
                placeholder="Enter email address..."
                value="invalid-email"
                onChange={() => {}}
                error="Please enter a valid email address"
                icon="✉️"
              />
            </div>

            <div className="showcase-group">
              <h3>Disabled state</h3>
              <Input
                label="Disabled Username"
                placeholder="Locked content"
                value="eco_explorer_admin"
                disabled={true}
                onChange={() => {}}
              />
            </div>
          </div>
        </section>

        {/* 3. Loader Section */}
        <section className="showcase-section">
          <h2>3. Loader Component</h2>
          <p className="section-desc">Spinner or pulse-based loaders for handling background tasks and pending requests.</p>
          
          <div className="showcase-grid">
            <div className="showcase-group">
              <h3>Spinner Variant</h3>
              <div className="showcase-items items-end">
                <Loader size="sm" text="Small loader" />
                <Loader size="md" text="Medium loader" />
                <Loader size="lg" text="Large loader" />
              </div>
            </div>

            <div className="showcase-group">
              <h3>Pulsing Dots Variant</h3>
              <div className="showcase-items items-end">
                <Loader size="sm" variant="pulse" />
                <Loader size="md" variant="pulse" text="Pulsing..." />
                <Loader size="lg" variant="pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Modal Section */}
        <section className="showcase-section">
          <h2>4. Modal Component</h2>
          <p className="section-desc">Accessible modal sheet overlay supporting custom title configurations, contents, and footer elements.</p>
          
          <div className="showcase-items">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal Dialog</Button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="UI Component Library Modal"
            footer={
              <>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
                <Button variant="primary" onClick={() => {
                  setIsModalOpen(false);
                  showToast('Action confirmed inside Modal!', 'success');
                }}>Confirm Action</Button>
              </>
            }
          >
            <p>You can press the **Escape** key or click the backdrop overlay to dismiss this modal window. Inside it, you can render any rich markup content safely.</p>
          </Modal>
        </section>

        {/* 5. Toast Section */}
        <section className="showcase-section">
          <h2>5. Toast Notification</h2>
          <p className="section-desc">Timed triggers with auto-dismiss timers, color-coded flags, and custom text.</p>
          
          <div className="showcase-items">
            <Button variant="primary" onClick={() => showToast('Operation completed successfully!', 'success')}>Trigger Success Toast</Button>
            <Button variant="danger" onClick={() => showToast('Failed to connect to servers!', 'error')}>Trigger Error Toast</Button>
            <Button variant="secondary" onClick={() => showToast('This is an informational notice.', 'info')}>Trigger Info Toast</Button>
          </div>
        </section>

        {/* Floating Toast Notification Container */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            duration={4000}
          />
        )}
      </div>
    </div>
  );
};

export default Showcase;
