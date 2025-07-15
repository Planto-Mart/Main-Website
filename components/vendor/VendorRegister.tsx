"use client";
import React, { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Simple regex for GST and PAN validation
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const steps = [
  'GST/PAN',
  'Business Details',
  'Legal & Contact Info',
  'Bank & Policies',
  'Review & Submit',
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
      if (!GST_REGEX.test(input)) return onChange({ error: 'Invalid GST number.' });
      onChange({ gstin_number: input, pan_number: '', error: '' });
      onNext();
    } else if (type === 'pan') {
      if (!PAN_REGEX.test(input)) return onChange({ error: 'Invalid PAN number.' });
      onChange({ pan_number: input, gstin_number: '', error: '' });
      onNext();
    } else {
      onChange({ error: 'Please select GST or PAN.' });
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
          <p className="text-xs text-gray-500">Recommended for registered businesses</p>
        </button>
        <button type="button" onClick={() => { setType('pan'); setInput(''); }} className={`transition-all duration-200 px-6 py-4 rounded-xl border-2 flex-1 text-left shadow-sm hover:shadow-lg focus:outline-none ${type === 'pan' ? 'border-green-600 bg-green-50 ring-2 ring-green-200 scale-105' : 'border-gray-200 bg-gray-50'}`}> 
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-green-700">PAN</span>
            {type === 'pan' && <CheckCircle className="size-4 text-green-600 animate-bounce" />}
          </div>
          <p className="text-xs text-gray-500">For individuals or sole proprietors</p>
        </button>
      </div>
      {type && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{type === 'gst' ? 'GST Number' : 'PAN Number'}</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-500 focus:ring-green-500 text-lg transition-all duration-200"
            placeholder={type === 'gst' ? '22AAAAA0000A1Z5' : 'ABCDE1234F'}
          />
        </div>
      )}
      {error && <div className="mb-2 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{error}</div>}
      <button type="button" onClick={handleNext} className="mt-4 w-full rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
    </Card>
  );
}

function BusinessDetailsStep({ data, onChange, onNext, onBack }: any) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 2: Business Details</h2>
      <div className="space-y-5">
        <input type="text" name="business_name" value={data.business_name || ''} onChange={onChange} placeholder="Business Name" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="business_address" value={data.business_address || ''} onChange={onChange} placeholder="Business Address" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="business_registration_number" value={data.business_registration_number || ''} onChange={onChange} placeholder="Registration Number" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="legal_structure" value={data.legal_structure || ''} onChange={onChange} placeholder="Legal Structure (e.g. Proprietorship, Pvt Ltd)" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
      </div>
    </Card>
  );
}

function LegalContactStep({ data, onChange, onNext, onBack }: any) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 3: Legal & Contact Info</h2>
      <div className="space-y-5">
        <input type="text" name="contact_person_name" value={data.contact_person_name || ''} onChange={onChange} placeholder="Contact Person Name" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="email" name="contact_email" value={data.contact_email || ''} onChange={onChange} placeholder="Contact Email" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="tel" name="contact_phone" value={data.contact_phone || ''} onChange={onChange} placeholder="Contact Phone" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="banner_image" value={data.banner_image || ''} onChange={onChange} placeholder="Banner Image URL" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="logo" value={data.logo || ''} onChange={onChange} placeholder="Logo URL" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
      </div>
    </Card>
  );
}

function BankPoliciesStep({ data, onChange, onNext, onBack }: any) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 4: Bank Info & Policies</h2>
      <div className="space-y-5">
        <input type="text" name="bank_account_number" value={data.bank_account_number || ''} onChange={onChange} placeholder="Bank Account Number" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="bank_name" value={data.bank_name || ''} onChange={onChange} placeholder="Bank Name" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <input type="text" name="ifsc_code" value={data.ifsc_code || ''} onChange={onChange} placeholder="IFSC Code" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <textarea name="return_policy" value={data.return_policy || ''} onChange={onChange} placeholder="Return Policy" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <textarea name="shipping_policy" value={data.shipping_policy || ''} onChange={onChange} placeholder="Shipping Policy" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <textarea name="privacy_policy" value={data.privacy_policy || ''} onChange={onChange} placeholder="Privacy Policy" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
        <textarea name="seller_terms" value={data.seller_terms || ''} onChange={onChange} placeholder="Seller Terms" className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-green-500 focus:ring-green-500" />
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={onNext} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 transition-all duration-200">Next</button>
      </div>
    </Card>
  );
}

function ReviewSubmitStep({ data, onBack, onSubmit, loading, error, success }: any) {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-green-700">Step 5: Review & Submit</h2>
      <div className="bg-green-50 rounded-xl p-4 mb-4 border border-green-100 animate-fade-in">
        <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </div>
      {error && <div className="mb-2 text-red-600 flex items-center"><AlertCircle className="mr-1 size-4" />{error}</div>}
      {success && <div className="mb-2 text-green-600 flex items-center"><CheckCircle className="mr-1 size-4" />{success}</div>}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={onBack} className="rounded-lg border border-gray-300 px-6 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition-all duration-200">Back</button>
        <button type="button" onClick={onSubmit} disabled={loading} className="rounded-lg bg-green-600 px-6 py-3 text-white font-semibold text-lg shadow hover:bg-green-700 flex items-center transition-all duration-200">
          {loading ? (<Loader2 className="mr-2 size-4 animate-spin" />) : null} Submit
        </button>
      </div>
    </Card>
  );
}

export default function VendorRegister() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<any>({});
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
      const res = await fetch(API_ENDPOINTS.vendorRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to register vendor');
      }
      setSuccess('Vendor registration successful!');
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
        {step === 2 && <LegalContactStep data={form} onChange={handleChange} onNext={handleNext} onBack={handleBack} />}
        {step === 3 && <BankPoliciesStep data={form} onChange={handleChange} onNext={handleNext} onBack={handleBack} />}
        {step === 4 && <ReviewSubmitStep data={form} onBack={handleBack} onSubmit={handleSubmit} loading={loading} error={error} success={success} />}
      </div>
    </div>
  );
}

// Animations (add to your global CSS or Tailwind config)
// .animate-fade-in { animation: fadeIn 0.7s ease; }
// .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } } 