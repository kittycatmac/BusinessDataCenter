import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Paper, CircularProgress, Box } from '@mui/material';
import jwt from 'jwt-decode';

import '../Styles/Login.css';

const Login = ({ setUser, updateUserLevel }) => {
  const [password, setPassword] = useState('');
  const [UserName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  let spinner;

  if(loading) {
    spinner = <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !UserName) return;
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          UserName: UserName,
          Password: password
      }),
    }
    fetch(process.env.REACT_APP_HDC_APIURL + "/Auth/Authorize", requestOptions)
      .then((res) => {
        //console.log(res.status);
        if(res.status == 200) {
          fetch(process.env.REACT_APP_HDC_APIURL +"/Auth/GetTokenSession")
          .then((response) => response.text())
          .then((data) => {
            var storageToken = JSON.stringify({
              Token: data
            })
            // sets user token in session storage
            sessionStorage.setItem('storedToken', storageToken);
            const userInfo = jwt(data); // decode your token here
            // sets user info in session storage
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            // sets user in object
            setUser({ UserName: userInfo.username, DisplayName: userInfo.DisplayName });
            // sets department for user levels in UserProvider.jsx
            updateUserLevel(userInfo.department);
          });
          setLoading(false);
          navigate('/');
        } else {
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('storedToken');  
          setPassword('');
          setUserName('');
          alert("Incorrect UserId or Password!");
          window.location.reload();
        }
      });
  };


  if(loading) {
    return (
      <section className='section'>
        <div className='row login-ghost-row'>
        </div>
          <div style={{'textAlign': 'center'}}>
            <div style={{'display': 'inline-block'}}>
              { spinner }
            </div>
          </div>
      </section>
    )
  } else {
    return (
      <section className='section'>
          <div className='row login-ghost-row'></div>
          <div style={{'textAlign': 'center'}}>
              <div style={{'display': 'inline-block'}}>
                  <form className='form' onSubmit={handleSubmit}>
                    <Paper className="Paper" elevation={5}>
                    <div className='form-row pb-4'>
                      <label htmlFor='UserName' className='form-label pr-2'>                       
                      </label>
                      <Input 
                        required
                        autoComplete='false'
                        id='UserName'
                        name='UserName'
                        value={UserName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder='User Name'
                      />
                    </div>
                    <div className='form-row pb-4'>
                      <label htmlFor='Password' className='form-label pr-2'>                       
                      </label>
                      <Input 
                        required
                        type="Password" 
                        id='Password'
                        name='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                      />
                    </div>
                    <Button variant="outlined" type="submit">Login</Button>
                    </Paper>
                  </form>
              </div>
          </div>
      </section>
    );
  };
};
export default Login;