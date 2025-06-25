import { Suspense, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';

// Import custom components and hooks
import SEO from '../shared/components/SEO';
import MetricCard from '../shared/components/MetricCard';
import useDashboardData from '../shared/hooks/useDashboardData';
import SectionCard from '../shared/components/SectionCard';
import OrderItem from '../shared/components/OrderItem';
import TrendingMenuItem from '../shared/components/TrendingMenuItem';
import DashboardLayout from '../shared/components/DashboardLayout';
import RevenueChart from '../shared/components/RevenueChart';
import VendorStatusWidget from '../shared/components/VendorStatusWidget';
import { useVendorStatus } from '../shared/hooks/useVendorStatus';

// Dynamically import chart components for code splitting
const DynamicLine = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-full w-full rounded-md"></div>
});

const DynamicBar = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-full w-full rounded-md"></div>
});

// Dynamically import Chart.js to reduce initial bundle size
import('chart.js').then(({ Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler }) => {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);
});

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Icons for metric cards
const metricIcons = {
  menus: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
      <path d="M5 8h14M5 12h14M5 16h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  orders: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  customers: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  income: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

export default function Dashboard({ logout }) {
  // State for timeframe filters
  const [timeframe, setTimeframe] = useState('monthly');
  const [customerTimeframe, setCustomerTimeframe] = useState('monthly');
  
  // Fetch dashboard data using custom hook
  const { loading, error, data, refreshData } = useDashboardData(timeframe);
  
  // Memoize chart data to prevent unnecessary recalculations
  const revenueChartData = useMemo(() => ({
    labels: data.revenue.labels,
    datasets: [
      {
        label: 'Income',
        data: data.revenue.income,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      },
      {
        label: 'Expense',
        data: data.revenue.expense,
        fill: true,
        backgroundColor: 'rgba(96, 165, 250, 0.2)',
        borderColor: 'rgb(96, 165, 250)',
        tension: 0.4,
      },
    ],
  }), [data.revenue]);
  
  const customerChartData = useMemo(() => ({
    labels: data.customers.labels,
    datasets: [
      {
        label: 'New Customers',
        data: data.customers.acquired,
        backgroundColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Churned Customers',
        data: data.customers.churned,
        backgroundColor: 'rgb(107, 114, 128)',
      },
    ],
  }), [data.customers]);
  
  // Handler for timeframe changes
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  const handleCustomerTimeframeChange = (newTimeframe) => {
    setCustomerTimeframe(newTimeframe);
    // In a real app, this would trigger a new API call with the selected timeframe
  };

  // Handler for order item action button
  const handleOrderAction = (orderId, action) => {
    // In a real app, you would call an API to update the order status
    console.log(`Action '${action}' clicked for order: ${orderId}`);
    
    switch(action) {
      case 'accept':
        alert(`Order #${orderId} accepted successfully!`);
        break;
      case 'reject':
        alert(`Order #${orderId} rejected!`);
        break;
      case 'view':
        alert(`View details for order #${orderId}`);
        break;
      default:
        // Just showing the action menu
        break;
    }
  };

  return (
    <DashboardLayout logout={logout}>
      <SEO 
        title="Dashboard" 
        description="Track your restaurant's performance with real-time analytics and insights" 
      />
      
      {loading ? (
        <div className="space-y-6">
          {/* Skeleton loading state */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-80 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
                <button onClick={refreshData} className="ml-2 font-medium underline">Retry</button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Suspense fallback={<LoadingSpinner />}>
          {/* Vendor Status Widget */}
          <div className="mb-8">
            <VendorStatusWidget />
          </div>
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(data.metrics).map(([key, metricData]) => (
              <MetricCard
                key={key}
                title={key.charAt(0).toUpperCase() + key.slice(1)}
                value={metricData.value}
                change={metricData.change}
                chartData={metricData.chartData}
                icon={metricIcons[key]}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <RevenueChart 
              data={{
                income: data.revenue.income || [561623, 450000, 380000, 420000, 490000, 530000, 610000],
                expense: data.revenue.expense || [126621, 89000, 70000, 85000, 95000, 110000, 135000],
                labels: data.revenue.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July']
              }}
              timeframe={timeframe}
            />

            {/* Customer Map */}
            <div className="bg-white rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Customer Map</h2>
                  <p className="text-sm text-gray-500">Customer acquisition and churn rates</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${customerTimeframe === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleCustomerTimeframeChange('monthly')}
                  >
                    Monthly
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${customerTimeframe === 'weekly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleCustomerTimeframeChange('weekly')}
                  >
                    Weekly
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${customerTimeframe === 'daily' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => handleCustomerTimeframeChange('daily')}
                  >
                    Today
                  </button>
                </div>
              </div>
              <div className="h-80 relative">
                <DynamicBar
                  data={customerChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          boxWidth: 6
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += Math.abs(context.parsed.y);
                            }
                            return label;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)',
                        },
                        ticks: {
                          callback: function(value) {
                            return Math.abs(value);
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                    animation: {
                      duration: 1000
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Orders and Trending Menu Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders Section */}
            <SectionCard 
              title="Recent Order Request" 
              subtitle="Lorem ipsum dolor" 
              action={
                <div className="flex items-center text-sm">
                  <span className="mr-2">Newest</span>
                  <FiChevronDown className="text-gray-500" />
                </div>
              }
            >
              <div className="mt-4">
                {data.recentOrders.map((order) => (
                  <OrderItem
                    key={`${order.id}-${order.quantity}`}
                    image={order.image}
                    title={order.title}
                    orderId={order.id}
                    price={order.price}
                    quantity={order.quantity}
                    status={order.status}
                    customerName={order.customerName}
                    location={order.location}
                    onActionClick={(action) => handleOrderAction(order.id, action)}
                  />
                ))}
              </div>
              
              <div className="text-center mt-4">
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center mx-auto transition-all hover:translate-x-1">
                  View More <FiArrowRight className="ml-1" />
                </button>
              </div>
            </SectionCard>

            {/* Trending Menu Section */}
            <SectionCard 
              title="Daily Trending Menus" 
              subtitle="Lorem ipsum dolor"
            >
              <div className="mt-4">
                {data.trendingMenus.map((item) => (
                  <TrendingMenuItem
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    price={item.price}
                    orderCount={item.orderCount}
                    rankNumber={item.id}
                  />
                ))}
              </div>
            </SectionCard>
          </div>
        </Suspense>
      )}
    </DashboardLayout>
  );
} 