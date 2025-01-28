import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    Fragment,
  } from "react";
  import moment from "moment";
  import { useNavigate } from 'react-router-dom';
  
const SessionTimeout = () => {
    const [events, setEvents] = useState(['click', 'load', 'scroll']);
    const [second, setSecond] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    const loggedInUser = sessionStorage.getItem("userInfo");
    const loggedInToken = sessionStorage.getItem("storedToken");

    let timeStamp;
    let warningInactiveInterval = useRef();
    let startTimerInterval = useRef();

    setInterval(() => {
        if(loggedInUser && loggedInToken) {
            setIsAuthenticated(true);
        }
    }, 50);

    useEffect(() => {
        if (isAuthenticated) {
            timeStamp = moment().format("DD MM YYYY hh:mm:ss");
            sessionStorage.setItem('lastTimeStamp', timeStamp);
        } else {
            clearInterval(warningInactiveInterval.current);
            sessionStorage.removeItem('lastTimeStamp');
        }
    }, [isAuthenticated]);

    // start inactive check
    let timeChecker = () => {
        startTimerInterval.current = setTimeout(() => {
            let storedTimeStamp = sessionStorage.getItem("lastTimeStamp");
            warningInactive(storedTimeStamp);
        }, 300000);
    };

    // timer
    let warningInactive = (timeString) => {
        clearTimeout(startTimerInterval.current);
    
        warningInactiveInterval.current = setInterval(() => {
        const maxTime = 10; // Maximum ideal time given before logout
        const popTime = 5; // remaining time (notification) left to logout.
        const now = moment();
        const diff = moment.duration(moment(now, "DD MM YYYY hh:mm:ss").diff(moment(timeString, "DD MM YYYY hh:mm:ss")));
        const minPast = diff.minutes();
        const leftSecond = 60 - diff.seconds();
    
        if (minPast === popTime) {
            setSecond(leftSecond);
        }
    
        if (minPast === maxTime) {
            clearInterval(warningInactiveInterval.current);
            sessionStorage.removeItem("lastTimeStamp");
            // logout function 
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('storedToken');  
            navigate('/login');
            window.location.reload();
        }
        }, 1000);
    };

    // reset interval timer
    let resetTimer = useCallback(() => {
        clearTimeout(startTimerInterval.current);
        clearInterval(warningInactiveInterval.current);

        if (isAuthenticated) {
            timeStamp = moment().format("DD MM YYYY hh:mm:ss");
            sessionStorage.setItem('lastTimeStamp', timeStamp);
        } else {
            clearInterval(warningInactiveInterval.current);
            sessionStorage.removeItem('lastTimeStamp');
        }

        timeChecker();
    }, [isAuthenticated]);

    // Life cycle hook
    useEffect(() => {
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });
        timeChecker();
        return () => {
            clearTimeout(startTimerInterval.current);
        };
    }, [resetTimer, events, timeChecker]);
    return <Fragment />;
};

export default SessionTimeout;