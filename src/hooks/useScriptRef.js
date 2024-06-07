import axios from "axios";
import Axios from "http";
import { useEffect, useRef, useState } from "react";

// ==============================|| ELEMENT REFERENCE HOOKS  ||============================== //

const useScriptRef = () => {
  const scripted = useRef(true);

  scripted.api = async ({ url, body, method }) => {
    const result = await Axios.request({
      url: url,
      method: method,
      data: body,
    })
      .then((res) => {
        console.log("res: " + res);
        return res;
      })
      .catch((error) => {
        console.log("error: " + error);
        return error;
      });

    console.log("axios result error: " + result);

    return result;
  };

  return scripted;
};

export default useScriptRef;
