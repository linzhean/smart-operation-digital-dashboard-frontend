// import React, { useEffect, useState } from 'react';
// import styles from './PersonalData.module.css';
// import { useUserContext } from '../../context/UserContext';
// import { fetchUserData, updateUserData } from '../../services/Pdata';
// import { fetchDropdownData } from '../../services/dropdownServices';
// import { UpdateUserData } from '../../services/types/userManagement';
// import { useNavigate } from 'react-router-dom';

// interface DropdownOption {
//   value: string;
//   label: string;
// }

// const Pdata: React.FC = () => {
//   const { state, dispatch } = useUserContext();
//   const navigate = useNavigate();
//   const [initialData, setInitialData] = useState<UpdateUserData | null>(null);
//   const [departments, setDepartments] = useState<DropdownOption[]>([]);
//   const [identities, setIdentities] = useState<DropdownOption[]>([]);

//   useEffect(() => {
//     const loadUserData = async () => {
//       dispatch({ type: 'SET_LOADING', payload: true });
//       try {
//         const userData = await fetchUserData();
//         dispatch({ type: 'SET_FORM_DATA', payload: userData });
//         setInitialData(userData);
//       } catch (error) {
//         console.error('載入用戶數據時出錯:', error);
//       } finally {
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     };

//     const loadDropdownData = async () => {
//       try {
//         const departmentData = await fetchDropdownData('department');
//         setDepartments(departmentData);

//         const identityData = await fetchDropdownData('identity');
//         setIdentities(identityData);
//       } catch (error) {
//         console.error('加載下拉選項時出錯:', error);
//       }
//     };

//     loadUserData();
//     loadDropdownData();
//   }, [dispatch]);

//   const handleEditClick = () => {
//     dispatch({ type: 'SET_EDITABLE', payload: !state.editable });
//   };

//   const handleInputChange = (id: string, value: string) => {
//     if (id === 'departmentName') {
//       const selectedDepartment = departments.find(dept => dept.value === value);
//       if (selectedDepartment) {
//         dispatch({ type: 'UPDATE_FORM_DATA', payload: { id: 'departmentId', value: selectedDepartment.value } });
//       }
//     }
//     dispatch({ type: 'UPDATE_FORM_DATA', payload: { id, value } });
//   };

//   const handleSaveClick = async () => {
//     if (!state.formData.departmentId) {
//       alert('請選擇您所屬部門！');
//       return;
//     }

//     dispatch({ type: 'SET_LOADING', payload: true });
//     try {
//       await updateUserData(state.formData as UpdateUserData);
//       dispatch({ type: 'SET_EDITABLE', payload: false });
//       alert('您的資料更新成功！');
//     } catch (error) {
//       console.error('更新資料錯誤:', error);
//       alert('無法更新資料，請重新嘗試');
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

//   const handleLogoutClick = () => {
//     localStorage.removeItem('authToken');
//     dispatch({ type: 'CLEAR_USER' });
//     navigate('/login');
//   };

//   return (
//     <main className={styles.section}>
//       <div className={styles.container}>
//         <form className={`needs-validation ${styles.profileSide}`} noValidate>
//           <div className={styles.legendContainer}>
//             <legend className={styles.legend}>您的個人資料</legend>
//             <div className={styles.theButtonGroup}>
//               <div className={styles.theEditButton}>
//                 <button
//                   type="button"
//                   className={`btn ${styles.btn}`}
//                   onClick={state.editable ? handleSaveClick : handleEditClick}
//                 >
//                   {state.editable ? '保存變更' : '修改資料'}
//                 </button>
//               </div>
//               {!state.editable && (
//                 <div className={styles.logoutContainer}>
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     onClick={handleLogoutClick}
//                   >
//                     <span className={styles.letter}>登出</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               <label htmlFor="userName" className={styles.formLabel}>
//                 姓名
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="userName"
//                 value={state.formData.userName}
//                 required
//                 disabled={!state.editable}
//                 onChange={(e) => handleInputChange(e.target.id, e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               <label htmlFor="userId" className={styles.formLabel}>
//                 員工編號
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="jobNumber"
//                 value={state.formData.jobNumber}
//                 required
//                 disabled={!state.editable}
//                 onChange={(e) => handleInputChange(e.target.id, e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               <label htmlFor="gmail" className={styles.formLabel}>
//                 信箱 (Gmail)
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="gmail"
//                 value={state.formData.gmail}
//                 required
//                 disabled={!state.editable}
//                 onChange={(e) => handleInputChange(e.target.id, e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               <label htmlFor="departmentName" className={styles.formLabel}>
//                 所屬部門
//               </label>
//               <select
//                 className="form-control"
//                 id="departmentName"
//                 value={state.formData.departmentName}
//                 disabled={!state.editable}
//                 onChange={(e) => handleInputChange(e.target.id, e.target.value)}
//               >
//                 {departments.map((department) => (
//                   <option key={department.value} value={department.value}>
//                     {department.label}
//                   </option>
//                 ))}
//               </select>

//             </div>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               <label htmlFor="position" className={styles.formLabel}>
//                 職位
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="position"
//                 value={state.formData.position}
//                 required
//                 disabled={!state.editable}
//                 onChange={(e) => handleInputChange(e.target.id, e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-12">
//               <label htmlFor="identity" className={styles.formLabel}>
//                 身份
//               </label>
//               <select
//                 className="form-control"
//                 id="identity"
//                 value={state.formData.identity}
//                 disabled={!state.editable}
//                 onChange={(e) => handleInputChange(e.target.id, e.target.value)}
//               >
//                 {identities.map((identity) => (
//                   <option key={identity.value} value={identity.value}>
//                     {identity.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// };


// export default Pdata;


import React, { useEffect, useState } from 'react';
import styles from './PersonalData.module.css';
import { useUserContext } from '../../context/UserContext';
import { fetchUserData, updateUserData } from '../../services/Pdata';
import { fetchDropdownData } from '../../services/dropdownServices';
import { UpdateUserData } from '../../services/types/userManagement';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DropdownOption {
  value: string;
  label: string;
}

const Pdata: React.FC = () => {
  const { state, dispatch } = useUserContext();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<UpdateUserData | null>(null);
  const [departments, setDepartments] = useState<DropdownOption[]>([]);
  const [identities, setIdentities] = useState<DropdownOption[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadUserData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const userData = await fetchUserData();
        dispatch({ type: 'SET_FORM_DATA', payload: userData });
        setInitialData(userData);
      } catch (error) {
        console.error('載入用戶數據時出錯:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    const loadDropdownData = async () => {
      try {
        const departmentData = await fetchDropdownData('department');
        setDepartments(departmentData);

        const identityData = await fetchDropdownData('identity');
        setIdentities(identityData);
      } catch (error) {
        console.error('加載下拉選項時出錯:', error);
      }
    };

    loadUserData();
    loadDropdownData();
  }, [dispatch]);

  const handleEditClick = () => {
    dispatch({ type: 'SET_EDITABLE', payload: !state.editable });
  };

  const handleInputChange = (id: string, value: string) => {
    if (id === 'departmentName') {
      const selectedDepartment = departments.find(dept => dept.value === value);
      if (selectedDepartment) {
        dispatch({ type: 'UPDATE_FORM_DATA', payload: { id: 'departmentId', value: selectedDepartment.value } });
      }
    }
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { id, value } });
  };

  const handleSaveClick = async () => {
    if (!state.formData.departmentId) {
      setSnackbarMessage('請選擇您所屬部門！');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await updateUserData(state.formData as UpdateUserData);
      dispatch({ type: 'SET_EDITABLE', payload: false });
      setSnackbarMessage('您的資料更新成功！');
      setSnackbarSeverity('success');
    } catch (error) {
      console.error('更新資料錯誤:', error);
      setSnackbarMessage('無法更新資料，請重新嘗試');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'CLEAR_USER' });
    navigate('/login');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <main className={styles.section}>
      <div className={styles.container}>
        <form className={`needs-validation ${styles.profileSide}`} noValidate>
          <div className={styles.legendContainer}>
            <legend className={styles.legend}>您的個人資料</legend>
            <div className={styles.theButtonGroup}>
              <div className={styles.theEditButton}>
                <button
                  type="button"
                  className={`btn ${styles.btn}`}
                  onClick={state.editable ? handleSaveClick : handleEditClick}
                >
                  {state.editable ? '保存變更' : '修改資料'}
                </button>
              </div>
              {!state.editable && (
                <div className={styles.logoutContainer}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleLogoutClick}
                  >
                    <span className={styles.letter}>登出</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="userName" className={styles.formLabel}>
                姓名
              </label>
              <input
                type="text"
                className="form-control"
                id="userName"
                value={state.formData.userName}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="userId" className={styles.formLabel}>
                員工編號
              </label>
              <input
                type="text"
                className="form-control"
                id="jobNumber"
                value={state.formData.jobNumber}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="gmail" className={styles.formLabel}>
                信箱 (Gmail)
              </label>
              <input
                type="text"
                className="form-control"
                id="gmail"
                value={state.formData.gmail}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="departmentName" className={styles.formLabel}>
                所屬部門
              </label>
              <select
                className="form-control"
                id="departmentName"
                value={state.formData.departmentName}
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              >
                {departments.map((department) => (
                  <option key={department.value} value={department.value}>
                    {department.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="position" className={styles.formLabel}>
                職位
              </label>
              <input
                type="text"
                className="form-control"
                id="position"
                value={state.formData.position}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="identity" className={styles.formLabel}>
                身份
              </label>
              <select
                className="form-control"
                id="identity"
                value={state.formData.identity}
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              >
                {identities.map((identity) => (
                  <option key={identity.value} value={identity.value}>
                    {identity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"

          sx={{
            width: '400px',
            backgroundColor: snackbarSeverity === 'error' ? '#F5F5F5' : '#DFF0D8',
            color: '#000000',
            padding: '16px',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleSnackbarClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'black' }}
          >
            <CloseIcon />
          </IconButton>
          <div style={{ fontSize: '1.2rem' }}>{snackbarMessage}</div>
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Pdata;

