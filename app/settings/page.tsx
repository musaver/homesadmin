'use client';
import React, { useState, useEffect } from 'react';
import CurrencySymbol from '../components/CurrencySymbol';

interface TaxSetting {
  enabled: boolean;
  type: 'percentage' | 'fixed';
  value: number;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Stock management setting
  const [stockManagementEnabled, setStockManagementEnabled] = useState(true);
  
  // Tax settings
  const [vatTax, setVatTax] = useState<TaxSetting>({
    enabled: false,
    type: 'percentage',
    value: 0
  });
  
  const [serviceTax, setServiceTax] = useState<TaxSetting>({
    enabled: false,
    type: 'percentage',
    value: 0
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [stockRes, taxRes] = await Promise.all([
        fetch('/api/settings/stock-management'),
        fetch('/api/settings/tax-settings')
      ]);
      
      const stockData = await stockRes.json();
      const taxData = await taxRes.json();
      
      setStockManagementEnabled(stockData.stockManagementEnabled);
      setVatTax(taxData.vatTax);
      setServiceTax(taxData.serviceTax);
    } catch (err) {
      console.error(err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleStockManagementToggle = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await fetch('/api/settings/stock-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !stockManagementEnabled })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update stock management setting');
      }
      
      setStockManagementEnabled(!stockManagementEnabled);
      setSuccess('Stock management setting updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTaxSettingChange = (
    taxType: 'vat' | 'service',
    field: keyof TaxSetting,
    value: any
  ) => {
    const updateFunction = taxType === 'vat' ? setVatTax : setServiceTax;
    const currentSetting = taxType === 'vat' ? vatTax : serviceTax;
    
    updateFunction({
      ...currentSetting,
      [field]: value
    });
  };

  const handleSaveTaxSettings = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Validate settings
      if (vatTax.enabled && vatTax.value <= 0) {
        throw new Error('VAT tax value must be greater than 0 when enabled');
      }
      if (serviceTax.enabled && serviceTax.value <= 0) {
        throw new Error('Service tax value must be greater than 0 when enabled');
      }
      if (vatTax.type === 'percentage' && vatTax.value > 100) {
        throw new Error('VAT tax percentage cannot exceed 100%');
      }
      if (serviceTax.type === 'percentage' && serviceTax.value > 100) {
        throw new Error('Service tax percentage cannot exceed 100%');
      }
      
      const response = await fetch('/api/settings/tax-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vatTax, serviceTax })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update tax settings');
      }
      
      setSuccess('Tax settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatTaxPreview = (tax: TaxSetting, baseAmount: number = 100) => {
    if (!tax.enabled) return '0.00';
    
    if (tax.type === 'percentage') {
      return ((baseAmount * tax.value) / 100).toFixed(2);
    } else {
      return tax.value.toFixed(2);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      <div className="space-y-8">
        {/* Stock Management Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Stock Management</h2>
              <p className="text-gray-600 text-sm mt-1">
                Enable or disable inventory tracking for your products
              </p>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleStockManagementToggle}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  stockManagementEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    stockManagementEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {stockManagementEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {stockManagementEnabled ? (
              <p>✅ Orders will check and update inventory levels automatically</p>
            ) : (
              <p>❌ Orders will be created without inventory validation</p>
            )}
          </div>
        </div>

        {/* Tax Settings Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Tax Configuration</h2>
            <p className="text-gray-600 text-sm mt-1">
              Configure VAT and Service tax rates for your orders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* VAT Tax Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">VAT Tax</h3>
                <button
                  onClick={() => handleTaxSettingChange('vat', 'enabled', !vatTax.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    vatTax.enabled ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      vatTax.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {vatTax.enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-green-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Type
                    </label>
                    <select
                      value={vatTax.type}
                      onChange={(e) => handleTaxSettingChange('vat', 'type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Value
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={vatTax.value}
                        onChange={(e) => handleTaxSettingChange('vat', 'value', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        min="0"
                        max={vatTax.type === 'percentage' ? '100' : undefined}
                        step={vatTax.type === 'percentage' ? '0.1' : '0.01'}
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">
                          {vatTax.type === 'percentage' ? '%' : <CurrencySymbol />}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">
                      <strong>Preview:</strong> On a <CurrencySymbol />100 order, VAT tax would be{' '}
                      <CurrencySymbol />{formatTaxPreview(vatTax, 100)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Service Tax Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-700">Service Tax</h3>
                <button
                  onClick={() => handleTaxSettingChange('service', 'enabled', !serviceTax.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                    serviceTax.enabled ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      serviceTax.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {serviceTax.enabled && (
                <div className="space-y-4 pl-4 border-l-2 border-purple-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Type
                    </label>
                    <select
                      value={serviceTax.type}
                      onChange={(e) => handleTaxSettingChange('service', 'type', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Value
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={serviceTax.value}
                        onChange={(e) => handleTaxSettingChange('service', 'value', parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        min="0"
                        max={serviceTax.type === 'percentage' ? '100' : undefined}
                        step={serviceTax.type === 'percentage' ? '0.1' : '0.01'}
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">
                          {serviceTax.type === 'percentage' ? '%' : <CurrencySymbol />}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-md">
                    <p className="text-sm text-purple-700">
                      <strong>Preview:</strong> On a <CurrencySymbol />100 order, Service tax would be{' '}
                      <CurrencySymbol />{formatTaxPreview(serviceTax, 100)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Combined Tax Preview */}
          {(vatTax.enabled || serviceTax.enabled) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Combined Tax Preview</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div>Base Amount: <CurrencySymbol />100.00</div>
                {vatTax.enabled && (
                  <div>VAT Tax: <CurrencySymbol />{formatTaxPreview(vatTax, 100)}</div>
                )}
                {serviceTax.enabled && (
                  <div>Service Tax: <CurrencySymbol />{formatTaxPreview(serviceTax, 100)}</div>
                )}
                <div className="font-medium pt-2 border-t border-blue-300">
                  Total Amount: <CurrencySymbol />
                  {(100 + 
                    (vatTax.enabled ? parseFloat(formatTaxPreview(vatTax, 100)) : 0) + 
                    (serviceTax.enabled ? parseFloat(formatTaxPreview(serviceTax, 100)) : 0)
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveTaxSettings}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Tax Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 