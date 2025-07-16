import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const useRoleRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case 'stagiaire':
        navigate('/etudiant');
        break;
      case 'encadreur':
        navigate('/encadreur');
        break;
      case 'rh':
        navigate('/rh');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/login');
    }
  }, [user, navigate]);
};

export default useRoleRedirect;
