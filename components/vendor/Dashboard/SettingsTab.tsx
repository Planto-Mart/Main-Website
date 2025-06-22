/* eslint-disable import/no-unresolved */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: thinking of removing this globally */
/* eslint-disable no-unused-vars */
"use client";
import { useState, useId } from 'react';
import Image from 'next/image';
import { Camera, Save, Store, User, Mail, Phone, MapPin, CreditCard, Shield, Bell, Upload } from 'lucide-react';

import { supabase } from '@/utils/supabase/client';

interface SettingsTabProps {
  vendorData: any;
}

function SettingsTab({ vendorData }: SettingsTabProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    storeName: vendorData?.vendor_details?.store_name || '',
    fullName: vendorData?.full_name || '',
    email: vendorData?.email || '',
    phone: vendorData?.phone || '',
    address: vendorData?.vendor_details?.address || '',
    city: vendorData?.vendor_details?.city || '',
    state: vendorData?.vendor_details?.state || '',
    pincode: vendorData?.vendor_details?.pincode || '',
    storeDescription: vendorData?.vendor_details?.description || '',
    bankName: vendorData?.vendor_details?.bank_name || '',
    accountNumber: vendorData?.vendor_details?.account_number || '',
    ifscCode: vendorData?.vendor_details?.ifsc_code || '',
    gstNumber: vendorData?.vendor_details?.gst_number || '',
    panNumber: vendorData?.vendor_details?.pan_number || '',
  });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    productReviews: true,
    lowStockAlerts: true,
    marketingEmails: false,
    securityAlerts: true,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const element_unique_id = useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${vendorData.uuid}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `vendor-avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles_dev')
        .update({ avatar_url: urlData.publicUrl })
        .eq('uuid', vendorData.uuid);

      if (updateError) {
        throw updateError;
      }

      // Show success message
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (section: string) => {
    try {
      setSaveStatus('saving');
      
      // In a real app, you would update the database here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update profile in Supabase (simplified for demo)
      // biome-ignore lint/correctness/noUnusedVariables: might be used in future
      const updateData = section === 'profile' 
        ? { 
            full_name: formData.fullName,
            phone: formData.phone,
            vendor_details: {
              ...vendorData.vendor_details,
              store_name: formData.storeName,
              description: formData.storeDescription,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
            }
          }
        : section === 'payment'
        ? {
            vendor_details: {
              ...vendorData.vendor_details,
              bank_name: formData.bankName,
              account_number: formData.accountNumber,
              ifsc_code: formData.ifscCode,
            }
          }
        : {
            vendor_details: {
              ...vendorData.vendor_details,
              gst_number: formData.gstNumber,
              pan_number: formData.panNumber,
            }
          };
      
      // In a real app, you would update the database here
      // const { error } = await supabase
      //   .from('profiles_dev')
      //   .update(updateData)
      //   .eq('uuid', vendorData.uuid);
      
      // if (error) throw error;
      
      setSaveStatus('success');
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and store settings</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <nav className="flex flex-col divide-y divide-gray-200">
              <button
                type='button'
                onClick={() => setActiveSection('profile')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeSection === 'profile'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="mr-3 size-5" />
                Profile & Store
              </button>
              <button
                type='button'
                onClick={() => setActiveSection('payment')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeSection === 'payment'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="mr-3 size-5" />
                Payment Information
              </button>
              <button
                type='button'
                onClick={() => setActiveSection('legal')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeSection === 'legal'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Shield className="mr-3 size-5" />
                Legal & Tax
              </button>
              <button
                type='button'
                onClick={() => setActiveSection('notifications')}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  activeSection === 'notifications'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="mr-3 size-5" />
                Notifications
              </button>
            </nav>
          </div>
        </div>
        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            {/* Profile & Store Settings */}
            {activeSection === 'profile' && (
              <div className="p-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Profile & Store Information</h2>
                {/* Profile Image */}
                <div className="mb-6">
                  <label htmlFor="profile-upload" className="mb-2 block text-sm font-medium text-gray-700">Profile Image</label>
                  <div className="flex items-center">
                    <div className="relative mr-4 size-20 overflow-hidden rounded-full border-2 border-gray-200">
                      {vendorData?.avatar_url ? (
                        <Image 
                          src={vendorData.avatar_url} 
                          alt="Profile" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-gray-100 text-xl font-medium text-gray-700">
                          {vendorData?.full_name?.charAt(0) || vendorData?.email?.charAt(0) || 'V'}
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="profile-upload" className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        <Camera className="mr-2 size-4" />
                        {isUploading ? 'Uploading...' : 'Change Image'}
                      </label>
                      <input 
                        id={element_unique_id} 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleProfileImageUpload}
                        disabled={isUploading}
                      />
                      <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                </div>
                {/* Store Information */}
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Store Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="storeName" className="mb-1 block text-sm font-medium text-gray-700">
                        Store Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Store className="size-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id={element_unique_id}
                          name="storeName"
                          value={formData.storeName}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Your Store Name"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="storeDescription" className="mb-1 block text-sm font-medium text-gray-700">
                        Store Description
                      </label>
                      <textarea
                        id={element_unique_id}
                        name="storeDescription"
                        value={formData.storeDescription}
                        onChange={handleInputChange}
                        rows={3}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="Describe your store and what you sell"
                      />
                    </div>
                  </div>
                </div>
                {/* Personal Information */}
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="size-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id={element_unique_id}
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Your Full Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="size-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id={element_unique_id}
                          name="email"
                          value={formData.email}
                          disabled
                          className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 pr-3 text-sm text-gray-500 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Phone className="size-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          id={element_unique_id}
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Your Phone Number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Address Information */}
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Address Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <MapPin className="size-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id={element_unique_id}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="Street Address"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id={element_unique_id}
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="mb-1 block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id={element_unique_id}
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <label htmlFor="pincode" className="mb-1 block text-sm font-medium text-gray-700">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        id={element_unique_id}
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        placeholder="PIN Code"
                      />
                    </div>
                  </div>
                </div>
                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings('profile')}
                    disabled={saveStatus === 'saving'}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <svg className="mr-2 size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
                {/* Status Messages */}
                {saveStatus === 'success' && (
                  <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">
                    Your profile information has been updated successfully.
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                    There was an error saving your changes. Please try again.
                  </div>
                )}
              </div>
            )}
            {/* Payment Information */}
            {activeSection === 'payment' && (
              <div className="p-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Payment Information</h2>
                <p className="mb-4 text-sm text-gray-600">
                  Add your bank account details to receive payments from your sales.
                </p>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bankName" className="mb-1 block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Your Bank Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="accountNumber" className="mb-1 block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Your Account Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="ifscCode" className="mb-1 block text-sm font-medium text-gray-700">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="IFSC Code"
                    />
                  </div>
                </div>
                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings('payment')}
                    disabled={saveStatus === 'saving'}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <svg className="mr-2 size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
                {/* Status Messages */}
                {saveStatus === 'success' && (
                  <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">
                    Your payment information has been updated successfully.
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                    There was an error saving your changes. Please try again.
                  </div>
                )}
              </div>
            )}
            {/* Legal & Tax Information */}
            {activeSection === 'legal' && (
              <div className="p-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Legal & Tax Information</h2>
                <p className="mb-4 text-sm text-gray-600">
                  Add your tax and legal information for compliance and invoicing.
                </p>
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="gstNumber" className="mb-1 block text-sm font-medium text-gray-700">
                      GST Number
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Your GST Number"
                    />
                  </div>
                  <div>
                    <label htmlFor="panNumber" className="mb-1 block text-sm font-medium text-gray-700">
                      PAN Number
                    </label>
                    <input
                      type="text"
                      id={element_unique_id}
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="Your PAN Number"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-medium text-gray-700">Documents</h3>
                  <div className="rounded-md border border-gray-300 bg-gray-50 p-4">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="mb-2 size-8 text-gray-400" />
                      <p className="mb-1 text-sm font-medium text-gray-700">Upload Documents</p>
                      <p className="mb-3 text-xs text-gray-500">Upload GST certificate, PAN card, and other legal documents</p>
                      <label htmlFor="document-upload" className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                        <Upload className="mr-2 size-4" />
                        Choose Files
                      </label>
                      <input 
                        id={element_unique_id}
                        type="file" 
                        multiple 
                        className="hidden" 
                      />
                    </div>
                  </div>
                </div>
                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSaveSettings('legal')}
                    disabled={saveStatus === 'saving'}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <svg className="mr-2 size-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
                {/* Status Messages */}
                {saveStatus === 'success' && (
                  <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">
                    Your legal information has been updated successfully.
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                    There was an error saving your changes. Please try again.
                  </div>
                )}
              </div>
            )}
            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="p-6">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Notification Preferences</h2>
                <p className="mb-4 text-sm text-gray-600">
                  Manage how you receive notifications and updates.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={element_unique_id}
                        name="orderUpdates"
                        type="checkbox"
                        checked={notifications.orderUpdates}
                        onChange={handleNotificationChange}
                        className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="orderUpdates" className="font-medium text-gray-700">Order Updates</label>
                      <p className="text-gray-500">Receive notifications when orders are placed, processed, or delivered.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={element_unique_id}
                        name="productReviews"
                        type="checkbox"
                        checked={notifications.productReviews}
                        onChange={handleNotificationChange}
                        className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="productReviews" className="font-medium text-gray-700">Product Reviews</label>
                      <p className="text-gray-500">Get notified when customers leave reviews on your products.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={element_unique_id}
                        name="lowStockAlerts"
                        type="checkbox"
                        checked={notifications.lowStockAlerts}
                        onChange={handleNotificationChange}
                        className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="lowStockAlerts" className="font-medium text-gray-700">Low Stock Alerts</label>
                      <p className="text-gray-500">Receive alerts when your product inventory is running low.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={element_unique_id}
                        name="marketingEmails"
                        type="checkbox"
                        checked={notifications.marketingEmails}
                        onChange={handleNotificationChange}
                        className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing Emails</label>
                      <p className="text-gray-500">Receive tips, product updates, and marketing best practices.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id={element_unique_id}
                        name="securityAlerts"
                        type="checkbox"
                        checked={notifications.securityAlerts}
                        onChange={handleNotificationChange}
                        className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="securityAlerts" className="font-medium text-gray-700">Security Alerts</label>
                      <p className="text-gray-500">Get important notifications about your account security.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      // In a real app, you would save notification preferences to the database
                      setSaveStatus('success');
                      setTimeout(() => setSaveStatus('idle'), 3000);
                    }}
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <Save className="mr-2 size-4" />
                    Save Preferences
                  </button>
                </div>
                {/* Status Messages */}
                {saveStatus === 'success' && (
                  <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">
                    Your notification preferences have been updated successfully.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsTab;