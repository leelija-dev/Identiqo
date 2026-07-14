// app/dashboard/employees/page.jsx
"use client";

import { getAccessToken } from "@/lib/auth";
import { useState, useEffect } from 'react';
import {
    FiUsers,
    FiSearch,
    FiFilter,
    FiDownload,
    FiChevronLeft,
    FiChevronRight,
    FiEye,
    FiEdit,
    FiTrash2,
    FiUser,
    FiMail,
    FiPhone,
    FiCalendar,
    FiBriefcase,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiRefreshCw,
    FiPlus,
    FiX,
    FiMapPin,
    FiCreditCard,
    FiUserPlus,
    FiPhoneCall,
    FiGlobe,
    FiHash,
    FiAlertCircle,
} from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:8000/web-api/api';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        personal_email: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
        zip_code: '',
        aadhar_number: '',
        pan_number: '',
        votar_id: '',
        designation: '',
        department: '',
        blood_group: '',
        joining_date: '',
        employment_type: 'full-time',
        status: 'active',
        emergency_contact_phone: '',
        profile_picture: '',
        profile_picture_file: null,
    });

    // Fetch employees from API
    const fetchEmployees = async (page = 1, status = 'all') => {
        try {
            setLoading(true);
            const url = `${API_BASE_URL}/all-employees/${page}${status !== 'all' ? `?status=${status}` : ''}`;

            const token = getAccessToken();
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const data = await response.json();

            if (data.status) {
                setEmployees(data.data);
                setTotalPages(data.total_pages);
                setTotalEmployees(data.count);
                setCurrentPage(data.current_page);
            } else {
                throw new Error(data.message || 'Failed to fetch employees');
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch single employee
    const fetchEmployee = async (id) => {
        try {
            const token = getAccessToken();
            const response = await fetch(`${API_BASE_URL}/employee/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employee details');
            }

            const data = await response.json();
            if (data.status) {
                return data.data;
            } else {
                throw new Error(data.message || 'Failed to fetch employee');
            }
        } catch (err) {
            alert(err.message);
            return null;
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchEmployees(currentPage, selectedStatus);
    }, [currentPage, selectedStatus]);

    // Handle refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchEmployees(currentPage, selectedStatus);
        setIsRefreshing(false);
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter employees based on search term
    const filteredEmployees = employees.filter((employee) => {
        const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        return (
            fullName.includes(searchLower) ||
            employee.email.toLowerCase().includes(searchLower) ||
            employee.employee_id.toLowerCase().includes(searchLower) ||
            employee.department?.toLowerCase().includes(searchLower)
        );
    });

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
                return;
            }
            setFormData(prev => ({
                ...prev,
                profile_picture_file: file
            }));
        }
    };

    // Handle phone number validation
    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    // Handle form submission for create
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate phone number
        if (formData.phone && !validatePhone(formData.phone)) {
            alert('Phone number must be exactly 10 digits');
            return;
        }

        setSubmitting(true);

        try {
            const token = getAccessToken();
            
            // Create FormData for file upload
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profile_picture_file' && formData[key]) {
                    submitData.append('profile_picture', formData[key]);
                } else if (key !== 'profile_picture_file' && formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/create-employee/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });

            const data = await response.json();

            if (data.status) {
                setShowAddModal(false);
                resetForm();
                await fetchEmployees(currentPage, selectedStatus);
                alert('Employee created successfully!');
            } else {
                throw new Error(data.message || 'Failed to create employee');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle update employee
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Validate phone number
        if (formData.phone && !validatePhone(formData.phone)) {
            alert('Phone number must be exactly 10 digits');
            return;
        }

        setSubmitting(true);

        try {
            const token = getAccessToken();
            
            // Create FormData for file upload
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profile_picture_file' && formData[key]) {
                    submitData.append('profile_picture', formData[key]);
                } else if (key !== 'profile_picture_file' && formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/update-employee/${selectedEmployee.id}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });

            const data = await response.json();

            if (data.status) {
                setShowEditModal(false);
                resetForm();
                await fetchEmployees(currentPage, selectedStatus);
                alert('Employee updated successfully!');
            } else {
                throw new Error(data.message || 'Failed to update employee');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle delete employee
    const handleDelete = async () => {
        if (!employeeToDelete) return;

        try {
            const token = getAccessToken();
            const response = await fetch(`${API_BASE_URL}/delete-employee/${employeeToDelete.id}/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.status) {
                setShowDeleteModal(false);
                setEmployeeToDelete(null);
                await fetchEmployees(currentPage, selectedStatus);
                alert('Employee deleted successfully!');
            } else {
                throw new Error(data.message || 'Failed to delete employee');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    // Handle view employee
    const handleView = async (id) => {
        const employee = await fetchEmployee(id);
        if (employee) {
            setSelectedEmployee(employee);
            setShowViewModal(true);
        }
    };

    // Handle edit employee
    const handleEdit = async (id) => {
        const employee = await fetchEmployee(id);
        if (employee) {
            setSelectedEmployee(employee);
            setFormData({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                email: employee.email || '',
                phone: employee.phone || '',
                personal_email: employee.personal_email || '',
                date_of_birth: employee.date_of_birth || '',
                gender: employee.gender || '',
                address: employee.address || '',
                city: employee.city || '',
                state: employee.state || '',
                country: employee.country || 'India',
                zip_code: employee.zip_code || '',
                aadhar_number: employee.aadhar_number || '',
                pan_number: employee.pan_number || '',
                votar_id: employee.votar_id || '',
                designation: employee.designation || '',
                department: employee.department || '',
                blood_group: employee.blood_group || '',
                joining_date: employee.joining_date || '',
                employment_type: employee.employment_type || 'full-time',
                status: employee.status || 'active',
                emergency_contact_phone: employee.emergency_contact_phone || '',
                profile_picture: employee.profile_picture || '',
                profile_picture_file: null,
            });
            setShowEditModal(true);
        }
    };

    // Handle delete button click
    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            personal_email: '',
            date_of_birth: '',
            gender: '',
            address: '',
            city: '',
            state: '',
            country: 'India',
            zip_code: '',
            aadhar_number: '',
            pan_number: '',
            votar_id: '',
            designation: '',
            department: '',
            blood_group: '',
            joining_date: '',
            employment_type: 'full-time',
            status: 'active',
            emergency_contact_phone: '',
            profile_picture: '',
            profile_picture_file: null,
        });
        setSelectedEmployee(null);
        setEmployeeToDelete(null);
    };

    // Close modals
    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        resetForm();
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'inactive':
                return 'bg-rose-100 text-rose-700';
            case 'on_leave':
                return 'bg-yellow-100 text-yellow-700';
            case 'terminated':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active':
                return <FiCheckCircle className="w-4 h-4" />;
            case 'inactive':
                return <FiXCircle className="w-4 h-4" />;
            case 'on_leave':
                return <FiClock className="w-4 h-4" />;
            case 'terminated':
                return <FiXCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading && employees.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading employees...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-rose-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Employees</h3>
                    <p className="text-gray-500">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Employees</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Manage all employees in your organization
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                        <FiPlus className="w-4 h-4" />
                        <span>Add Employee</span>
                    </button>
                    <button
                        onClick={handleRefresh}
                        className={`p-2 bg-white rounded-lg shadow-sm border border-gray-200/50 hover:bg-gray-50 transition-colors ${isRefreshing ? 'animate-spin' : ''
                            }`}
                    >
                        <FiRefreshCw className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2 border border-gray-200/50">
                        <FiDownload className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Employees</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{totalEmployees}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FiUsers className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {employees.filter(e => e.status === 'active').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                            <FiCheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">On Leave</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {employees.filter(e => e.status === 'on_leave').length}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <FiClock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Departments</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                {new Set(employees.map(e => e.department).filter(Boolean)).size}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FiBriefcase className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search employees by name, email, ID, or department..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="on_leave">On Leave</option>
                            <option value="terminated">Terminated</option>
                        </select>
                        <button className="px-4 py-2.5 bg-gray-50 border border-gray-200/50 rounded-xl hover:bg-gray-100 transition">
                            <FiFilter className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Department
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0">
                                                    {employee.profile_picture ? (
                                                        <img
                                                            src={employee.profile_picture}
                                                            alt={`${employee.first_name} ${employee.last_name}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                                                            {employee.first_name?.[0]}{employee.last_name?.[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {employee.first_name} {employee.last_name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">EMP ID: {employee.employee_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <FiMail className="w-3 h-3 text-gray-400" />
                                                    {employee.email}
                                                </div>
                                                {employee.phone && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <FiPhone className="w-3 h-3 text-gray-400" />
                                                        {employee.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <FiBriefcase className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">
                                                    {employee.department || 'N/A'}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {employee.designation || 'No designation'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full
                                                ${getStatusBadge(employee.status)}
                                            `}>
                                                {getStatusIcon(employee.status)}
                                                {employee.status?.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <FiCalendar className="w-3 h-3 text-gray-400" />
                                                {formatDate(employee.joining_date)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleView(employee.id)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-400 hover:text-blue-600"
                                                    title="View"
                                                >
                                                    <FiEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(employee.id)}
                                                    className="p-1.5 rounded-lg hover:bg-yellow-50 transition-colors text-gray-400 hover:text-yellow-600"
                                                    title="Edit"
                                                >
                                                    <FiEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(employee)}
                                                    className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-gray-400 hover:text-rose-600"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-12 text-center">
                                        <div className="text-gray-400">
                                            <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-lg font-medium text-gray-600">No employees found</p>
                                            <p className="text-sm mt-1">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200/50">
                        <p className="text-sm text-gray-500">
                            Showing {filteredEmployees.length} of {totalEmployees} employees
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium">
                                {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-200/50 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <EmployeeFormModal
                    title="Add New Employee"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    handleClose={handleCloseModal}
                    submitting={submitting}
                    isEdit={false}
                />
            )}

            {/* Edit Employee Modal */}
            {showEditModal && (
                <EmployeeFormModal
                    title="Edit Employee"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleUpdate}
                    handleClose={handleCloseModal}
                    submitting={submitting}
                    isEdit={true}
                />
            )}

            {/* View Employee Modal */}
            {showViewModal && selectedEmployee && (
                <ViewEmployeeModal
                    employee={selectedEmployee}
                    handleClose={handleCloseModal}
                    formatDate={formatDate}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && employeeToDelete && (
                <DeleteConfirmationModal
                    employee={employeeToDelete}
                    handleDelete={handleDelete}
                    handleClose={handleCloseModal}
                />
            )}
        </div>
    );
}

// Employee Form Modal Component
function EmployeeFormModal({ title, formData, handleInputChange, handleFileChange, handleSubmit, handleClose, submitting, isEdit }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200/50 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiUserPlus className="w-5 h-5 text-blue-600" />
                        {title}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-blue-500" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (10 digits)</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    placeholder="9876543210"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                                <p className="text-xs text-gray-400 mt-1">Enter exactly 10 digits</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                                <input
                                    type="email"
                                    name="personal_email"
                                    value={formData.personal_email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                <input
                                    type="text"
                                    name="blood_group"
                                    value={formData.blood_group}
                                    onChange={handleInputChange}
                                    placeholder="e.g., A+, B-"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FiMapPin className="w-4 h-4 text-green-500" />
                            Address Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                                <input
                                    type="text"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Identification Documents */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FiCreditCard className="w-4 h-4 text-purple-500" />
                            Identification Documents
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                                <input
                                    type="text"
                                    name="aadhar_number"
                                    value={formData.aadhar_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                                <input
                                    type="text"
                                    name="pan_number"
                                    value={formData.pan_number}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label>
                                <input
                                    type="text"
                                    name="votar_id"
                                    value={formData.votar_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                                <input
                                    type="text"
                                    name="emergency_contact_phone"
                                    value={formData.emergency_contact_phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <FiBriefcase className="w-4 h-4 text-orange-500" />
                            Employment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={formData.designation}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                                <input
                                    type="date"
                                    name="joining_date"
                                    value={formData.joining_date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                <select
                                    name="employment_type"
                                    value={formData.employment_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="intern">Intern</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="on_leave">On Leave</option>
                                    <option value="terminated">Terminated</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                <input
                                    type="file"
                                    name="profile_picture"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {isEdit && formData.profile_picture && (
                                    <p className="text-xs text-gray-400 mt-1">Current: {formData.profile_picture.split('/').pop()}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/50">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    {isEdit ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <FiUserPlus className="w-4 h-4" />
                                    {isEdit ? 'Update Employee' : 'Create Employee'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// View Employee Modal Component
function ViewEmployeeModal({ employee, handleClose, formatDate }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200/50 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiUser className="w-5 h-5 text-blue-600" />
                        Employee Details
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0">
                            {employee.profile_picture ? (
                                <img
                                    src={employee.profile_picture}
                                    alt={`${employee.first_name} ${employee.last_name}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-medium">
                                    {employee.first_name?.[0]}{employee.last_name?.[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                {employee.first_name} {employee.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">EMP ID: {employee.employee_id}</p>
                            <span className={`
                                inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full mt-1
                                ${getStatusBadge(employee.status)}
                            `}>
                                {employee.status?.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-gray-800">{employee.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Phone</p>
                            <p className="text-gray-800">{employee.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Department</p>
                            <p className="text-gray-800">{employee.department || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Designation</p>
                            <p className="text-gray-800">{employee.designation || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Employment Type</p>
                            <p className="text-gray-800">{employee.employment_type?.replace('_', ' ').toUpperCase() || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Joining Date</p>
                            <p className="text-gray-800">{formatDate(employee.joining_date)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                            <p className="text-gray-800">{formatDate(employee.date_of_birth)}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gender</p>
                            <p className="text-gray-800">{employee.gender?.toUpperCase() || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Address */}
                    {(employee.address || employee.city || employee.state || employee.country) && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Address</h4>
                            <p className="text-gray-800">
                                {employee.address && `${employee.address}, `}
                                {employee.city && `${employee.city}, `}
                                {employee.state && `${employee.state}, `}
                                {employee.country && `${employee.country}`}
                                {employee.zip_code && ` - ${employee.zip_code}`}
                            </p>
                        </div>
                    )}

                    {/* Documents */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Identification Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {employee.aadhar_number && (
                                <p className="text-sm text-gray-700"><span className="font-medium">Aadhar:</span> {employee.aadhar_number}</p>
                            )}
                            {employee.pan_number && (
                                <p className="text-sm text-gray-700"><span className="font-medium">PAN:</span> {employee.pan_number}</p>
                            )}
                            {employee.votar_id && (
                                <p className="text-sm text-gray-700"><span className="font-medium">Voter ID:</span> {employee.votar_id}</p>
                            )}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200/50">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Delete Confirmation Modal
function DeleteConfirmationModal({ employee, handleDelete, handleClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="p-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                            <FiAlertCircle className="w-8 h-8 text-rose-600" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Employee</h3>
                    <p className="text-gray-500 text-center mb-6">
                        Are you sure you want to delete <span className="font-semibold text-gray-700">{employee.first_name} {employee.last_name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                        >
                            <FiTrash2 className="w-4 h-4" />
                            Delete Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function for status badge
function getStatusBadge(status) {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-700';
        case 'inactive':
            return 'bg-rose-100 text-rose-700';
        case 'on_leave':
            return 'bg-yellow-100 text-yellow-700';
        case 'terminated':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}