import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import placeHolder from "vueapp/placeHolder";

import "./index.scss";
const loadScript = (scope, url) => {
  return new Promise(function (resolve, reject) {
      try {
          let script = document.createElement('script');
          script.src = url;
          script.async = true;
          script.type = "text/javascript";
          script.onload = function () {
              resolve(scope);
          };
          script.onerror = function () {
              document.head.removeChild(script);
              reject(scope);
          };
          document.head.appendChild(script);
      }
      catch (ex) {
          reject(ex);
      }
  });
}

const loadModule = (scope, module) => {
  return new Promise(async (resolve) => {
      await __webpack_init_sharing__("default");
      const container = window[scope];
      if (container&&module) {
          await container.init(__webpack_share_scopes__.default);
          const factory = await window[scope].get(`./${module}`);
          const Module = factory();
          resolve(Module)
      }
      else
          resolve({});
  });
}

const App = () => {
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const [Dashboard,setDashboard] = useState(null);
  
  
  useEffect(() => {
    loadScript('dashboard','http://192.168.147.205:3001/remoteEntry.js').then(()=>{
      loadModule('dashboard','App').then((e)=>{
        setDashboard(e)
      })
    })
    placeHolder(headerRef.current,'Header');
    placeHolder(footerRef.current,'Footer');
  }, []);

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div ref={headerRef}></div>
      {Dashboard&&<Dashboard/>}
     Example app
      <div ref={footerRef}></div>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
