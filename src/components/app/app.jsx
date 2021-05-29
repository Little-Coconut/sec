import React , { useState, useEffect, useRef } from 'react';
import  './app.scss';
import {
   Observable, Observer, fromEvent, of, from,
   timer, interval,
   range, throwError, combineLatest, zip,
   forkJoin
} from 'rxjs';

const App = () => {
 
   const [seconds, setSeconds] = useState(0);

   
   const [subscription, setSubscription] = useState(null);
   const [checkMin, setCheckMin] = useState(null);
   const [checkHours, setCheckHours] = useState(null);



   const runTimer = () => {
      if (!subscription) {
         let timer = seconds;
         setSubscription(interval(1000)
         .subscribe(() => setSeconds(timer++)));
      }
   };

   const Wait = () => {

   }
   const Stop = () => {

   }

   const getMin = (tick) => {
      if ((tick % 60) === 0 ) {
        return (tick / 60) >= 60 ? 0 : tick % 60;
      } else {
        const minCount = ((tick - (tick % 60)) / 60);
        return minCount < (60 - 1) ? minCount : minCount % 60;
      }
    }
  
    const getSeckonds = (tick) => {
      return (tick % 60) === 0 ? 0 : tick % 60;
    }
  
    const getHour = (tick) => {
      return (tick % 3600) === 0 ? tick / 3600 : (tick - (tick % 3600)) / 3600;
    }
  
    const formatValue = (value) => {
      return value.toString().length === 1 ? `0${value}`: value.toString() ;
    };
   
      const renderTime = (tick) => {
         const hours = formatValue(getHour(tick));
         const minutes = formatValue(getMin(tick));
         const seconds = formatValue(getSeckonds(tick));
      };

   return (
      <div className="mainBlock">
         <span>{hours}:</span>
         <span>{minutes}:</span>
         <span>{seconds}</span>
         <br/>
         <br/>
         <button onClick={runTimer}> Start</button>
         <button onClick={Wait}> Wait</button>
         <button onClick={Stop}> Stop</button>
      </div>
   )
}
export default App;