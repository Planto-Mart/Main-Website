"use client";
import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { CheckCircle, AlertCircle, Loader2, Info, Shield, FileText, CreditCard, Building2, User, Store } from 'lucide-react';

// Enhanced regex for GST and PAN validation
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const steps = [
  'GST/PAN',
  'Business Details',
  'Contact & Branding',
  'Bank & Policies',
  'Review & Submit',
];

// Legal structure options based on registration type
const GST_LEGAL_STRUCTURES = [
  'Proprietorship',
  'Partnership',
  'Private Limited Company',
  'Public Limited Company',
  'Limited Liability Partnership (LLP)',
  'One Person Company (OPC)',
  'Other'
];

const PAN_LEGAL_STRUCTURES = [
  'Individual',
  'Sole Proprietorship',
  'Freelancer',
  'Other'
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full flex items-center justify-center gap-2 mb-10">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className={`flex flex-col items-center transition-all duration-300 ${idx <= currentStep ? 'text-green-600' : 'text-gray-400'}`}> 
            <div className={`rounded-full border-2 w-8 h-8 flex items-center justify-center font-bold text-lg bg-white z-10 transition-all duration-300 ${idx < currentStep ? 'border-green-600 bg-green-100 scale-110 shadow-md' : idx === currentStep ? 'border-green-600 bg-green-50 scale-105 shadow' : 'border-gray-300 bg-gray-100'}`}>{idx + 1}</div>
            <span className={`mt-2 text-xs font-medium text-center w-20 ${idx === currentStep ? 'text-green-700' : ''}`}>{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1 transition-all duration-300 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-fade-in-up">
      {children}
    </div>
  );
}

function GSTOrPANStep({ data, onChange, onNext, error }: any) {
  const [type, setType] = useState(data.gstin_number ? 'gst' : (data.pan_number ? 'pan' : ''));
  const [input, setInput] = useState(type === 'gst' ? data.gstin_number : data.pan_number || '');

  const handleNext = () => {
    if (type === 'gst') {
      if (!GST_REGEX.test(input)) return onChange({ error: 'Invalid GST number. Please enter a valid GSTIN (e.g., 22AAAAA0000A1Z5).' });
      onChange({ gstin_number: input, pan_number: '', error: '', registration_type: 'gst' });
      onNext();
    } else if (type === 'pan') {
      if (!PAN_REGEX.test(input)) return onChange({ error: 'Invalid PAN number. Please enter a valid PAN (e.g., ABCDE1234F).' });
      onChange({ pan_number: input, gstin_number: '', error: '', registration_type: 'pan' });
      onNext();
    } else {
      onChange({ error: 'Please select GST or PAN to continue.' });
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 1: GST or PAN</h2>
      <div className="mb-6 flex gap-6 justify-center">
        <button type="button" onClick={() => { setType('gst'); setInput(''); }} className={`transition-all duration-200 px-6 py-4 rounded-xl border-2 flex-1 text-left shadow-sm hover:shadow-lg focus:outline-none ${type === 'gst' ? 'border-green-600 bg-green-50 ring-2 ring-green-200 scale-105' : 'border-gray-200 bg-gray-50'}`}> 
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-green-700">GST</span>
            {type === 'gst' && <CheckCircle className="size-4 text-green-600 animate-bounce" />}
          </div>
          <p className="text-xs text-gray-500">For businesses with GST registration</p>
        </button>
        <button type="button" onClick={() => { setType('pan'); setInput(''); }} className={`transition-all duration-200 px-6 py-4 rounded-xl border-2 flex-1 text-left shadow-sm hover:shadow-lg focus:outline-none ${type === 'pan' ? 'border-green-600 bg-green-50 ring-2 ring-green-200 scale-105' : 'border-gray-200 bg-gray-50'}`}> 
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-green-700">PAN</span>
            {type === 'pan' && <CheckCircle className="size-4 text-green-600 animate-bounce" />}
          </div>
          <p className="text-xs text-gray-500">For individuals or businesses without GST</p>
        </button>
      </div>
      {type && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'gst' ? 'GST Number' : 'PAN Number'} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-green-500 text-lg transition-all duration-200"
            placeholder={type === 'gst' ? '22AAAAA0000A1Z5' : 'ABCDE1234F'}
          />
          <p className="mt-1 text-xs text-gray-500">
            {type === 'gst' ? 'Enter your 15-digit GSTIN number' : 'Enter your 10-character PAN number'}
          </p>
        </div>
      )}
      {error && <div className="mb-2 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{error}</div>}
      <button type="button" onClick={handleNext} className="mt-4 w-full rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
    </Card>
  );
}

function BusinessDetailsStep({ data, onChange, onNext, onBack }: any) {
  const isGST = data.registration_type === 'gst';
  const legalStructures = isGST ? GST_LEGAL_STRUCTURES : PAN_LEGAL_STRUCTURES;

  const handleNext = () => {
    // Basic validation
    if (!data.business_name?.trim()) {
      onChange({ error: 'Business name is required.' });
      return;
    }
    if (!data.business_address?.trim()) {
      onChange({ error: 'Business address is required.' });
      return;
    }
    if (isGST && !data.business_registration_number?.trim()) {
      onChange({ error: 'Registration number is required for GST-registered businesses.' });
      return;
    }
    if (!data.legal_structure) {
      onChange({ error: 'Please select a legal structure.' });
      return;
    }
    onChange({ error: '' });
    onNext();
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 2: Business Details</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="business_name" 
            value={data.business_name || ''} 
            onChange={onChange} 
            placeholder="Enter your business name" 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Address <span className="text-red-500">*</span>
          </label>
          <textarea 
            name="business_address" 
            value={data.business_address || ''} 
            onChange={onChange} 
            placeholder="Enter your business address" 
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
          />
          {isGST && (
            <p className="mt-1 text-xs text-orange-600 flex items-center">
              <Info className="mr-1 size-3" />
              This address must match your GST registration address
            </p>
          )}
        </div>

        {isGST && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="business_registration_number" 
              value={data.business_registration_number || ''} 
              onChange={onChange} 
              placeholder="Udyam Registration, CIN, etc." 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
            />
            <p className="mt-1 text-xs text-gray-500">Udyam Registration Number, Company CIN, or other business registration</p>
          </div>
        )}

        {!isGST && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number (Optional)
            </label>
            <input 
              type="text" 
              name="business_registration_number" 
              value={data.business_registration_number || ''} 
              onChange={onChange} 
              placeholder="Udyam Registration, etc. (optional)" 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
            />
            <p className="mt-1 text-xs text-gray-500">Optional: Udyam Registration Number or other registration</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Legal Structure <span className="text-red-500">*</span>
          </label>
          <select
            name="legal_structure"
            value={data.legal_structure || ''}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Select legal structure</option>
            {legalStructures.map((structure) => (
              <option key={structure} value={structure}>{structure}</option>
            ))}
          </select>
        </div>
      </div>
      
      {data.error && <div className="mt-4 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{data.error}</div>}
      
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={handleNext} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
      </div>
    </Card>
  );
}

function ContactBrandingStep({ data, onChange, onNext, onBack }: any) {
  const handleNext = () => {
    // Basic validation
    if (!data.contact_person_name?.trim()) {
      onChange({ error: 'Contact person name is required.' });
      return;
    }
    if (!data.contact_email?.trim() || !EMAIL_REGEX.test(data.contact_email)) {
      onChange({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!data.contact_phone?.trim() || !PHONE_REGEX.test(data.contact_phone)) {
      onChange({ error: 'Please enter a valid 10-digit phone number.' });
      return;
    }
    onChange({ error: '' });
    onNext();
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 3: Contact & Branding</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person Name <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="contact_person_name" 
            value={data.contact_person_name || ''} 
            onChange={onChange} 
            placeholder="Enter contact person name" 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input 
            type="email" 
            name="contact_email" 
            value={data.contact_email || ''} 
            onChange={onChange} 
            placeholder="contact@yourbusiness.com" 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
          />
          <p className="mt-1 text-xs text-gray-500">This will be used for vendor communications</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Phone <span className="text-red-500">*</span>
          </label>
          <input 
            type="tel" 
            name="contact_phone" 
            value={data.contact_phone || ''} 
            onChange={onChange} 
            placeholder="9876543210" 
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
          />
        </div>

        <div className="border-t pt-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Store className="mr-2 size-5 text-green-600" />
            Store Branding (Optional)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image URL</label>
              <input 
                type="url" 
                name="banner_image" 
                value={data.banner_image || ''} 
                onChange={onChange} 
                placeholder="https://example.com/banner.jpg" 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
              />
              <p className="mt-1 text-xs text-gray-500">Recommended size: 1200x300 pixels</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input 
                type="url" 
                name="logo" 
                value={data.logo || ''} 
                onChange={onChange} 
                placeholder="https://example.com/logo.png" 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
              />
              <p className="mt-1 text-xs text-gray-500">Recommended size: 200x200 pixels</p>
            </div>
          </div>
        </div>
      </div>

      {data.error && <div className="mt-4 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{data.error}</div>}

      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={handleNext} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
      </div>
    </Card>
  );
}

function BankPoliciesStep({ data, onChange, onNext, onBack }: any) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPolicies, setAgreedToPolicies] = useState({
    returnPolicy: false,
    shippingPolicy: false,
    privacyPolicy: false,
    sellerTerms: false
  });

  const handleNext = () => {
    // Bank validation
    if (!data.bank_account_number?.trim()) {
      onChange({ error: 'Bank account number is required.' });
      return;
    }
    if (!data.bank_name?.trim()) {
      onChange({ error: 'Bank name is required.' });
      return;
    }
    if (!data.ifsc_code?.trim() || !IFSC_REGEX.test(data.ifsc_code)) {
      onChange({ error: 'Please enter a valid IFSC code.' });
      return;
    }
    if (!data.bank_account_holder_name?.trim()) {
      onChange({ error: 'Bank account holder name is required.' });
      return;
    }
    if (!agreedToTerms) {
      onChange({ error: 'You must agree to the terms and conditions.' });
      return;
    }
    if (!Object.values(agreedToPolicies).every(Boolean)) {
      onChange({ error: 'You must agree to all platform policies.' });
      return;
    }
    onChange({ error: '' });
    onNext();
  };

  const handlePolicyChange = (policy: string) => {
    setAgreedToPolicies(prev => ({
      ...prev,
      [policy]: !prev[policy as keyof typeof prev]
    }));
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 4: Bank & Policies</h2>
      
      {/* Bank Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="mr-2 size-5 text-green-600" />
          Bank Account Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Account Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="bank_account_number" 
              value={data.bank_account_number || ''} 
              onChange={onChange} 
              placeholder="Enter account number" 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="bank_name" 
              value={data.bank_name || ''} 
              onChange={onChange} 
              placeholder="Enter bank name" 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="ifsc_code" 
              value={data.ifsc_code || ''} 
              onChange={onChange} 
              placeholder="ABCD0001234" 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Holder Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="bank_account_holder_name" 
              value={data.bank_account_holder_name || ''} 
              onChange={onChange} 
              placeholder="Enter account holder name" 
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" 
            />
            <p className="mt-1 text-xs text-orange-600">
              Must match your business name or contact person name
            </p>
          </div>
        </div>
      </div>

      {/* Platform Policies */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="mr-2 size-5 text-green-600" />
          Platform Policies Agreement
        </h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="return-policy"
              checked={agreedToPolicies.returnPolicy}
              onChange={() => handlePolicyChange('returnPolicy')}
              className="mt-1 mr-3 size-4 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="return-policy" className="text-sm text-gray-700">
              I agree to PlantoMart's <a href="#" className="text-green-600 hover:underline">Return Policy</a> <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="shipping-policy"
              checked={agreedToPolicies.shippingPolicy}
              onChange={() => handlePolicyChange('shippingPolicy')}
              className="mt-1 mr-3 size-4 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="shipping-policy" className="text-sm text-gray-700">
              I agree to PlantoMart's <a href="#" className="text-green-600 hover:underline">Shipping Policy</a> <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="privacy-policy"
              checked={agreedToPolicies.privacyPolicy}
              onChange={() => handlePolicyChange('privacyPolicy')}
              className="mt-1 mr-3 size-4 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="privacy-policy" className="text-sm text-gray-700">
              I agree to PlantoMart's <a href="#" className="text-green-600 hover:underline">Privacy Policy</a> <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="seller-terms"
              checked={agreedToPolicies.sellerTerms}
              onChange={() => handlePolicyChange('sellerTerms')}
              className="mt-1 mr-3 size-4 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="seller-terms" className="text-sm text-gray-700">
              I agree to PlantoMart's <a href="#" className="text-green-600 hover:underline">Vendor Terms & Conditions</a> <span className="text-red-500">*</span>
            </label>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="mb-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms-agreement"
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
            className="mt-1 mr-3 size-4 text-green-600 focus:ring-green-500"
          />
          <label htmlFor="terms-agreement" className="text-sm text-gray-700">
            I confirm that all information provided is true and accurate to the best of my knowledge. 
            I understand that providing false information may result in account termination. <span className="text-red-500">*</span>
          </label>
        </div>
      </div>

      {data.error && <div className="mb-4 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{data.error}</div>}

      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={handleNext} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
      </div>
    </Card>
  );
}

function ReviewSubmitStep({ data, onBack, onSubmit, loading, error, success }: any) {
  const isGST = data.registration_type === 'gst';

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 5: Review & Submit</h2>
      
      <div className="space-y-6">
        {/* Registration Details */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center">
            <Building2 className="mr-2 size-5" />
            Registration Details
          </h3>
          <div className="space-y-2 text-sm">
            {isGST ? (
              <p><strong>GSTIN:</strong> {data.gstin_number}</p>
            ) : (
              <p><strong>PAN:</strong> {data.pan_number}</p>
            )}
            <p><strong>Registration Type:</strong> {isGST ? 'GST Registered Business' : 'PAN Based Registration'}</p>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Store className="mr-2 size-5" />
            Business Information
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>Business Name:</strong> {data.business_name}</p>
            <p><strong>Legal Structure:</strong> {data.legal_structure}</p>
            <p><strong>Address:</strong> {data.business_address}</p>
            {data.business_registration_number && (
              <p><strong>Registration Number:</strong> {data.business_registration_number}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
            <User className="mr-2 size-5" />
            Contact Information
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>Contact Person:</strong> {data.contact_person_name}</p>
            <p><strong>Email:</strong> {data.contact_email}</p>
            <p><strong>Phone:</strong> {data.contact_phone}</p>
          </div>
        </div>

        {/* Bank Information */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
            <CreditCard className="mr-2 size-5" />
            Bank Information
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>Bank Name:</strong> {data.bank_name}</p>
            <p><strong>Account Number:</strong> {data.bank_account_number}</p>
            <p><strong>IFSC Code:</strong> {data.ifsc_code}</p>
            <p><strong>Account Holder:</strong> {data.bank_account_holder_name}</p>
          </div>
        </div>

        {/* Branding Information */}
        {(data.banner_image || data.logo) && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <FileText className="mr-2 size-5" />
              Branding Assets
            </h3>
            <div className="space-y-2 text-sm">
              {data.banner_image && <p><strong>Banner Image:</strong> {data.banner_image}</p>}
              {data.logo && <p><strong>Logo:</strong> {data.logo}</p>}
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-4 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{error}</div>}
      {success && <div className="mt-4 text-green-600 flex items-center"><CheckCircle className="mr-1 size-4" />{success}</div>}

      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={onSubmit} disabled={loading} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 flex items-center transition-all duration-200">
          {loading ? (<Loader2 className="mr-2 size-4 animate-spin" />) : null} Submit Registration
        </button>
      </div>
    </Card>
  );
}

export default function VendorRegister({ 
  userUUID, 
  userEmail, 
  userName, 
  onRegistrationSuccess 
}: {
  userUUID?: string;
  userEmail?: string;
  userName?: string;
  onRegistrationSuccess?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({
    user_uuid: userUUID || '',
    name: userName || '',
    contact_email: userEmail || '',
    contact_person_name: userName || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    if (e.target) {
      setForm({ ...form, [e.target.name]: e.target.value });
      setError('');
    } else {
      setForm({ ...form, ...e });
      setError(e.error || '');
    }
  };

  const handleNext = () => {
    setError('');
    setStep(step + 1);
  };
  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Ensure required fields are included
      const submissionData = {
        ...form,
        user_uuid: userUUID,
        name: form.business_name || userName,
        contact_email: form.contact_email || userEmail,
        contact_person_name: form.contact_person_name || userName
      };

      console.log('Submitting vendor registration with data:', submissionData);

      const res = await fetch(API_ENDPOINTS.vendorRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to register vendor');
      }
      setSuccess('Vendor registration successful! You will be notified once your application is reviewed.');
      // Call the success callback if provided
      if (onRegistrationSuccess) {
        setTimeout(() => {
          onRegistrationSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-2 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-3xl">
        <StepIndicator currentStep={step} />
      </div>
      <div className="w-full max-w-3xl">
        {step === 0 && <GSTOrPANStep data={form} onChange={handleChange} onNext={handleNext} error={error} />}
        {step === 1 && <BusinessDetailsStep data={form} onChange={handleChange} onNext={handleNext} onBack={handleBack} />}
        {step === 2 && <ContactBrandingStep data={form} onChange={handleChange} onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <BankPoliciesStep data={form} onChange={handleChange} onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <ReviewSubmitStep data={form} onBack={handleBack} onSubmit={handleSubmit} loading={loading} error={error} success={success} />}
      </div>
    </div>
  );
}
