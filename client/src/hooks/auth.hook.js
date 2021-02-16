import {useState, useCallback, useEffect} from 'react';
import {useHttp} from './http.hook';

const storageName = 'userData';

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const {request} = useHttp()

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);

    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
  }, []);


  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  const checkToken = useCallback(async (tok) => {
    try {
      await request('/api/auth/checking', 'POST', {'ant': 'asd'}, {
        Authorization: `Bearer ${tok}`
      });
    } catch (e) {
      logout();
    } }, [request, logout])
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      checkToken(data.token);
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login, checkToken]);


  return { login, logout, token, userId, ready };
};