import React, { useEffect, useState } from "react";
import { ViewProps } from "react-native";

interface Props extends ViewProps {
  timeRender: number;
}

const LazyComponent = (props: Props) => {
  const [allowRender, setAllowRender] = useState(false);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setAllowRender(true);
    }, props.timeRender);

    return (() => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  }, []);

  if (!allowRender)
    return null;

  return(
    <>
      {props.children}
    </>
  );
};


export default LazyComponent;
