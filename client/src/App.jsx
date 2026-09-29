import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import BoardView from './components/BoardView';
import TableView from './components/TableView';
import TimelineView from './components/TimelineView';
import ApplicationModal from './components/ApplicationModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { 
  fetchApplications, 
  fetchStats, 
  createApplication, 
  updateApplication, 
  updateApplicationStatus, 
  deleteApplication 
} from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [modalInitialStatus, setModalInitialStatus] = useState('Bookmarked');
  const [deleteModalApp, setDeleteModalApp] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load applications and stats
  const loadData = useCallback(async (query = searchQuery) => {
    try {
      setLoading(true);
      const [appsData, statsData] = await Promise.all([
        fetchApplications({ search: query }),
        fetchStats()
      ]);
      setApplications(appsData.data || []);
      setStats(statsData.stats || null);
    } catch (err) {
      showToast(err.message || 'Failed to connect to backend API', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, loadData]);

  // Status Change (Optimistic UI update)
  const handleUpdateStatus = async (id, newStatus) => {
    const previous = [...applications];
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );

    try {
      await updateApplicationStatus(id, newStatus);
      showToast(`Moved to ${newStatus}`);
      const statsData = await fetchStats();
      setStats(statsData.stats);
    } catch (err) {
      setApplications(previous);
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Save (Create or Update)
  const handleSaveApplication = async (formData) => {
    if (modalInitialData) {
      await updateApplication(modalInitialData.id, formData);
      showToast('Application updated successfully');
    } else {
      await createApplication(formData);
      showToast('Application created successfully');
    }
    await loadData();
  };

  // Delete
  const handleDeleteApplication = async (id) => {
    try {
      await deleteApplication(id);
      showToast('Application deleted');
      setDeleteModalApp(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete application', 'error');
    }
  };

  const handleOpenCreateWithStatus = (status = 'Bookmarked') => {
    setModalInitialData(null);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleEditApplication = (app) => {
    setModalInitialData(app);
    setIsModalOpen(true);
  };

  const handleSelectApplicationFromStats = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (app) {
      handleEditApplication(app);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${
          toast.type === 'error'
            ? 'bg-red-950/90 border-red-800 text-red-200'
            : 'bg-zinc-900/95 border-zinc-700 text-zinc-200'
        }`}>
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenCreateModal={() => handleOpenCreateWithStatus('Bookmarked')}
        totalCount={applications.length}
      />

      {/* Header Statistics & Salary Insights */}
      <StatsOverview 
        stats={stats} 
        onSelectApplication={handleSelectApplicationFromStats} 
      />

      {/* Main Views Container */}
      <main className="flex-1 pb-16">
        {loading && applications.length === 0 ? (
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-zinc-400 font-mono">Loading applications...</p>
          </div>
        ) : (
          <>
            {currentView === 'board' && (
              <BoardView
                applications={applications}
                onEditApplication={handleEditApplication}
                onDeleteApplication={setDeleteModalApp}
                onUpdateStatus={handleUpdateStatus}
                onOpenCreateWithStatus={handleOpenCreateWithStatus}
              />
            )}

            {currentView === 'table' && (
              <TableView
                applications={applications}
                onEditApplication={handleEditApplication}
                onDeleteApplication={setDeleteModalApp}
                onUpdateStatus={handleUpdateStatus}
                selectedStatusFilter={selectedStatusFilter}
                setSelectedStatusFilter={setSelectedStatusFilter}
              />
            )}

            {currentView === 'timeline' && (
              <TimelineView
                applications={applications}
                onEditApplication={handleEditApplication}
              />
            )}
          </>
        )}
      </main>

      {/* Create / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApplication}
        initialData={modalInitialData}
        initialStatus={modalInitialStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteModalApp}
        onClose={() => setDeleteModalApp(null)}
        onConfirm={handleDeleteApplication}
        application={deleteModalApp}
      />

    </div>
  );
}
