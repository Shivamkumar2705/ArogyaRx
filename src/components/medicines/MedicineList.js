import { useState, useEffect } from 'react';
import API from '../../services/api';
import MedicineCard from '../medicines/MedicineCard';
import MedicineDetailsModal from './MedicineDetailsModal';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/medicines/public');
        // Use utility function to safely extract data
        const medicinesData = safeExtractData(res, 'data');
        setMedicines(medicinesData);
      } catch (err) {
        console.error('Error fetching medicines:', err);
        setError(handleApiError(err, 'Failed to load medicines. Please try again later.'));
        setMedicines([]); // Ensure medicines is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddToCart = async (medicine, quantity = 1) => {
    if (!isAuthenticated()) {
      alert('Please login to add items to your cart');
      return;
    }
  
    try {
      await API.post('/cart/add', {
        medicineId: medicine._id,
        quantity,
      });
      alert(`"${medicine.productName}" added to cart successfully!`);
      window.location.reload();
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(handleApiError(err, 'Failed to add item to cart. Please try again.'));
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        {t('medicines.catalog')}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No medicines found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Check back later for new additions to our catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.isArray(medicines) && medicines.map((medicine) => (
            <MedicineCard
              key={medicine._id}
              medicine={medicine}
              onSeeMore={() => setSelectedMedicine(medicine)}
              onAddToCart={() => handleAddToCart(medicine)}
            />
          ))}
        </div>
      )}

      {selectedMedicine && (
        <MedicineDetailsModal
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          onAddToCart={() => handleAddToCart(selectedMedicine)}
        />
      )}
    </div>
  );
};

export default MedicineList;