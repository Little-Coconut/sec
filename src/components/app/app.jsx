import { useEffect, useState, useRef } from 'react';
import { fromEvent, interval, timer } from 'rxjs';
import { timeInterval } from 'rxjs/operators';

import { TimerStatuses } from '../../constans/timer-statuses';
import './app.scss';


function App() {
 
   const [tickCounter, updateTick] = useState(0);

   const tickCounterRef = useRef(tickCounter);
   
   const [timerSubscription, updateTimerSubscription] = useState(null);
  
   const [timerStatus, updateTimerStatus] = useState(TimerStatuses.stop);
  
   const waitBtnEl = useRef(null);
  
   const timerSubscriptionRef = useRef(timerSubscription);
 
      useEffect(() => tickCounterRef.current = tickCounter, [tickCounter]);
 
      useEffect(() => {
       timerSubscriptionRef.current = timerSubscription
     }, [timerSubscription]);
   
      useEffect(() => {
       const waitBtnClickListener = fromEvent(waitBtnEl.current, 'click')
         .pipe(timeInterval())
         .subscribe(click => {
           if (click.interval < 300) {
             wait();
           }
         });
         return () => {
           if (waitBtnClickListener) {
             waitBtnClickListener.unsubscribe();
           }
   
           if (timerSubscription) {
             timerSubscription.unsubscribe();
           }
         }
     }, []);
   
 
   const runTimer = () => {
     let innerCounter = tickCounterRef.current; 
     updateTimerSubscription(interval(1000).subscribe(() => updateTick(innerCounter++)));
     updateTimerStatus(TimerStatuses.start); 
   }
 
   const stopTimer = () => {
     updateTimerSubscription(timerSubscriptionRef.current.unsubscribe());
     updateTimerStatus(TimerStatuses.stop); 
   }
 
   const wait = () => {
     stopTimer(); 
     const waitSubsctiption = timer(2000)
       .subscribe(() => {
         runTimer();
         waitSubsctiption.unsubscribe();
       })
   }
 
   const resetTimer = () => {
     updateTick(0);
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
   }
  
   const renderTime = (tick) => {
     const hour = formatValue(getHour(tick));
     const min = formatValue(getMin(tick));
     const seconds = formatValue(getSeckonds(tick));
 
     return (
       <div className="content centering">
         <span className="time-el">{hour}</span>
         <span className="time-divider"> : </span>
         <span className="time-el">{min}</span>
         <span className="time-divider"> : </span>
         <span className="time-el">{seconds}</span>
       </div>
     );
   }
 
   return (
     <div className="timer">
       {renderTime(tickCounter)}
       <div className="divider centering"></div>
       <div className="actions centering">
           <button onClick={timerSubscription  ? stopTimer : runTimer}>{timerSubscription ? 'Stop' : 'Start'}</button>
           <button ref={waitBtnEl} disabled={!timerSubscription && TimerStatuses.wait !== timerStatus}>Wait</button>
           <button onClick={resetTimer} disabled={!timerSubscription}>Reset</button>
       </div>
     </div>
   );
 }
 
 export default App;
 