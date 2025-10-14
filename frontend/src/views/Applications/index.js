import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { getApplications } from 'services/applications';
import { listOrganizations } from 'services/organizations';
import ApplicationCard from './components/ApplicationCard';
import AddApplicationDialog from './components/AddApplicationDialog';
import styles from './style.module.scss';

const Applications = () => {
  const history = useHistory();
  const [applications, setApplications] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [appsResponse, orgsResponse] = await Promise.all([
        getApplications(),
        listOrganizations()
      ]);

      if (!appsResponse.isError) {
        setApplications(appsResponse.data || []);
      } else {
        setError(appsResponse.message);
      }

      if (!orgsResponse.isError) {
        setOrganizations(orgsResponse.data || []);
      } else {
        setError(orgsResponse.message);
      }
    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationClick = (application) => {
    history.push(`/applications/${application.name}`);
  };

  const handleAddApplication = () => {
    setOpenAddDialog(true);
  };

  const handleAddApplicationSuccess = () => {
    setOpenAddDialog(false);
    fetchData(); // Refresh the list
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.applications}>
      <div className={styles.applications__header}>
        <h1>Applications</h1>
        <div className="form__action__buttons">
          <Button
            icon={<AddIcon />}
            onClick={handleAddApplication}
          >
            Add Application
          </Button>
        </div>
      </div>

      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      <div className={styles.applications__content}>
        {applications.length === 0 ? (
          <div className={styles.applications__empty}>
            <h3>No applications found</h3>
            <p>Create your first application to get started</p>
            <Button
              icon={<AddIcon />}
              onClick={handleAddApplication}
            >
              Add Application
            </Button>
          </div>
        ) : (
          <div className={styles.applications__grid}>
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onClick={() => handleApplicationClick(application)}
              />
            ))}
          </div>
        )}
      </div>

      <AddApplicationDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={handleAddApplicationSuccess}
        organizations={organizations}
      />
    </div>
  );
};

export default Applications;
