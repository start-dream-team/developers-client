import React, {useState} from 'react';
import Popup from './PopUp';
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator
} from "@devexpress/dx-react-scheduler-material-ui";
import { ViewState } from '@devexpress/dx-react-scheduler';
import axios from 'axios';

interface CalendarPopupProps {
  events: any[];
  handleClose: () => void;
}

let memberId = 2;
let memberName = "멘토2";

const CalendarPopup: React.FC<CalendarPopupProps> = ({ events, handleClose }) => {  
  const [currentDate, setCurrentDate ] = useState(new Date()); // 시간 변수를 상태값으로 두어 변경 가능
  
  const currentDateChange = (newDate:Date) => {
    setCurrentDate(newDate);
  }

  const CustomAppointment = (props: any) => {
    const handleEventClick = () => {
      if(props.data.mentorName === memberName){
        alert("자신의 방에는 신청할 수 없습니다");
        handleClose();
      }else{
        if (window.confirm('해당 시간에 신청하시겠습니까?')) {
          const url = `http://localhost:9002/api/register`
          axios.post(url,{
            scheduleId:props.data.scheduleId,
            menteeId:memberId
          })
          .then(res=>{
            if(res.status === 200){
              alert("신청이 완료되었습니다");
              handleClose();
            }
          })
          .catch(err=>console.log(err));
        }
      }
    };
  
    return (
      <Appointments.Appointment {...props} onClick={handleEventClick} />
    );
  };

  return (
    <Popup>
      <div className="calendarPopup">
        <Scheduler data={events} height={700}>
          <ViewState currentDate={currentDate} onCurrentDateChange={currentDateChange} />
          <WeekView startDayHour={9} endDayHour={22} cellDuration={60} /> {/* 한 시간 간격으로 변경 */}
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments appointmentComponent={CustomAppointment} />
        </Scheduler>
        <button className="bg-blue-200 hover:bg-blue-300 px-3 py-2 mr-3 rounded" onClick={handleClose}>닫기</button>
      </div>
    </Popup>
  );
};

export default CalendarPopup;
