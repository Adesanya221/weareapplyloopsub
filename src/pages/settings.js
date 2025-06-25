import SEO from '../shared/components/SEO';
import DashboardLayout from '../shared/components/DashboardLayout';

export default function Settings() {
  return (
    <DashboardLayout>
      <SEO 
        title="Settings" 
        description="Configure your restaurant's settings and preferences" 
      />
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <p className="text-gray-500">This page is under construction. Content will be added soon.</p>
      </div>
    </DashboardLayout>
  );
} 