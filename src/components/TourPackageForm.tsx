import React from 'react';
import { X, Plus } from 'lucide-react';

interface TourPackage {
  _id?: string;  // Add this for existing packages
  packageName: string;
  tourLocation: string;
  packageDescription: string;
  duration: number;
  maxGroupSize: number;
  price: number;
  image: string | null;
  status?: 'pending' | 'approved' | 'rejected';  // Add this
}

interface TourPackageFormProps {
  tourPackages: TourPackage[];
  onPackageChange: (index: number, field: keyof TourPackage, value: any) => void;
  onImageChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddPackage: () => void;
  onRemovePackage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const TourPackageForm: React.FC<TourPackageFormProps> = ({
  tourPackages,
  onPackageChange,
  onImageChange,
  onAddPackage,
  onRemovePackage,
  onSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create Tour Package</h3>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {tourPackages.map((pkg, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">Package {index + 1}</h4>
                {tourPackages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemovePackage(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter package name"
                    value={pkg.packageName}
                    onChange={(e) => onPackageChange(index, 'packageName', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Location
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={pkg.tourLocation}
                    onChange={(e) => onPackageChange(index, 'tourLocation', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Description
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    placeholder="Enter package description"
                    value={pkg.packageDescription}
                    onChange={(e) => onPackageChange(index, 'packageDescription', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (days)
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pkg.duration}
                    onChange={(e) => onPackageChange(index, 'duration', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Group Size
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pkg.maxGroupSize}
                    onChange={(e) => onPackageChange(index, 'maxGroupSize', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD)
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pkg.price}
                    onChange={(e) => onPackageChange(index, 'price', parseInt(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                                        focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageChange(index, e)}
                    className="mt-1 block w-full px-3 py-2 text-sm text-gray-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-md file:border-0
                                            file:text-sm file:font-medium
                                            file:bg-blue
-50 file:text-blue-700
                                            hover:file:bg-blue-100
                                            focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a high-quality image (max 5MB)
                  </p>
                  {pkg.image && (
                    <div className="mt-2">
                      <img
                        src={pkg.image}
                        alt={`Preview of ${pkg.packageName}`}
                        className="h-32 w-auto object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onAddPackage}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Another Package
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              Save All Packages
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourPackageForm;