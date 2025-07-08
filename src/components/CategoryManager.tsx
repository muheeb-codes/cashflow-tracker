import React, { useState } from 'react';
import { Settings, Plus, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { Category } from '../types';

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useExpenses();
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({ name: '', color: '#3B82F6' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateCategory({ ...editingCategory, ...newCategory });
      setEditingCategory(null);
    } else {
      addCategory(newCategory);
    }
    
    setNewCategory({ name: '', color: '#3B82F6' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, color: category.color });
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    if (editingCategory && editingCategory.id === id) {
      setEditingCategory(null);
      setNewCategory({ name: '', color: '#3B82F6' });
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewCategory({ name: '', color: '#3B82F6' });
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <Settings size={16} />
        <span>Manage Categories</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Manage Categories</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-4 flex-grow overflow-y-auto">
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Category name"
                    required
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="p-1 border border-gray-300 rounded-md w-14 h-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  {editingCategory ? (
                    <>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-grow"
                      >
                        Update Category
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 w-full"
                    >
                      <Plus size={16} />
                      <span>Add Category</span>
                    </button>
                  )}
                </div>
              </form>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-800">Current Categories</h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li
                      key={category.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;