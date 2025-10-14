import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Alert } from '@material-ui/lab';
import { Button } from 'components/Button';
import Loader from 'components/Loader';
import { getApplications } from 'services/applications';
import EnvironmentCard from '../components/EnvironmentCard';
import styles from './style.module.scss';

const ApplicationDetails = () => {
  const { applicationName } = useParams();
  const history = useHistory();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicationDetails();
  }, [applicationName]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getApplications();
      
      if (!response.isError) {
        const apps = response.data || [];
        const foundApp = apps.find(app => app.name === applicationName);
        
        if (foundApp) {
          setApplication(foundApp);
        } else {
          setError('Application not found');
        }
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnvironmentClick = (environment) => {
    history.push(`/applications/${applicationName}/environments/${environment.name}`);
  };

  const handleBackClick = () => {
    history.push('/applications');
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.applicationDetails}>
        <div className={styles.applicationDetails__header}>
          <Button onClick={handleBackClick} variant="outlined">
            ← Back to Applications
          </Button>
        </div>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={styles.applicationDetails}>
        <div className={styles.applicationDetails__header}>
          <Button onClick={handleBackClick} variant="outlined">
            ← Back to Applications
          </Button>
        </div>
        <Alert severity="error">Application not found</Alert>
      </div>
    );
  }

  const environments = application.environmentTagMappings?.map(mapping => mapping.environment) || [];
  const uniqueEnvironments = environments.filter((env, index, self) => 
    index === self.findIndex(e => e.id === env.id)
  );

  return (
    <div className={styles.applicationDetails}>
      <div className={styles.applicationDetails__header}>
        <Button onClick={handleBackClick} variant="outlined">
          ← Back to Applications
        </Button>
        <h1>{application.name}</h1>
      </div>

      <div className={styles.applicationDetails__content}>
        <div className={styles.applicationDetails__info}>
          <div className={styles.applicationDetails__infoItem}>
            <strong>Organization:</strong> {application.organisation?.name}
          </div>
          <div className={styles.applicationDetails__infoItem}>
            <strong>Environments:</strong> {uniqueEnvironments.length}
          </div>
          <div className={styles.applicationDetails__infoItem}>
            <strong>Created:</strong> {new Date(application.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className={styles.applicationDetails__environments}>
          <h2>Environments</h2>
          {uniqueEnvironments.length === 0 ? (
            <div className={styles.applicationDetails__empty}>
              <p>No environments attached to this application</p>
            </div>
          ) : (
            <div className={styles.applicationDetails__grid}>
              {uniqueEnvironments.map((environment) => (
                <EnvironmentCard
                  key={environment.id}
                  environment={environment}
                  applicationName={applicationName}
                  onClick={() => handleEnvironmentClick(environment)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
