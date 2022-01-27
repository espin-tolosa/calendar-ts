import React, { useState, useEffect, useRef } from "react";
import Month from "../../components/Month";
import styled from "styled-components";
import StatusBar from "../../components/StatusBar";
//import { StatusBarContextProvider } from "../../context/StatusBarContext";
import { StartDateContextProvider } from "../../context/StartDateContext";
import { EventFormContextProvider } from "../../context/FormFieldsContext";
import { DateService } from "../../services/Date";

const StyledCalendarSheets = styled.div`
  display: flex;
  flex-direction: column;
`;

//TODO: setIsLogged
export default function Calendar(props) {
  const month_entry_0 = DateService.GetDateNextMonth();
  const month_entry_1 = DateService.GetDateNextMonth(month_entry_0);
  const month_entry_2 = DateService.GetDateNextMonth(month_entry_1);

  const addedNewMonth = useRef(false);

  const [monthKeys, setMonthKeys] = useState([
    month_entry_0,
    month_entry_1,
    month_entry_2,
  ]);

  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const onChange = (entries) => {
      if (entries[0].isIntersecting) {
        setIsBottom((prev) => {
          return !prev;
        });
      }
    };
    const observer = new IntersectionObserver(onChange, {
      rootMargin: "100px",
    });

    observer.observe(document.getElementById("BottomEdge"));
  }, []);

  useEffect(() => {
    if (isBottom) {
      const month_entry = DateService.GetDateNextMonth(
        monthKeys[monthKeys.length - 1]
      );

      setMonthKeys([...monthKeys, month_entry]);

      setIsBottom((prev) => {
        return !prev;
      });
    }
  }, [isBottom]);

  return (
    <>
      <StartDateContextProvider>
        <StatusBar setIsLogged={props.setIsLogged} />
        <StyledCalendarSheets>
          {monthKeys.map((month_entry, index) => {
            return (
              <Month
                key={index}
                year={month_entry.year}
                month={month_entry.month}
              />
            );
          })}
          <div id="BottomEdge"></div>
        </StyledCalendarSheets>
      </StartDateContextProvider>
    </>
  );
}

//	Component prepared with Media Queries, just in case of need

//const StyledCalendarSheets = style.div`
//
//	display: flex;
//
//	flex-direction: column ;
//
//	@media ${device.portrait}{
//		flex-direction: column ;
//	}
//
//	@media ${device.landscape}{
//	 flex-direction: column ;
// 	}
//
//`;

// Media Queries Ranges for Mobilde Devices

//const size = {
//  xs: "320px",
//  sm: "768px",
//  lg: "1200px",
//};
//const device = {
//  xs: `(min-width: ${size.xs})`,
//  sm: `(min-width: ${size.sm})`,
//  lg: `(min-width: ${size.lg})`,
//
//  portrait: `screen and (orientation:portrait)`,
//  landscape: `screen and (min-width:320px) and (max-width:767px) and (orientation:landscape)`,
//};
