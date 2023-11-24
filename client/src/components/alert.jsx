import clsx from "clsx";
import React from "react";

const Alert = (props) => {
  return (
    <>
      {props.alert && (
        <div>
          <div
            className={clsx(
              `
      fixed z-50 right-2 top-2 items-center w-full max-w-xs p-4 mb-4
      bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border 
      rounded-lg shadow flex flex-col
      `,
              props.alert.type === "success"
                ? "bg-sky-600 border-sky-600"
                : props.alert.type === "warning"
                ? "bg-orange-600 border-orange-600"
                : "bg-red-600 border-red-600"
            )}
          >
            <div className="flex items-center w-full  max-w-xs">
              <div
                className={clsx(
                  `inline-flex items-center justify-center flex-shrink-0 w-8 h-8  rounded-lg className=dark:text-green-200 shadow-xl
        `,
                  props.alert.type === "success"
                    ? "text-green-500 bg-green-100"
                    : props.alert.type === "warning"
                    ? "text-orange-500 bg-orange-100"
                    : "text-red-500 bg-red-100"
                )}
              >
                {props.alert.type === "success" ? (
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                ) : props.alert.type === "warning" ? (
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                  </svg>
                )}
              </div>
              <div
                className={clsx(
                  `ms-3 text-sm font-semibold 
        `,
                  props.alert.type === "success"
                    ? "text-sky-900"
                    : props.alert.type === "warning"
                    ? "text-orange-700"
                    : "text-red-700"
                )}
              >
                {props.alert.msg}
              </div>
              <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-sky-900 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
                onClick={() => props.setAlert(null)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
